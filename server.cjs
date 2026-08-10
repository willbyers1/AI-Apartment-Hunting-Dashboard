var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_genai = require("@google/genai");

// src/data/mockListings.ts
var INITIAL_USER_PREFERENCES = {
  minBudget: 2200,
  maxBudget: 3800,
  preferredNeighborhoods: ["Mission District", "SoMa", "Hayes Valley", "Pacific Heights", "Williamsburg"],
  bedMin: 1,
  bathMin: 1,
  minSqft: 650,
  workplaceAddress: "500 Howard St, San Francisco, CA",
  maxCommuteMinutes: 30,
  petsAllowedRequired: true,
  inUnitLaundryRequired: true,
  parkingRequired: false,
  balconyRequired: false,
  weights: {
    budget: "CRITICAL",
    commute: "HIGH",
    size: "MEDIUM",
    amenities: "MEDIUM",
    petFriendly: "HIGH"
  }
};
var MOCK_LISTINGS = [
  {
    id: "apt-101",
    title: "Modern High-Rise Sanctuary with Bay Views",
    description: "Sleek luxury 1-bedroom suite featuring floor-to-ceiling double-paned windows, designer quartz countertops, Bosch stainless appliances, and in-unit washer/dryer. Building includes 24/7 concierge, state-of-the-art fitness hub, and heated rooftop lap pool. *Note: Non-refundable $500 move-in fee applies. Resident is responsible for all sub-metered water, trash, sewer, and electric services. Parking space available for $375/mo extra.*",
    price: 3250,
    address: "425 Mission St #18B",
    neighborhood: "SoMa",
    city: "San Francisco",
    lat: 37.7897,
    lng: -122.3972,
    bedrooms: 1,
    bathrooms: 1,
    sqft: 720,
    amenities: ["In-Unit Laundry", "Dishwasher", "Concierge", "Gym", "Pool", "Elevator", "Pet Friendly", "Central AC"],
    images: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1000&q=80"
    ],
    deposit: 3250,
    leaseTerms: "12-month minimum. Requires 3x income verification and 700+ credit score. $500 non-refundable move-in admin fee.",
    utilitiesIncluded: ["Internet High-Speed"],
    petPolicy: "Dogs & Cats allowed ($50/mo per pet + $300 pet deposit). Max 2 pets.",
    parkingInfo: "Assigned garage space available for $375/month.",
    floor: 18,
    yearBuilt: 2021,
    availableDate: "2026-08-15",
    commuteTimeMinutes: 8,
    isAvailable: true,
    contactEmail: "leasing@missiontower.com",
    contactPhone: "(415) 555-0142"
  },
  {
    id: "apt-102",
    title: "Charming Victorian Flat with Private Garden Terrace",
    description: "Sun-drenched, character-filled 2-bedroom Victorian flat with original crown moldings, hardwood floors, updated kitchen with gas range, and exclusive access to a serene backyard garden terrace. Located steps from Valencia Street cafes and BART. *Lease clause: Landlord retains right to conduct quarterly unit inspections with 24h notice. Mandatory $150/mo utility billback fee for garbage and water.*",
    price: 3100,
    address: "742 Valencia St",
    neighborhood: "Mission District",
    city: "San Francisco",
    lat: 37.7601,
    lng: -122.4215,
    bedrooms: 2,
    bathrooms: 1,
    sqft: 880,
    amenities: ["Private Garden", "Balcony", "Hardwood Floors", "Dishwasher", "Gas Range", "Pet Friendly", "Storage Unit"],
    images: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=80"
    ],
    deposit: 6200,
    // High deposit red flag!
    leaseTerms: "12-month lease. Security deposit is 2x monthly rent ($6,200). $150/mo utility billback fee.",
    utilitiesIncluded: ["Water", "Trash"],
    petPolicy: "Cats only with landlord approval ($25/mo pet fee). No dogs allowed.",
    parkingInfo: "Street parking with SF City Permit (~$170/yr). No dedicated parking.",
    floor: 1,
    yearBuilt: 1908,
    availableDate: "2026-09-01",
    commuteTimeMinutes: 18,
    isAvailable: true,
    contactEmail: "valencia.flats@gmail.com",
    contactPhone: "(415) 555-0199"
  },
  {
    id: "apt-103",
    title: "Boutique Loft in Hayes Valley Core",
    description: "Architectural masterpiece studio/1BR flex loft with soaring 14ft ceilings, exposed concrete accent walls, private balcony overlooking Patricia\u2019s Green, in-unit washer/dryer, and Nest climate control. Quiet courtyard-facing unit. *Alert: Mandatory $220/mo HOA Resident Amenities Fee mandatory regardless of facility usage. Subletting or Airbnb hosting strictly causes immediate lease termination and forfeiture of full deposit.*",
    price: 2850,
    address: "388 Fulton St #304",
    neighborhood: "Hayes Valley",
    city: "San Francisco",
    lat: 37.7778,
    lng: -122.4241,
    bedrooms: 1,
    bathrooms: 1,
    sqft: 610,
    amenities: ["In-Unit Laundry", "Balcony", "Dishwasher", "Nest Thermostat", "Courtyard", "Bike Storage", "Elevator"],
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?auto=format&fit=crop&w=1000&q=80"
    ],
    deposit: 2850,
    leaseTerms: "12-month lease. $220 mandatory monthly HOA resident package fee.",
    utilitiesIncluded: ["Water", "Gas", "Trash"],
    petPolicy: "Pet friendly for dogs under 35 lbs and cats. $35/mo pet rent.",
    parkingInfo: "Stacker parking space available for $275/mo.",
    floor: 3,
    yearBuilt: 2018,
    availableDate: "2026-08-10",
    commuteTimeMinutes: 14,
    isAvailable: true,
    contactEmail: "hayesloft@pm.com",
    contactPhone: "(415) 555-0822"
  },
  {
    id: "apt-104",
    title: "Grand Pacific Heights 2BR with Golden Gate Light",
    description: "Classic luxury apartment in prestigious Pacific Heights pre-war elevator building. Features expansive living room with working fireplace, renovated eat-in kitchen with custom cabinetry, double closets in primary suite, and immaculate hardwood flooring throughout. *Important: Building washer/dryer is coin-operated in basement ($4.50/wash load). No pets allowed under any circumstance.*",
    price: 3650,
    address: "2200 Broadway #4B",
    neighborhood: "Pacific Heights",
    city: "San Francisco",
    lat: 37.7941,
    lng: -122.4339,
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1050,
    amenities: ["Fireplace", "Elevator", "Hardwood Floors", "Dishwasher", "Storage Room", "On-site Manager", "Bay Windows"],
    images: [
      "https://images.unsplash.com/photo-1502672016976-1e649060010d?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1567496898669-ee935f5f647a?auto=format&fit=crop&w=1000&q=80"
    ],
    deposit: 3650,
    leaseTerms: "12-month lease. Strict quiet hours after 10 PM. No subletting.",
    utilitiesIncluded: ["Water", "Steam Heating", "Trash"],
    petPolicy: "Strict NO PETS policy.",
    parkingInfo: "1 outdoor reserved parking spot included at no extra charge!",
    floor: 4,
    yearBuilt: 1930,
    availableDate: "2026-08-20",
    commuteTimeMinutes: 24,
    isAvailable: true,
    contactEmail: "pacheights@bayproperties.org",
    contactPhone: "(415) 555-0311"
  },
  {
    id: "apt-105",
    title: "Sunlit Waterfront Marina District 1BR Studio",
    description: "Bright and airy 1-bedroom corner residence just two blocks from Marina Green and Chestnut Street shopping. Updated galley kitchen with stone countertops, tiled bath, ample closet space, and dedicated bike storage room. *Note: Ground floor unit adjacent to building garbage chute with potential early morning collection noise. Rent increases by fixed 8% upon lease renewal option.*",
    price: 2600,
    address: "3300 Pierce St #102",
    neighborhood: "Marina",
    city: "San Francisco",
    lat: 37.8015,
    lng: -122.4411,
    bedrooms: 1,
    bathrooms: 1,
    sqft: 640,
    amenities: ["Hardwood Floors", "Dishwasher", "Shared Laundry", "Bike Storage", "Gated Entry"],
    images: [
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1000&q=80"
    ],
    deposit: 2600,
    leaseTerms: "12-month lease. Guaranteed 8% rent increase at 12-month renewal contract.",
    utilitiesIncluded: ["Water", "Garbage"],
    petPolicy: "Cats allowed ($25/mo). No dogs.",
    parkingInfo: "Street parking only.",
    floor: 1,
    yearBuilt: 1964,
    availableDate: "2026-08-01",
    commuteTimeMinutes: 28,
    isAvailable: true,
    contactEmail: "marina.pierce@sfrentals.com",
    contactPhone: "(415) 555-0771"
  },
  {
    id: "apt-106",
    title: "Industrial Luxe Williamsburg Waterfront Loft",
    description: "Authentic industrial brick loft in prime Williamsburg. Features exposed wood beams, 12ft timber ceilings, wide plank oak floors, state-of-the-art kitchen with Viking range, in-unit washer/dryer, and private balcony with East River views. *Notice: Building is currently undergoing elevator maintenance scheduled through November (walk-up 4th floor required until completed).*",
    price: 3750,
    address: "184 Kent Ave #4F",
    neighborhood: "Williamsburg",
    city: "New York",
    lat: 40.7181,
    lng: -73.9632,
    bedrooms: 1,
    bathrooms: 1,
    sqft: 810,
    amenities: ["In-Unit Laundry", "Balcony", "Viking Range", "Doorman", "Rooftop Deck", "Dishwasher", "Pet Friendly"],
    images: [
      "https://images.unsplash.com/photo-1515263487990-61b07816b324?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1000&q=80"
    ],
    deposit: 3750,
    leaseTerms: "12-month lease. Broker fee equal to 1 month rent ($3,750).",
    utilitiesIncluded: ["Heat", "Hot Water"],
    petPolicy: "Dogs and cats welcome! No breed restrictions.",
    parkingInfo: "Garage parking available across street.",
    floor: 4,
    yearBuilt: 1915,
    availableDate: "2026-09-01",
    commuteTimeMinutes: 22,
    isAvailable: true,
    contactEmail: "brooklyn.lofts@compass.com",
    contactPhone: "(718) 555-0182"
  },
  {
    id: "apt-107",
    title: "Ultra-Quiet Nob Hill Penthouse Junior 1BR",
    description: "Charming, light-filled penthouse studio/junior 1-bedroom atop Nob Hill. Features updated kitchen with stainless appliances, original telephone nook, walk-in closet, and breathtaking city skyline panoramas. *Quiet building suited for professionals. Strict no-overnight guest policy exceeding 3 consecutive nights per month.*",
    price: 2450,
    address: "1050 Green St #6A",
    neighborhood: "Nob Hill",
    city: "San Francisco",
    lat: 37.7981,
    lng: -122.4162,
    bedrooms: 1,
    bathrooms: 1,
    sqft: 580,
    amenities: ["City View", "Elevator", "Dishwasher", "Hardwood Floors", "Laundry in Building"],
    images: [
      "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1000&q=80"
    ],
    deposit: 2450,
    leaseTerms: "12-month lease. Strict max 3 consecutive overnight guests rule.",
    utilitiesIncluded: ["Water", "Gas", "Trash"],
    petPolicy: "No pets allowed.",
    parkingInfo: "Street parking only (steep incline hill).",
    floor: 6,
    yearBuilt: 1928,
    availableDate: "2026-08-05",
    commuteTimeMinutes: 16,
    isAvailable: true,
    contactEmail: "nobhillrentals@gmail.com",
    contactPhone: "(415) 555-0909"
  },
  {
    id: "apt-108",
    title: "Downton Austin Eco-Luxury Sky Flat",
    description: "LEED-Certified luxury tower apartment right off Lady Bird Lake and South Congress. Features private balcony, Italian cabinetry, smart lock keyless entry, stainless steel appliances, full-size washer/dryer, and resort-style infinity pool deck with cabanas. *Notice: Mandatory $180/mo tech & amenity package includes gigabit fiber Wi-Fi and valet trash.*",
    price: 2950,
    address: "300 Colorado St #2204",
    neighborhood: "Downtown Austin",
    city: "Austin",
    lat: 30.2672,
    lng: -97.7431,
    bedrooms: 1,
    bathrooms: 1,
    sqft: 790,
    amenities: ["In-Unit Laundry", "Balcony", "Pool", "Gym", "Pet Spa", "Fiber Internet", "Ev Charging", "Covered Parking"],
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80"
    ],
    deposit: 1e3,
    leaseTerms: "12-month lease. $180/mo mandatory technology and amenity fee.",
    utilitiesIncluded: ["Gigabit Fiber Internet"],
    petPolicy: "Pet friendly! On-site dog park and pet spa ($35/mo per pet).",
    parkingInfo: "1 reserved garage space included.",
    floor: 22,
    yearBuilt: 2022,
    availableDate: "2026-08-01",
    commuteTimeMinutes: 12,
    isAvailable: true,
    contactEmail: "austinsky@greystar.com",
    contactPhone: "(512) 555-0120"
  },
  {
    id: "apt-109",
    title: "Harbourfront Glass Suite with CN Tower Views",
    description: "Sleek modern 1-bedroom condo in Toronto Harbourfront. Floor-to-ceiling glass, quartz countertops, integrated Miele appliances, private balcony, and in-unit washer/dryer. Building amenities include 24h concierge, sauna, indoor pool, and sky lounge. *Notice: 1st and last month rent required upfront. Key deposit of $250 CAD mandatory.*",
    price: 2700,
    address: "88 Harbour St #2904",
    neighborhood: "Downtown Toronto",
    city: "Toronto",
    lat: 43.6426,
    lng: -79.3808,
    bedrooms: 1,
    bathrooms: 1,
    sqft: 680,
    amenities: ["In-Unit Laundry", "Balcony", "Pool", "Gym", "Concierge", "Sauna", "Pet Friendly"],
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80"
    ],
    deposit: 2700,
    leaseTerms: "12-month standard Ontario lease contract. First & last month rent required upon signing.",
    utilitiesIncluded: ["Water", "Heating"],
    petPolicy: "Pet friendly condo (max 1 pet under 40 lbs).",
    parkingInfo: "Underground locker and parking available for $200/mo.",
    floor: 29,
    yearBuilt: 2020,
    availableDate: "2026-09-01",
    commuteTimeMinutes: 15,
    isAvailable: true,
    contactEmail: "leasing@torontoharbour.ca",
    contactPhone: "(416) 555-0188"
  }
];

// server.ts
var app = (0, import_express.default)();
var PORT = 3e3;
app.use(import_express.default.json());
var listingsStore = [...MOCK_LISTINGS];
var aiCache = /* @__PURE__ */ new Map();
var AI_SYSTEM_PROMPT = `You are a ruthless real estate consumer advocate and financial consultant. Analyze the provided apartment listing against the user's budget, neighborhood criteria, commute targets, and feature preferences. Be completely honest. Identify hidden expenses, unrealistic deposits, location concerns, and strict lease terms. Return structured output strictly matching the provided JSON schema.`;
function getGenAIClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new import_genai.GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build"
      }
    }
  });
}
function generateHeuristicAnalysis(listing, prefs) {
  let score = 80;
  const pros = [];
  const cons = [];
  const redFlags = [];
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
  if (prefs.preferredNeighborhoods.includes(listing.neighborhood)) {
    pros.push(`Located in one of your top target neighborhoods (${listing.neighborhood}).`);
    score += 10;
  } else {
    cons.push(`Located in ${listing.neighborhood}, which is outside your selected neighborhood wishlist.`);
    score -= 8;
  }
  if (listing.commuteTimeMinutes !== void 0) {
    if (listing.commuteTimeMinutes <= prefs.maxCommuteMinutes) {
      pros.push(`Short commute time of ~${listing.commuteTimeMinutes} mins to your workplace (${prefs.workplaceAddress || "work"}).`);
      score += 5;
    } else {
      cons.push(`Commute time (~${listing.commuteTimeMinutes} mins) exceeds your maximum preference (${prefs.maxCommuteMinutes} mins).`);
      score -= 10;
    }
  }
  if (prefs.petsAllowedRequired) {
    if (listing.petPolicy.toLowerCase().includes("no pets")) {
      redFlags.push({
        severity: "HIGH",
        issue: "Strict No Pets Policy",
        explanation: "This property explicitly forbids pets, which directly conflicts with your pet requirement."
      });
      score -= 25;
    } else {
      pros.push("Pet friendly property suitable for your pets.");
    }
  }
  if (prefs.inUnitLaundryRequired && !listing.amenities.includes("In-Unit Laundry")) {
    cons.push("Does not offer in-unit washer/dryer (shared/basement or no laundry).");
    score -= 7;
  }
  const lowerDesc = (listing.description + " " + (listing.leaseTerms || "")).toLowerCase();
  if (listing.deposit > listing.price * 1.5) {
    redFlags.push({
      severity: "HIGH",
      issue: "Excessive Security Deposit",
      explanation: `Required security deposit ($${listing.deposit}) is over 1.5x monthly rent, requiring high initial capital.`
    });
  }
  if (lowerDesc.includes("non-refundable") || lowerDesc.includes("admin fee") || lowerDesc.includes("billback") || lowerDesc.includes("mandatory")) {
    redFlags.push({
      severity: "MEDIUM",
      issue: "Hidden Mandatory Fees",
      explanation: "Listing mentions mandatory resident fees, non-refundable move-in admin charges, or utility billbacks."
    });
  }
  if (lowerDesc.includes("noise") || lowerDesc.includes("construction") || lowerDesc.includes("garbage chute") || lowerDesc.includes("elevator maintenance")) {
    redFlags.push({
      severity: "MEDIUM",
      issue: "Potential Noise or Disruptions",
      explanation: "Disclosures indicate upcoming elevator maintenance, garbage chute proximity, or construction noise."
    });
  }
  if (lowerDesc.includes("no subletting") || lowerDesc.includes("overnight guest") || lowerDesc.includes("inspection")) {
    redFlags.push({
      severity: "LOW",
      issue: "Restrictive Lease Rules",
      explanation: "Lease includes restrictive clauses regarding guest stays, inspection rights, or subletting bans."
    });
  }
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
    verdict: score >= 80 ? `Strongly recommended listing. Fits well within your core parameters with manageable trade-offs.` : score >= 65 ? `Viable option with minor compromises. Review red flag disclosures and fee structures carefully before applying.` : `High risk or poor fit based on your priority weighting. Consider exploring alternative properties first.`,
    analyzedAt: (/* @__PURE__ */ new Date()).toISOString()
  };
}
app.get("/api/listings", (req, res) => {
  res.json({
    success: true,
    data: listingsStore
  });
});
app.get("/api/listings/:id", (req, res) => {
  const listing = listingsStore.find((l) => l.id === req.params.id);
  if (!listing) {
    return res.status(404).json({ success: false, error: "Listing not found" });
  }
  res.json({ success: true, data: listing });
});
app.post("/api/listings", (req, res) => {
  const newListing = {
    id: `custom-${Date.now()}`,
    title: req.body.title || "Custom Apartment Listing",
    description: req.body.description || "User added apartment listing.",
    price: Number(req.body.price) || 3e3,
    address: req.body.address || "100 Main St",
    neighborhood: req.body.neighborhood || "Downtown",
    city: req.body.city || "San Francisco",
    lat: Number(req.body.lat) || 37.7749,
    lng: Number(req.body.lng) || -122.4194,
    bedrooms: Number(req.body.bedrooms) || 1,
    bathrooms: Number(req.body.bathrooms) || 1,
    sqft: Number(req.body.sqft) || 700,
    amenities: Array.isArray(req.body.amenities) ? req.body.amenities : ["Dishwasher", "Laundry"],
    images: req.body.images?.length ? req.body.images : ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80"],
    deposit: Number(req.body.deposit) || Number(req.body.price) || 3e3,
    leaseTerms: req.body.leaseTerms || "12-month standard lease",
    utilitiesIncluded: Array.isArray(req.body.utilitiesIncluded) ? req.body.utilitiesIncluded : ["Water"],
    petPolicy: req.body.petPolicy || "Pets allowed",
    parkingInfo: req.body.parkingInfo || "Street parking",
    floor: Number(req.body.floor) || 1,
    yearBuilt: Number(req.body.yearBuilt) || 2020,
    availableDate: req.body.availableDate || "2026-09-01",
    commuteTimeMinutes: Number(req.body.commuteTimeMinutes) || 20,
    isAvailable: true
  };
  listingsStore.unshift(newListing);
  res.status(201).json({ success: true, data: newListing });
});
app.post("/api/ai/analyze", async (req, res) => {
  try {
    const { listing, preferences } = req.body;
    if (!listing) {
      return res.status(400).json({ success: false, error: "Listing payload is required" });
    }
    const userPrefs = preferences || INITIAL_USER_PREFERENCES;
    const ai = getGenAIClient();
    if (!ai) {
      console.log("GEMINI_API_KEY not found, serving fallback heuristic evaluation.");
      const fallback = generateHeuristicAnalysis(listing, userPrefs);
      return res.json({ success: true, data: fallback, source: "heuristic" });
    }
    const promptText = `
User Profile & Priorities:
- Target Rent Range: $${userPrefs.minBudget} - $${userPrefs.maxBudget}/month
- Preferred Neighborhoods: ${userPrefs.preferredNeighborhoods?.join(", ") || "Any"}
- Workplace Address: ${userPrefs.workplaceAddress || "Not specified"}
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
- Included Utilities: ${listing.utilitiesIncluded?.join(", ") || "None"}
- Amenities: ${listing.amenities?.join(", ") || "Standard"}

Evaluate this property thoroughly. Calculate a realistic Match Score (0-100%). List 3-5 distinct pros tailored to this user, 3-5 trade-offs/cons, identify any hidden red flags or lease risks, and provide a 2-sentence executive verdict recommendation.
    `;
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: promptText,
      config: {
        systemInstruction: AI_SYSTEM_PROMPT,
        responseMimeType: "application/json",
        responseSchema: {
          type: import_genai.Type.OBJECT,
          properties: {
            matchScore: {
              type: import_genai.Type.INTEGER,
              description: "Compatibility score from 0 to 100 based on user preferences and priority weights."
            },
            pros: {
              type: import_genai.Type.ARRAY,
              items: { type: import_genai.Type.STRING },
              description: "List of 3 to 5 major advantages tailored to this specific user."
            },
            cons: {
              type: import_genai.Type.ARRAY,
              items: { type: import_genai.Type.STRING },
              description: "List of 3 to 5 trade-offs, compromises, or disadvantages."
            },
            redFlags: {
              type: import_genai.Type.ARRAY,
              items: {
                type: import_genai.Type.OBJECT,
                properties: {
                  severity: {
                    type: import_genai.Type.STRING,
                    description: "Severity level: LOW, MEDIUM, or HIGH"
                  },
                  issue: {
                    type: import_genai.Type.STRING,
                    description: "Brief name of the concern or red flag."
                  },
                  explanation: {
                    type: import_genai.Type.STRING,
                    description: "Detailed explanation of why this is a potential risk or fee."
                  }
                }
              },
              description: "Any hidden costs, lease concerns, or suspicious disclosures."
            },
            verdict: {
              type: import_genai.Type.STRING,
              description: "A concise 2-sentence summary recommendation."
            }
          }
        }
      }
    });
    if (!response.text) {
      const fallback = generateHeuristicAnalysis(listing, userPrefs);
      return res.json({ success: true, data: fallback, source: "fallback" });
    }
    const parsedData = JSON.parse(response.text.trim());
    const analysisResult = {
      listingId: listing.id,
      matchScore: Math.min(100, Math.max(0, parsedData.matchScore || 75)),
      pros: parsedData.pros || [],
      cons: parsedData.cons || [],
      redFlags: (parsedData.redFlags || []).map((rf) => ({
        severity: ["LOW", "MEDIUM", "HIGH"].includes(rf.severity) ? rf.severity : "MEDIUM",
        issue: String(rf.issue || "Lease Concern"),
        explanation: String(rf.explanation || "Requires review.")
      })),
      verdict: parsedData.verdict || "A suitable option for your search criteria.",
      analyzedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    aiCache.set(listing.id, analysisResult);
    res.json({ success: true, data: analysisResult, source: "gemini-3.6-flash" });
  } catch (err) {
    console.error("Error in AI analysis route handler:", err?.message || err);
    if (req.body?.listing) {
      const fallback = generateHeuristicAnalysis(req.body.listing, req.body.preferences || INITIAL_USER_PREFERENCES);
      return res.json({ success: true, data: fallback, source: "error-fallback" });
    }
    res.status(500).json({ success: false, error: "AI Evaluation failed" });
  }
});
async function setupVite() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}
setupVite();
//# sourceMappingURL=server.cjs.map
