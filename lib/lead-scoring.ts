interface LeadData {
  homeownership: string
  propertyType: string
  timeline: string
  productsInterested: string[]
  source?: string
  deviceType?: string
}

/**
 * Score a lead 0-100 based on qualification signals.
 *
 * The scoring weights are calibrated for a Vivint authorized dealer:
 * - Homeownership is the #1 qualifier (Vivint strongly prefers homeowners)
 * - Timeline urgency is #2 (ASAP = highest intent, researching = lowest)
 * - Property type matters for deal size (houses > condos)
 * - Number of products = more interest = higher engagement
 * - Source quality: Google search intent > Facebook interruption > organic
 * - Time of day: leads submitted during business hours convert better
 * - Multiple products signal higher engagement and bigger system size
 */
export function calculateLeadScore(lead: LeadData): { score: number; priority: string } {
  let score = 0

  // --- Homeownership (max 30 pts) --- biggest qualifier
  if (lead.homeownership === 'OWN') score += 30
  else if (lead.homeownership === 'RENT') score += 5

  // --- Property type (max 15 pts)
  switch (lead.propertyType) {
    case 'HOUSE': score += 15; break
    case 'TOWNHOME': score += 12; break
    case 'BUSINESS': score += 10; break
    case 'CONDO_APARTMENT': score += 8; break
  }

  // --- Timeline / urgency (max 25 pts)
  switch (lead.timeline) {
    case 'ASAP': score += 25; break
    case 'ONE_TWO_WEEKS': score += 18; break
    case 'ONE_MONTH': score += 10; break
    case 'JUST_RESEARCHING': score += 3; break
  }

  // --- Products interested (max 20 pts) — more products = bigger deal
  const productCount = lead.productsInterested.length
  if (productCount >= 4) score += 20
  else if (productCount >= 3) score += 15
  else if (productCount >= 2) score += 10
  else if (productCount >= 1) score += 5

  // Bonus: security system selected is highest-value product
  if (lead.productsInterested.some(p => p.toLowerCase().includes('security'))) {
    score += 3
  }

  // --- Traffic source quality (max 10 pts)
  switch (lead.source) {
    case 'google': score += 10; break   // search intent = highest quality
    case 'organic': score += 8; break   // found us naturally
    case 'referral': score += 7; break  // word of mouth
    case 'facebook': score += 5; break  // interruption-based
    default: score += 3; break          // direct or unknown
  }

  // --- Device (bonus 2 pts for desktop — tends to convert better)
  if (lead.deviceType === 'desktop') score += 2

  score = Math.min(score, 100)

  let priority: string
  if (score >= 75) priority = 'HOT'
  else if (score >= 55) priority = 'HIGH'
  else if (score >= 35) priority = 'MEDIUM'
  else priority = 'LOW'

  return { score, priority }
}
