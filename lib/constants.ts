export const PHONE_NUMBER = process.env.NEXT_PUBLIC_PHONE_NUMBER || '(877) 555-0199'
export const PHONE_NUMBER_RAW = process.env.NEXT_PUBLIC_PHONE_NUMBER_RAW || '+18775550199'
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://shieldhomepro.com'
export const COMPANY_NAME = 'ShieldHome Pro'
export const COMPANY_TAGLINE = 'Authorized Vivint Smart Home Dealer'
export const FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL || 'quotes@shieldhomepro.com'
export const FROM_NAME = process.env.SENDGRID_FROM_NAME || 'ShieldHome Pro'

export const LEAD_STATUS_LABELS: Record<string, string> = {
  NEW: 'New',
  CONTACTED: 'Contacted',
  APPOINTMENT_SET: 'Appt Set',
  APPOINTMENT_SAT: 'Appt Sat',
  QUOTED: 'Quoted',
  CLOSED_WON: 'Closed Won',
  CLOSED_LOST: 'Closed Lost',
  NO_ANSWER: 'No Answer',
  NOT_QUALIFIED: 'Not Qualified',
  CANCELLED: 'Cancelled',
}

export const PRIORITY_LABELS: Record<string, string> = {
  HOT: 'Hot',
  HIGH: 'High',
  MEDIUM: 'Medium',
  LOW: 'Low',
}

export const SOURCE_LABELS: Record<string, string> = {
  facebook: 'Facebook',
  google: 'Google',
  organic: 'Organic',
  referral: 'Referral',
  direct: 'Direct',
}

export const PROPERTY_TYPE_LABELS: Record<string, string> = {
  HOUSE: 'House',
  TOWNHOME: 'Townhome',
  CONDO_APARTMENT: 'Condo/Apartment',
  BUSINESS: 'Business',
}

export const TIMELINE_LABELS: Record<string, string> = {
  ASAP: 'ASAP (within a week)',
  ONE_TWO_WEEKS: 'Within 1-2 weeks',
  ONE_MONTH: 'Within a month',
  JUST_RESEARCHING: 'Just researching',
}

export const HOMEOWNERSHIP_LABELS: Record<string, string> = {
  OWN: 'Homeowner',
  RENT: 'Renter',
}

export const CONCERN_LABELS: Record<string, string> = {
  BREAKINS: 'Break-ins / Burglary',
  PACKAGE_THEFT: 'Package Theft',
  FIRE_SMOKE: 'Fire / Smoke / CO',
  KIDS_PETS: 'Watching Kids / Pets',
  ALL: 'All of the Above',
}

export const PIPELINE_COLUMNS = [
  'NEW',
  'CONTACTED',
  'APPOINTMENT_SET',
  'APPOINTMENT_SAT',
  'QUOTED',
  'CLOSED_WON',
]

export const NURTURE_SCHEDULE = [0, 24, 72, 168, 336, 504] // hours after submission

// ============================================
// B2B Constants
// ============================================

export const B2B_PIPELINE_STAGES: Record<string, string> = {
  'New Lead': 'New Lead',
  'Qualified': 'Qualified',
  'Assessment Scheduled': 'Assessment Scheduled',
  'Assessment Complete': 'Assessment Complete',
  'Proposal Sent': 'Proposal Sent',
  'Negotiation': 'Negotiation',
  'Won': 'Won',
  'Lost': 'Lost',
  'Not Qualified': 'Not Qualified',
  'Nurture': 'Nurture',
}

export const B2B_PIPELINE_STAGE_LIST = Object.keys(B2B_PIPELINE_STAGES)

export const B2B_STAGE_COLORS: Record<string, string> = {
  'New Lead': 'bg-gray-100 text-gray-700',
  'Qualified': 'bg-blue-100 text-blue-700',
  'Assessment Scheduled': 'bg-orange-100 text-orange-700',
  'Assessment Complete': 'bg-yellow-100 text-yellow-700',
  'Proposal Sent': 'bg-purple-100 text-purple-700',
  'Negotiation': 'bg-indigo-100 text-indigo-700',
  'Won': 'bg-green-100 text-green-700',
  'Lost': 'bg-red-100 text-red-700',
  'Not Qualified': 'bg-red-100 text-red-700',
  'Nurture': 'bg-cyan-100 text-cyan-700',
}

export const B2B_BUSINESS_TYPES: Record<string, string> = {
  'Retail': 'Retail',
  'Office': 'Office',
  'Warehouse': 'Warehouse',
  'Restaurant': 'Restaurant',
  'Healthcare': 'Healthcare',
  'Education': 'Education',
  'Manufacturing': 'Manufacturing',
  'Hospitality': 'Hospitality',
  'Construction': 'Construction',
  'Other': 'Other',
}

export const B2B_BUSINESS_TYPE_COLORS: Record<string, string> = {
  'Retail': 'bg-blue-100 text-blue-700',
  'Office': 'bg-gray-100 text-gray-700',
  'Warehouse': 'bg-amber-100 text-amber-700',
  'Restaurant': 'bg-orange-100 text-orange-700',
  'Healthcare': 'bg-red-100 text-red-700',
  'Education': 'bg-indigo-100 text-indigo-700',
  'Manufacturing': 'bg-yellow-100 text-yellow-700',
  'Hospitality': 'bg-purple-100 text-purple-700',
  'Construction': 'bg-emerald-100 text-emerald-700',
  'Other': 'bg-gray-100 text-gray-700',
}
