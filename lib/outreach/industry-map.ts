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

export interface NicheIndustryMapping {
  industries: string[]
  subIndustries?: string[]
  titleKeywords: string[]
}

export const NICHE_INDUSTRY_MAP: Record<string, NicheIndustryMapping> = {
  dispensary: {
    industries: ['Retail'],
    subIndustries: ['Retail'],
    titleKeywords: ['owner', 'founder', 'ceo', 'president', 'general manager', 'manager', 'director'],
  },
  gun_shop: {
    industries: ['Retail'],
    subIndustries: ['Retail'],
    titleKeywords: ['owner', 'founder', 'ceo', 'president', 'general manager', 'manager'],
  },
  pawn_shop: {
    industries: ['Retail'],
    subIndustries: ['Retail'],
    titleKeywords: ['owner', 'founder', 'ceo', 'president', 'general manager', 'manager'],
  },
  jewelry_store: {
    industries: ['Retail'],
    subIndustries: ['Luxury Goods & Jewelry'],
    titleKeywords: ['owner', 'founder', 'ceo', 'president', 'general manager', 'manager'],
  },
  liquor_store: {
    industries: ['Retail'],
    subIndustries: ['Retail'],
    titleKeywords: ['owner', 'founder', 'ceo', 'president', 'general manager', 'manager'],
  },
  convenience_store: {
    industries: ['Retail'],
    subIndustries: ['Retail'],
    titleKeywords: ['owner', 'founder', 'ceo', 'president', 'general manager', 'manager'],
  },
  bar_nightclub: {
    industries: ['Travel Recreation and Leisure'],
    subIndustries: ['Restaurants', 'Wine and Spirits', 'Entertainment'],
    titleKeywords: ['owner', 'founder', 'ceo', 'president', 'general manager', 'manager', 'director'],
  },
  restaurant: {
    industries: ['Travel Recreation and Leisure'],
    subIndustries: ['Restaurants'],
    titleKeywords: ['owner', 'founder', 'ceo', 'president', 'general manager', 'manager', 'director'],
  },
  hotel: {
    industries: ['Travel Recreation and Leisure'],
    subIndustries: ['Hospitality'],
    titleKeywords: ['owner', 'founder', 'ceo', 'president', 'general manager', 'manager', 'director', 'gm'],
  },
  gym: {
    industries: ['Travel Recreation and Leisure'],
    subIndustries: ['Recreational Facilities and Services', 'Sporting Goods', 'Sports'],
    titleKeywords: ['owner', 'founder', 'ceo', 'president', 'general manager', 'manager', 'director'],
  },
  car_wash: {
    industries: ['Consumer Services'],
    subIndustries: ['Consumer Services'],
    titleKeywords: ['owner', 'founder', 'ceo', 'president', 'general manager', 'manager'],
  },
  pharmacy: {
    industries: ['Healthcare Pharmaceuticals & Biotech'],
    subIndustries: ['Pharmaceuticals', 'Medical Practice'],
    titleKeywords: ['owner', 'founder', 'pharmacist', 'pharmacy manager', 'ceo', 'president', 'director'],
  },
  vet_clinic: {
    industries: ['Healthcare Pharmaceuticals & Biotech'],
    subIndustries: ['Veterinary'],
    titleKeywords: ['owner', 'founder', 'veterinarian', 'practice manager', 'ceo', 'president', 'director'],
  },
  medical_office: {
    industries: ['Healthcare Pharmaceuticals & Biotech'],
    subIndustries: ['Medical Practice', 'Hospital & Health Care'],
    titleKeywords: ['owner', 'founder', 'physician', 'practice manager', 'ceo', 'president', 'director'],
  },
  auto_dealer: {
    industries: ['Manufacturing'],
    subIndustries: ['Automotive'],
    titleKeywords: ['owner', 'founder', 'ceo', 'president', 'dealer principal', 'general manager', 'sales manager', 'director'],
  },
  warehouse: {
    industries: ['Wholesale & Distribution'],
    subIndustries: ['Wholesale'],
    titleKeywords: ['owner', 'founder', 'ceo', 'president', 'general manager', 'operations manager', 'director'],
  },
  self_storage: {
    industries: ['Real Estate & Construction'],
    subIndustries: ['Real Estate'],
    titleKeywords: ['owner', 'founder', 'ceo', 'president', 'general manager', 'manager', 'director'],
  },
  property_mgmt: {
    industries: ['Real Estate & Construction'],
    subIndustries: ['Real Estate', 'Commercial Real Estate'],
    titleKeywords: ['owner', 'founder', 'ceo', 'president', 'property manager', 'general manager', 'director'],
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

  const filters: Record<string, unknown> = {
    locations: {
      include: states.map((state) => ({ state, country: 'United States' })),
    },
    industry: { include: mapping.industries },
    title: { include: mapping.titleKeywords },
  }

  if (mapping.subIndustries?.length) {
    filters.subIndustry = { include: mapping.subIndustries }
  }

  return filters
}
