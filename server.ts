import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import { MOCK_LISTINGS, INITIAL_USER_PREFERENCES } from './src/data/mockListings.js';
import { Listing, UserPreferences, AIAnalysis } from './src/types.js';

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory store initialized with seed mock listings
let listingsStore: Listing[] = [...MOCK_LISTINGS];
const aiCache = new Map<string, AIAnalysis>();

// System prompt for OpenAI/Gemini evaluation
const AI_SYSTEM_PROMPT = `You are a ruthless real estate consumer advocate and financial consultant. Analyze the provided apartment listing against the user's budget, neighborhood criteria, commute targets, and feature preferences. Be completely honest. Identify hidden expenses, unrealistic deposits, location concerns, and strict lease terms. Return structured output strictly matching the provided JSON schema.`;

// Gemini AI client initialization
function getGenAIClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Heuristic fallback calculator when AI service is unavailable
function generateHeuristicAnalysis(listing: Listing, prefs: UserPreferences): AIAnalysis {
  let score = 80;
  const pros: string[] = [];
  const cons: string[] = [];
  const redFlags: { severity: 'LOW' | 'MEDIUM' | 'HIGH'; issue: string; explanation: string }[] = [];

  // Budget comparison
  if (listing.price <= prefs.maxBudget) {
    pros.push(`Fits within maximum budget of $${prefs.maxBudget}/mo (listed at $${listing.price}/mo).`);
    if (listing.price <= prefs.maxBudget * 0.85) {
      pros.push(`Great value! Rent is $${prefs.maxBudget - listing.price}/mo below your budget ceiling.`);
      score += 8;
    }
  } else {
    cons.push(`Exceeds maximum target budget of $${prefs.maxBudget}/mo by $${listing.price - prefs.maxBudget}/mo.`);
    score -= 18;
  }

  // Neighborhood match
  if (prefs.preferredNeighborhoods.includes(listing.neighborhood)) {
    pros.push(`Located in one of your top target neighborhoods (${listing.neighborhood}).`);
    score += 10;
  } else {
    cons.push(`Located in ${listing.neighborhood}, which is outside your selected neighborhood wishlist.`);
    score -= 8;
  }

  // Commute match
  if (listing.commuteTimeMinutes !== undefined) {
    if (listing.commuteTimeMinutes <= prefs.maxCommuteMinutes) {
      pros.push(`Short commute time of ~${listing.commuteTimeMinutes} mins to your workplace (${prefs.workplaceAddress || 'work'}).`);
      score += 5;
    } else {
      cons.push(`Commute time (~${listing.commuteTimeMinutes} mins) exceeds your maximum preference (${prefs.maxCommuteMinutes} mins).`);
      score -= 10;
    }
  }

  // Pet policy & specs
  if (prefs.petsAllowedRequired) {
    if (listing.petPolicy.toLowerCase().includes('no pets')) {
      redFlags.push({
        severity: 'HIGH',
        issue: 'Strict No Pets Policy',
        explanation: 'This property explicitly forbids pets, which directly conflicts with your pet requirement.',
      });
      score -= 25;
    } else {
      pros.push('Pet friendly property suitable for your pets.');
    }
  }

  // Laundry check
  if (prefs.inUnitLaundryRequired && !listing.amenities.includes('In-Unit Laundry')) {
    cons.push('Does not offer in-unit washer/dryer (shared/basement or no laundry).');
    score -= 7;
  }

  // Red flags scan in description & lease terms
  const lowerDesc = (listing.description + ' ' + (listing.leaseTerms || '')).toLowerCase();
  
  if (listing.deposit > listing.price * 1.5) {
    redFlags.push({
      severity: 'HIGH',
      issue: 'Excessive Security Deposit',
      explanation: `Required security deposit ($${listing.deposit}) is over 1.5x monthly rent, requiring high initial capital.`,
    });
  }

  if (lowerDesc.includes('non-refundable') || lowerDesc.includes('admin fee') || lowerDesc.includes('billback') || lowerDesc.includes('mandatory')) {
    redFlags.push({
      severity: 'MEDIUM',
      issue: 'Hidden Mandatory Fees',
      explanation: 'Listing mentions mandatory resident fees, non-refundable move-in admin charges, or utility billbacks.',
    });
  }

  if (lowerDesc.includes('noise') || lowerDesc.includes('construction') || lowerDesc.includes('garbage chute') || lowerDesc.includes('elevator maintenance')) {
    redFlags.push({
      severity: 'MEDIUM',
      issue: 'Potential Noise or Disruptions',
      explanation: 'Disclosures indicate upcoming elevator maintenance, garbage chute proximity, or construction noise.',
    });
  }

  if (lowerDesc.includes('no subletting') || lowerDesc.includes('overnight guest') || lowerDesc.includes('inspection')) {
    redFlags.push({
      severity: 'LOW',
      issue: 'Restrictive Lease Rules',
      explanation: 'Lease includes restrictive clauses regarding guest stays, inspection rights, or subletting bans.',
    });
  }

  // Standard pros fallback
  if (pros.length < 3) {
    pros.push(`Includes ${listing.sqft} sqft of living space ($${Math.round(listing.price / listing.sqft)}/sqft).`);
    pros.push(`Building constructed in ${listing.yearBuilt} with updated interior specs.`);
  }

  score = Math.min(99, Math.max(25, score));

  return {
    listingId: listing.id,
    matchScore: score,
    pros: pros.slice(0, 5),
    cons: cons.slice(0, 5),
    redFlags,
    verdict: score >= 80 
      ? `Strongly recommended listing. Fits well within your core parameters with manageable trade-offs.`
      : score >= 65 
      ? `Viable option with minor compromises. Review red flag disclosures and fee structures carefully before applying.`
      : `High risk or poor fit based on your priority weighting. Consider exploring alternative properties first.`,
    analyzedAt: new Date().toISOString(),
  };
}

// GET all listings
app.get('/api/listings', (req, res) => {
  res.json({
    success: true,
    data: listingsStore,
  });
});

// GET single listing
app.get('/api/listings/:id', (req, res) => {
  const listing = listingsStore.find((l) => l.id === req.params.id);
  if (!listing) {
    return res.status(404).json({ success: false, error: 'Listing not found' });
  }
  res.json({ success: true, data: listing });
});

// POST custom listing
app.post('/api/listings', (req, res) => {
  const newListing: Listing = {
    id: `custom-${Date.now()}`,
    title: req.body.title || 'Custom Apartment Listing',
    description: req.body.description || 'User added apartment listing.',
    price: Number(req.body.price) || 3000,
    address: req.body.address || '100 Main St',
    neighborhood: req.body.neighborhood || 'Downtown',
    city: req.body.city || 'San Francisco',
    lat: Number(req.body.lat) || 37.7749,
    lng: Number(req.body.lng) || -122.4194,
    bedrooms: Number(req.body.bedrooms) || 1,
    bathrooms: Number(req.body.bathrooms) || 1,
    sqft: Number(req.body.sqft) || 700,
    amenities: Array.isArray(req.body.amenities) ? req.body.amenities : ['Dishwasher', 'Laundry'],
    images: req.body.images?.length ? req.body.images : ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80'],
    deposit: Number(req.body.deposit) || Number(req.body.price) || 3000,
    leaseTerms: req.body.leaseTerms || '12-month standard lease',
    utilitiesIncluded: Array.isArray(req.body.utilitiesIncluded) ? req.body.utilitiesIncluded : ['Water'],
    petPolicy: req.body.petPolicy || 'Pets allowed',
    parkingInfo: req.body.parkingInfo || 'Street parking',
    floor: Number(req.body.floor) || 1,
    yearBuilt: Number(req.body.yearBuilt) || 2020,
    availableDate: req.body.availableDate || '2026-09-01',
    commuteTimeMinutes: Number(req.body.commuteTimeMinutes) || 20,
    isAvailable: true,
  };

  listingsStore.unshift(newListing);
  res.status(201).json({ success: true, data: newListing });
});

// POST AI evaluation endpoint
app.post('/api/ai/analyze', async (req, res) => {
  try {
    const { listing, preferences } = req.body;
    if (!listing) {
      return res.status(400).json({ success: false, error: 'Listing payload is required' });
    }

    const userPrefs: UserPreferences = preferences || INITIAL_USER_PREFERENCES;
    const ai = getGenAIClient();

    if (!ai) {
      console.log('GEMINI_API_KEY not found, serving fallback heuristic evaluation.');
      const fallback = generateHeuristicAnalysis(listing, userPrefs);
      return res.json({ success: true, data: fallback, source: 'heuristic' });
    }

    const promptText = `
User Profile & Priorities:
- Target Rent Range: $${userPrefs.minBudget} - $${userPrefs.maxBudget}/month
- Preferred Neighborhoods: ${userPrefs.preferredNeighborhoods?.join(', ') || 'Any'}
- Workplace Address: ${userPrefs.workplaceAddress || 'Not specified'}
- Max Commute Goal: ${userPrefs.maxCommuteMinutes} mins
- Minimum Bedrooms: ${userPrefs.bedMin}, Bathrooms: ${userPrefs.bathMin}, SqFt: ${userPrefs.minSqft}
- Mandatory Requirements: Pets Allowed: ${userPrefs.petsAllowedRequired}, In-Unit Laundry: ${userPrefs.inUnitLaundryRequired}, Parking: ${userPrefs.parkingRequired}
- Priority Weighting: Budget=${userPrefs.weights?.budget}, Commute=${userPrefs.weights?.commute}, Size=${userPrefs.weights?.size}, Amenities=${userPrefs.weights?.amenities}, Pets=${userPrefs.weights?.petFriendly}

Apartment Listing Details:
- Title: ${listing.title}
- Price: $${listing.price}/month
- Address: ${listing.address}, ${listing.neighborhood}, ${listing.city}
- Specs: ${listing.bedrooms} Bed, ${listing.bathrooms} Bath, ${listing.sqft} sqft ($${Math.round(listing.price / (listing.sqft || 1))}/sqft)
- Estimated Commute: ~${listing.commuteTimeMinutes ?? 20} minutes
- Security Deposit: $${listing.deposit}
- Lease Terms: ${listing.leaseTerms}
- Description: ${listing.description}
- Pet Policy: ${listing.petPolicy}
- Parking: ${listing.parkingInfo}
- Included Utilities: ${listing.utilitiesIncluded?.join(', ') || 'None'}
- Amenities: ${listing.amenities?.join(', ') || 'Standard'}

Evaluate this property thoroughly. Calculate a realistic Match Score (0-100%). List 3-5 distinct pros tailored to this user, 3-5 trade-offs/cons, identify any hidden red flags or lease risks, and provide a 2-sentence executive verdict recommendation.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: promptText,
      config: {
        systemInstruction: AI_SYSTEM_PROMPT,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            matchScore: {
              type: Type.INTEGER,
              description: 'Compatibility score from 0 to 100 based on user preferences and priority weights.',
            },
            pros: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'List of 3 to 5 major advantages tailored to this specific user.',
            },
            cons: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'List of 3 to 5 trade-offs, compromises, or disadvantages.',
            },
            redFlags: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  severity: {
                    type: Type.STRING,
                    description: 'Severity level: LOW, MEDIUM, or HIGH',
                  },
                  issue: {
                    type: Type.STRING,
                    description: 'Brief name of the concern or red flag.',
                  },
                  explanation: {
                    type: Type.STRING,
                    description: 'Detailed explanation of why this is a potential risk or fee.',
                  },
                },
              },
              description: 'Any hidden costs, lease concerns, or suspicious disclosures.',
            },
            verdict: {
              type: Type.STRING,
              description: 'A concise 2-sentence summary recommendation.',
            },
          },
        },
      },
    });

    if (!response.text) {
      const fallback = generateHeuristicAnalysis(listing, userPrefs);
      return res.json({ success: true, data: fallback, source: 'fallback' });
    }

    const parsedData = JSON.parse(response.text.trim());

    const analysisResult: AIAnalysis = {
      listingId: listing.id,
      matchScore: Math.min(100, Math.max(0, parsedData.matchScore || 75)),
      pros: parsedData.pros || [],
      cons: parsedData.cons || [],
      redFlags: (parsedData.redFlags || []).map((rf: any) => ({
        severity: ['LOW', 'MEDIUM', 'HIGH'].includes(rf.severity) ? rf.severity : 'MEDIUM',
        issue: String(rf.issue || 'Lease Concern'),
        explanation: String(rf.explanation || 'Requires review.'),
      })),
      verdict: parsedData.verdict || 'A suitable option for your search criteria.',
      analyzedAt: new Date().toISOString(),
    };

    aiCache.set(listing.id, analysisResult);
    res.json({ success: true, data: analysisResult, source: 'gemini-3.6-flash' });
  } catch (err: any) {
    console.error('Error in AI analysis route handler:', err?.message || err);
    if (req.body?.listing) {
      const fallback = generateHeuristicAnalysis(req.body.listing, req.body.preferences || INITIAL_USER_PREFERENCES);
      return res.json({ success: true, data: fallback, source: 'error-fallback' });
    }
    res.status(500).json({ success: false, error: 'AI Evaluation failed' });
  }
});

// Vite Integration for dev & prod
async function setupVite() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

setupVite();
