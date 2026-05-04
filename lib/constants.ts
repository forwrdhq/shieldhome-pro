export const PHONE_NUMBER = process.env.NEXT_PUBLIC_PHONE_NUMBER || '(801) 348-6050'
export const PHONE_NUMBER_RAW = process.env.NEXT_PUBLIC_PHONE_NUMBER_RAW || '+18013486050'
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://shieldhome.pro'
export const COMPANY_NAME = 'ShieldHome Pro'
export const COMPANY_TAGLINE = 'Vivint Smart Home Partner'
// Required for A2P 10DLC carrier verification — must be a real, verifiable
// physical address (street, city, state, ZIP). Override via NEXT_PUBLIC_COMPANY_ADDRESS
// if you ever move.
export const COMPANY_ADDRESS = process.env.NEXT_PUBLIC_COMPANY_ADDRESS || '115 N Geneva Road, Vineyard, UT 84059'
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
