/**
 * Niche → Instantly SuperSearch industry/subIndustry/title mapping.
 * Used by both the supersearch proxy route and the outreach cron pipeline.
 *
 * Valid Instantly industry enum values:
 * Agriculture & Mining, Business Services, Computers & Electronics,
 * Consumer Services, Education, Energy & Utilities, Financial Services,
 * Government, Healthcare Pharmaceuticals & Biotech, Manufacturing,
 * Media & Entertainment, Non-Profit, Other, Real Estate & Construction,
 * Retail, Software & Internet, Telecommunications,
 * Transportation & Storage, Travel Recreation and Leisure,
 * Wholesale & Distribution
 */

// Map US state codes to full names — Instantly SuperSearch expects "Texas" not "TX"
const STATE_CODE_TO_NAME: Record<string, string> = {
  AL: 'Alabama', AK: 'Alaska', AZ: 'Arizona', AR: 'Arkansas', CA: 'California',
  CO: 'Colorado', CT: 'Connecticut', DE: 'Delaware', FL: 'Florida', GA: 'Georgia',
  HI: 'Hawaii', ID: 'Idaho', IL: 'Illinois', IN: 'Indiana', IA: 'Iowa',
  KS: 'Kansas', KY: 'Kentucky', LA: 'Louisiana', ME: 'Maine', MD: 'Maryland',
  MA: 'Massachusetts', MI: 'Michigan', MN: 'Minnesota', MS: 'Mississippi', MO: 'Missouri',
  MT: 'Montana', NE: 'Nebraska', NV: 'Nevada', NH: 'New Hampshire', NJ: 'New Jersey',
  NM: 'New Mexico', NY: 'New York', NC: 'North Carolina', ND: 'North Dakota', OH: 'Ohio',
  OK: 'Oklahoma', OR: 'Oregon', PA: 'Pennsylvania', RI: 'Rhode Island', SC: 'South Carolina',
  SD: 'South Dakota', TN: 'Tennessee', TX: 'Texas', UT: 'Utah', VT: 'Vermont',
  VA: 'Virginia', WA: 'Washington', WV: 'West Virginia', WI: 'Wisconsin', WY: 'Wyoming',
  DC: 'District of Columbia',
}

function stateCodeToName(code: string): string {
  return STATE_CODE_TO_NAME[code.toUpperCase()] ?? code
}

export interface NicheIndustryMapping {
  industries: string[]
  subIndustries?: string[]
  titleKeywords: string[]
  /** Company name keywords to narrow SuperSearch results to the right business type */
  companyKeywords?: string[]
}

export const NICHE_INDUSTRY_MAP: Record<string, NicheIndustryMapping> = {
  dispensary: {
    industries: ['Retail'],
    subIndustries: ['Retail'],
    titleKeywords: ['owner', 'founder', 'ceo', 'president', 'general manager', 'manager', 'director'],
    companyKeywords: ['dispensary', 'cannabis', 'marijuana', 'weed', 'hemp', 'THC'],
  },
  grow_ops: {
    industries: ['Agriculture & Mining', 'Retail'],
    subIndustries: ['Farming', 'Retail'],
    titleKeywords: ['owner', 'founder', 'ceo', 'president', 'director', 'compliance director', 'general manager'],
    companyKeywords: ['cultivation', 'cultivator', 'grow', 'grower', 'cannabis farm', 'marijuana grow', 'indoor grow'],
  },
  gun_shop: {
    industries: ['Retail'],
    subIndustries: ['Retail', 'Sporting Goods'],
    titleKeywords: ['owner', 'founder', 'ceo', 'president', 'general manager', 'manager'],
    companyKeywords: ['gun', 'guns', 'firearm', 'firearms', 'ammo', 'ammunition', 'shooting range', 'tactical', 'armory', 'rifle'],
  },
  pawn_shop: {
    industries: ['Retail', 'Consumer Services'],
    subIndustries: ['Retail'],
    titleKeywords: ['owner', 'founder', 'ceo', 'president', 'general manager', 'manager'],
    companyKeywords: ['pawn', 'pawnshop', 'pawn shop', 'pawnbroker'],
  },
  jewelry_store: {
    industries: ['Retail'],
    subIndustries: ['Luxury Goods & Jewelry'],
    titleKeywords: ['owner', 'founder', 'ceo', 'president', 'general manager', 'manager'],
    companyKeywords: ['jewelry', 'jeweler', 'jewellers', 'diamond', 'gold', 'gem'],
  },
  liquor_store: {
    industries: ['Retail'],
    subIndustries: ['Retail'],
    titleKeywords: ['owner', 'founder', 'ceo', 'president', 'general manager', 'manager'],
    companyKeywords: ['liquor', 'wine', 'spirits', 'beer', 'bottle shop', 'package store'],
  },
  convenience_store: {
    industries: ['Retail'],
    subIndustries: ['Retail'],
    titleKeywords: ['owner', 'founder', 'ceo', 'president', 'general manager', 'manager'],
    companyKeywords: ['convenience', 'gas station', 'fuel', 'mart', 'mini mart', 'corner store', 'c-store'],
  },
  bar_nightclub: {
    industries: ['Travel Recreation and Leisure'],
    subIndustries: ['Restaurants', 'Wine and Spirits', 'Entertainment'],
    titleKeywords: ['owner', 'founder', 'ceo', 'president', 'general manager', 'manager', 'director'],
    companyKeywords: ['bar', 'nightclub', 'lounge', 'pub', 'tavern', 'club', 'taproom', 'brewery'],
  },
  restaurant: {
    industries: ['Travel Recreation and Leisure'],
    subIndustries: ['Restaurants'],
    titleKeywords: ['owner', 'founder', 'ceo', 'president', 'general manager', 'manager', 'director'],
    companyKeywords: ['restaurant', 'grill', 'cafe', 'diner', 'eatery', 'bistro', 'pizzeria', 'taqueria'],
  },
  hotel: {
    industries: ['Travel Recreation and Leisure'],
    subIndustries: ['Hospitality'],
    titleKeywords: ['owner', 'founder', 'ceo', 'president', 'general manager', 'manager', 'director', 'gm'],
    companyKeywords: ['hotel', 'motel', 'inn', 'lodge', 'suites', 'resort'],
  },
  gym: {
    industries: ['Travel Recreation and Leisure'],
    subIndustries: ['Recreational Facilities and Services', 'Sporting Goods', 'Sports'],
    titleKeywords: ['owner', 'founder', 'ceo', 'president', 'general manager', 'manager', 'director'],
    companyKeywords: ['gym', 'fitness', 'crossfit', 'yoga', 'pilates', 'workout', 'athletic club'],
  },
  car_wash: {
    industries: ['Consumer Services'],
    subIndustries: ['Consumer Services'],
    titleKeywords: ['owner', 'founder', 'ceo', 'president', 'general manager', 'manager'],
    companyKeywords: ['car wash', 'carwash', 'auto wash', 'auto detail', 'detailing'],
  },
  pharmacy: {
    industries: ['Healthcare Pharmaceuticals & Biotech'],
    subIndustries: ['Pharmaceuticals', 'Medical Practice'],
    titleKeywords: ['owner', 'founder', 'pharmacist', 'pharmacy manager', 'ceo', 'president', 'director'],
    companyKeywords: ['pharmacy', 'apothecary', 'drugstore', 'rx', 'compounding'],
  },
  vet_clinic: {
    industries: ['Healthcare Pharmaceuticals & Biotech'],
    subIndustries: ['Veterinary'],
    titleKeywords: ['owner', 'founder', 'veterinarian', 'practice manager', 'ceo', 'president', 'director'],
    companyKeywords: ['veterinary', 'vet', 'animal hospital', 'animal clinic', 'pet clinic'],
  },
  medical_office: {
    industries: ['Healthcare Pharmaceuticals & Biotech'],
    subIndustries: ['Medical Practice', 'Hospital & Health Care'],
    titleKeywords: ['owner', 'founder', 'physician', 'practice manager', 'ceo', 'president', 'director'],
    companyKeywords: ['medical', 'dental', 'clinic', 'practice', 'health center', 'family medicine', 'dentist'],
  },
  auto_dealer: {
    industries: ['Manufacturing', 'Retail'],
    subIndustries: ['Automotive'],
    titleKeywords: ['owner', 'founder', 'ceo', 'president', 'dealer principal', 'general manager', 'sales manager', 'director'],
    companyKeywords: ['auto', 'dealership', 'motors', 'car dealer', 'automotive', 'used cars', 'pre-owned'],
  },
  bank: {
    industries: ['Financial Services'],
    subIndustries: ['Banking', 'Financial Services'],
    titleKeywords: ['owner', 'ceo', 'president', 'security director', 'branch manager', 'director', 'vp'],
    companyKeywords: ['bank', 'credit union', 'savings', 'financial', 'banking'],
  },
  warehouse: {
    industries: ['Wholesale & Distribution', 'Transportation & Storage'],
    subIndustries: ['Wholesale', 'Logistics and Supply Chain'],
    titleKeywords: ['owner', 'founder', 'ceo', 'president', 'general manager', 'operations manager', 'director', 'facilities manager'],
    companyKeywords: ['warehouse', 'distribution', 'logistics', 'fulfillment', 'storage', '3pl'],
  },
  trucking: {
    industries: ['Transportation & Storage'],
    subIndustries: ['Logistics and Supply Chain'],
    titleKeywords: ['owner', 'founder', 'ceo', 'president', 'terminal manager', 'operations manager', 'director'],
    companyKeywords: ['trucking', 'freight', 'transport', 'hauling', 'carrier', 'logistics', 'terminal'],
  },
  manufacturing: {
    industries: ['Manufacturing'],
    subIndustries: ['Manufacturing'],
    titleKeywords: ['owner', 'founder', 'ceo', 'president', 'facilities director', 'operations manager', 'plant manager', 'director'],
    companyKeywords: ['manufacturing', 'factory', 'fabrication', 'machining', 'production', 'industrial'],
  },
  self_storage: {
    industries: ['Real Estate & Construction'],
    subIndustries: ['Real Estate'],
    titleKeywords: ['owner', 'founder', 'ceo', 'president', 'general manager', 'manager', 'director', 'property manager'],
    companyKeywords: ['storage', 'self storage', 'self-storage', 'mini storage', 'store it'],
  },
  construction: {
    industries: ['Real Estate & Construction'],
    subIndustries: ['Construction'],
    titleKeywords: ['owner', 'founder', 'ceo', 'president', 'project manager', 'general contractor', 'director'],
    companyKeywords: ['construction', 'contractor', 'builder', 'general contractor', 'excavation', 'roofing', 'framing'],
  },
  property_mgmt: {
    industries: ['Real Estate & Construction'],
    subIndustries: ['Real Estate', 'Commercial Real Estate'],
    titleKeywords: ['owner', 'founder', 'ceo', 'president', 'property manager', 'general manager', 'director'],
    companyKeywords: ['property management', 'apartments', 'residential', 'realty', 'leasing', 'multifamily'],
  },
  daycare: {
    industries: ['Education'],
    subIndustries: ['Education Management'],
    titleKeywords: ['owner', 'founder', 'ceo', 'president', 'director', 'administrator'],
    companyKeywords: ['daycare', 'childcare', 'child care', 'preschool', 'learning center', 'montessori', 'kids academy'],
  },
}

/**
 * Build Instantly SuperSearch filter object for a given niche + states.
 */
export function buildSearchFilters(
  nicheSlug: string,
  states: string[]
): Record<string, unknown> | null {
  const mapping = NICHE_INDUSTRY_MAP[nicheSlug]
  if (!mapping) return null

  // Minimal filter strategy: location + keyword_filter (single term).
  // Instantly's keyword_filter is a plain-text substring match (NOT boolean).
  // Industry taxonomy and title filter both proved too narrow for small
  // businesses that don't have rich profile data.
  const filters: Record<string, unknown> = {
    locations: {
      include: states.map((state) => ({
        state: stateCodeToName(state),
        country: 'United States',
      })),
    },
  }

  if (mapping.companyKeywords?.length) {
    // Use the first (most specific) company keyword — e.g. "pawn" for pawn_shop
    filters.keyword_filter = { include: mapping.companyKeywords[0] }
  }

  return filters
}
