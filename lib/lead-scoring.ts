interface LeadData {
  homeownership: string
  propertyType: string
  timeline: string
  productsInterested: string[]
  source?: string
  deviceType?: string
}

export function calculateLeadScore(lead: LeadData): { score: number; priority: string } {
  let score = 0

  if (lead.homeownership === 'OWN') score += 30
  if (lead.homeownership === 'RENT') score += 5

  if (lead.propertyType === 'HOUSE') score += 15
  if (lead.propertyType === 'TOWNHOME') score += 12
  if (lead.propertyType === 'CONDO_APARTMENT') score += 8
  if (lead.propertyType === 'BUSINESS') score += 10

  if (lead.timeline === 'ASAP') score += 25
  if (lead.timeline === 'ONE_TWO_WEEKS') score += 18
  if (lead.timeline === 'ONE_MONTH') score += 10
  if (lead.timeline === 'JUST_RESEARCHING') score += 3

  score += Math.min(lead.productsInterested.length * 5, 15)

  if (lead.source === 'google') score += 10
  if (lead.source === 'facebook') score += 5
  if (lead.source === 'organic') score += 8

  if (lead.deviceType === 'desktop') score += 5

  score = Math.min(score, 100)

  let priority: string
  if (score >= 80) priority = 'HOT'
  else if (score >= 60) priority = 'HIGH'
  else if (score >= 40) priority = 'MEDIUM'
  else priority = 'LOW'

  return { score, priority }
}
