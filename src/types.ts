export type PriorityWeight = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export interface PriorityWeights {
  budget: PriorityWeight;
  commute: PriorityWeight;
  size: PriorityWeight;
  amenities: PriorityWeight;
  petFriendly: PriorityWeight;
}

export interface UserPreferences {
  minBudget: number;
  maxBudget: number;
  preferredNeighborhoods: string[];
  bedMin: number;
  bathMin: number;
  minSqft: number;
  workplaceAddress: string;
  maxCommuteMinutes: number;
  petsAllowedRequired: boolean;
  inUnitLaundryRequired: boolean;
  parkingRequired: boolean;
  balconyRequired: boolean;
  weights: PriorityWeights;
}

export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  address: string;
  neighborhood: string;
  city: string;
  lat: number;
  lng: number;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  amenities: string[];
  images: string[];
  deposit: number;
  leaseTerms: string;
  utilitiesIncluded: string[];
  petPolicy: string;
  parkingInfo: string;
  floor: number;
  yearBuilt: number;
  availableDate: string;
  commuteTimeMinutes?: number;
  isAvailable: boolean;
  contactEmail?: string;
  contactPhone?: string;
}

export interface RedFlag {
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  issue: string;
  explanation: string;
}

export interface AIAnalysis {
  listingId: string;
  matchScore: number;
  pros: string[];
  cons: string[];
  redFlags: RedFlag[];
  verdict: string;
  analyzedAt?: string;
}

export interface FilterState {
  searchKeyword: string;
  minPrice: number;
  maxPrice: number;
  neighborhoods: string[];
  bedMin: number;
  bathMin: number;
  petsAllowed: boolean;
  inUnitLaundry: boolean;
  parking: boolean;
  maxCommute: number;
  sortBy: 'match' | 'price_asc' | 'price_desc' | 'sqft' | 'score';
}
