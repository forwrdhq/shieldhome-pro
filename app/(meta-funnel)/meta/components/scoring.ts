export interface QuizAnswers {
  propertyType?: string
  ownership?: string
  topConcern?: string
  neighborhood?: string
  currentSystem?: string
  features?: string[]
  timeline?: string
}

export interface SecurityScoreResult {
  score: number
  riskLevel: 'high' | 'medium' | 'low'
  vulnerabilities: string[]
  recommendedPackage: 'total_shield' | 'essential' | 'starter'
}

export function calculateSecurityScore(answers: QuizAnswers): SecurityScoreResult {
  let score = 100
  const vulnerabilities: string[] = []

  // No security system = major deduction
  if (answers.currentSystem === 'none') {
    score -= 40
    vulnerabilities.push('No security system installed')
  } else if (answers.currentSystem === 'basic_diy') {
    score -= 25
    vulnerabilities.push('Basic DIY system with limited coverage')
  } else if (answers.currentSystem === 'outdated') {
    score -= 35
    vulnerabilities.push('Outdated system may not function properly')
  } else if (answers.currentSystem === 'unhappy_professional') {
    score -= 15
    vulnerabilities.push('Current system not meeting your needs')
  }

  // Neighborhood risk
  if (answers.neighborhood === 'high_crime') {
    score -= 20
    vulnerabilities.push('High-crime neighborhood increases risk')
  } else if (answers.neighborhood === 'some_incidents') {
    score -= 15
    vulnerabilities.push('Recent incidents in your area')
  } else if (answers.neighborhood === 'safe_but_concerns') {
    score -= 10
    vulnerabilities.push('Growing security concerns in neighborhood')
  }

  // Property type (more entry points = more vulnerable)
  if (answers.propertyType === 'house') {
    score -= 10
    vulnerabilities.push('Single-family homes have the most entry points')
  } else if (answers.propertyType === 'multi_family') {
    score -= 8
    vulnerabilities.push('Multi-family properties need comprehensive coverage')
  }

  // No smoke/CO detection selected
  if (!answers.features?.includes('smoke_co') && !answers.features?.includes('all')) {
    score -= 5
    vulnerabilities.push('No fire/CO monitoring')
  }

  // Concern-based vulnerabilities
  if (answers.topConcern === 'breakins') {
    vulnerabilities.push('Break-in risk: homes without security are 300% more likely to be targeted')
  }
  if (answers.topConcern === 'kids_alone') {
    vulnerabilities.push('Children home alone without monitored entry alerts')
  }
  if (answers.topConcern === 'package_theft') {
    vulnerabilities.push('Package theft on the rise — doorbell cameras reduce theft by 50%')
  }
  if (answers.topConcern === 'fire_co') {
    vulnerabilities.push('Fire/CO incidents require 24/7 professional monitoring for fastest response')
  }

  // Ensure score stays in 0-100 range
  score = Math.max(0, Math.min(100, score))

  const riskLevel: 'high' | 'medium' | 'low' = score >= 70 ? 'low' : score >= 40 ? 'medium' : 'high'

  // Package recommendation based on features interest
  const featureCount = answers.features?.includes('all') ? 5 : (answers.features?.length ?? 0)
  const recommendedPackage: 'total_shield' | 'essential' | 'starter' =
    featureCount >= 3 ? 'total_shield' : featureCount >= 2 ? 'essential' : 'starter'

  return { score, riskLevel, vulnerabilities, recommendedPackage }
}

export function scoreMetaLead(answers: QuizAnswers): { score: number; priority: string } {
  let score = 0

  // Ownership
  if (answers.ownership === 'own') score += 30
  else if (answers.ownership === 'buying') score += 25
  else score += 5 // renter

  // Property type
  if (answers.propertyType === 'house') score += 15
  else if (answers.propertyType === 'townhouse') score += 12
  else score += 8

  // Timeline (biggest differentiator)
  if (answers.timeline === 'asap') score += 30
  else if (answers.timeline === 'within_30_days') score += 20
  else if (answers.timeline === 'within_3_months') score += 10
  else score += 3 // researching

  // Neighborhood urgency
  if (answers.neighborhood === 'high_crime') score += 10
  else if (answers.neighborhood === 'some_incidents') score += 7

  // No current system = higher intent
  if (answers.currentSystem === 'none') score += 5

  // Unhappy with professional = switching intent
  if (answers.currentSystem === 'unhappy_professional') score += 8

  score = Math.min(score, 100)

  const priority = score >= 70 ? 'HOT' : score >= 50 ? 'HIGH' : score >= 30 ? 'MEDIUM' : 'LOW'

  return { score, priority }
}
