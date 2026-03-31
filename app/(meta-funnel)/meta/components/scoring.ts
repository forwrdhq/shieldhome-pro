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

  // === CURRENT SYSTEM (biggest factor) ===
  if (answers.currentSystem === 'none') {
    score -= 35
    vulnerabilities.push('No security system installed \u2014 your home is unmonitored 24/7')
  } else if (answers.currentSystem === 'basic_diy') {
    score -= 22
    vulnerabilities.push('Basic DIY system \u2014 records events but cannot dispatch help or actively deter')
  } else if (answers.currentSystem === 'outdated') {
    score -= 30
    vulnerabilities.push('Outdated system \u2014 may fail to detect or respond when it matters most')
  } else if (answers.currentSystem === 'unhappy_professional') {
    score -= 10
    vulnerabilities.push('Current system may have gaps in coverage or response quality')
  }

  // === NEIGHBORHOOD RISK ===
  if (answers.neighborhood === 'high_crime') {
    score -= 18
    vulnerabilities.push('High-crime area \u2014 statistically elevated break-in risk')
  } else if (answers.neighborhood === 'some_incidents') {
    score -= 12
    vulnerabilities.push('Recent incidents nearby \u2014 your neighborhood risk is rising')
  } else if (answers.neighborhood === 'safe_but_concerns') {
    score -= 7
    vulnerabilities.push('Growing concerns in area \u2014 most break-ins happen in "safe" neighborhoods')
  } else if (answers.neighborhood === 'very_safe') {
    score -= 3
    vulnerabilities.push('Even safe neighborhoods see break-ins \u2014 65% occur in suburban areas')
  }

  // === PROPERTY TYPE (entry point exposure) ===
  if (answers.propertyType === 'house') {
    score -= 8
    vulnerabilities.push('Single-family homes have the most entry points to secure')
  } else if (answers.propertyType === 'townhouse') {
    score -= 5
    vulnerabilities.push('Townhomes share walls but still have ground-level entry exposure')
  } else if (answers.propertyType === 'multi_family') {
    score -= 6
    vulnerabilities.push('Multi-family properties have multiple access points per unit')
  }

  // === CONCERN-SPECIFIC VULNERABILITIES ===
  if (answers.topConcern === 'breakins') {
    score -= 5
    vulnerabilities.push('Break-in concern: homes without systems are 300% more likely to be targeted')
  } else if (answers.topConcern === 'kids_alone') {
    score -= 5
    vulnerabilities.push('Children home alone: no monitored entry alerts or activity notifications')
  } else if (answers.topConcern === 'package_theft') {
    score -= 3
    vulnerabilities.push('Package theft: 120M packages stolen annually \u2014 a front-door camera alone is not enough')
  } else if (answers.topConcern === 'vacation') {
    score -= 4
    vulnerabilities.push('Vacation monitoring gap: no one watching your home while you\u2019re away')
  } else if (answers.topConcern === 'fire_co') {
    score -= 4
    vulnerabilities.push('No connected smoke/CO monitoring \u2014 early detection saves lives')
  }

  // === FEATURE GAPS (what they want but don't have) ===
  const wantedFeatures = answers.features || []
  if (answers.currentSystem === 'none' || answers.currentSystem === 'basic_diy') {
    if (wantedFeatures.includes('smart_locks') || wantedFeatures.includes('all')) {
      score -= 3
      vulnerabilities.push('No smart lock control \u2014 cannot verify doors are locked remotely')
    }
    if (wantedFeatures.includes('smoke_co') || wantedFeatures.includes('all')) {
      if (answers.topConcern !== 'fire_co') {
        score -= 2
        vulnerabilities.push('No connected fire/CO detection')
      }
    }
    if (wantedFeatures.includes('outdoor_cameras') || wantedFeatures.includes('all')) {
      score -= 3
      vulnerabilities.push('No outdoor camera coverage \u2014 blind spots around your property')
    }
  }

  // === OWNERSHIP FACTOR ===
  if (answers.ownership === 'rent') {
    score += 5
  }

  // === SMALL RANDOM VARIANCE ===
  const variance = Math.floor(Math.random() * 5) - 2
  score += variance

  // Clamp to 5-95 (never show 0 or 100)
  score = Math.max(5, Math.min(95, score))

  const riskLevel: 'high' | 'medium' | 'low' = score >= 65 ? 'low' : score >= 35 ? 'medium' : 'high'

  // Package recommendation
  const featureCount = wantedFeatures.includes('all') ? 5 : wantedFeatures.length
  const recommendedPackage: 'total_shield' | 'essential' | 'starter' =
    featureCount >= 3 || answers.topConcern === 'breakins'
      ? 'total_shield'
      : featureCount >= 2
        ? 'essential'
        : 'starter'

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
