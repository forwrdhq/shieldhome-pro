export const PHONE_NUMBER = process.env.NEXT_PUBLIC_PHONE_NUMBER || '(801) 616-6301'
export const PHONE_NUMBER_RAW = process.env.NEXT_PUBLIC_PHONE_NUMBER_RAW || '+18016166301'
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
  ASAP: 'As soon as possible',
  ONE_TWO_WEEKS: 'Within 1-2 weeks',
  ONE_MONTH: 'Within a month',
  JUST_RESEARCHING: 'Just researching',
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
