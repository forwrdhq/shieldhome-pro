import { z } from 'zod'

export const leadSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50),
  lastName: z.string().max(50).optional().default(''),
  email: z.string().email('Valid email required').optional().nullable(),
  phone: z.string().min(10, 'Valid phone number required').max(20),
  zipCode: z.string().max(10).optional().default(''),

  propertyType: z.enum(['HOUSE', 'TOWNHOME', 'CONDO_APARTMENT', 'BUSINESS']).optional().nullable(),
  homeownership: z.enum(['OWN', 'RENT']).optional().nullable(),
  productsInterested: z.array(z.string()).optional().default([]),
  timeline: z.enum(['ASAP', 'ONE_TWO_WEEKS', 'ONE_MONTH', 'JUST_RESEARCHING']).optional().nullable(),
  entryPoints: z.string().optional().nullable(),

  segment: z.string().optional().nullable(),
  currentProvider: z.string().optional().nullable(),
  contractMonthsRemaining: z.string().optional().nullable(),
  currentMonthlyPayment: z.string().optional().nullable(),
  creditScoreRange: z.string().optional().nullable(),

  source: z.string().optional().nullable(),
  medium: z.string().optional().nullable(),
  campaign: z.string().optional().nullable(),
  adSet: z.string().optional().nullable(),
  adId: z.string().optional().nullable(),
  keyword: z.string().optional().nullable(),
  utmContent: z.string().optional().nullable(),
  gclid: z.string().optional().nullable(),
  fbclid: z.string().optional().nullable(),
  kwParam: z.string().optional().nullable(),
  landingPage: z.string().optional().nullable(),
  referrer: z.string().optional().nullable(),
  deviceType: z.string().optional().nullable(),
  browser: z.string().optional().nullable(),
  tcpaConsent: z.boolean().optional().default(false),
})

export type LeadFormData = z.infer<typeof leadSchema>

export const updateLeadSchema = z.object({
  status: z.string().optional(),
  priority: z.string().optional(),
  appointmentDate: z.string().optional().nullable(),
  saleAmount: z.number().optional().nullable(),
  monthlyAmount: z.number().optional().nullable(),
  contractLength: z.number().optional().nullable(),
  notes: z.string().optional().nullable(),
  assignedRepId: z.string().optional().nullable(),
  firstContactAt: z.string().optional().nullable(),
  callsMade: z.number().optional(),
  smsSent: z.number().optional(),
})

export const dispositionSchema = z.object({
  status: z.string().min(1, 'Status required'),
  dispositionNote: z.string().optional().nullable(),
})

// ============================================
// GOOGLE ADS LANDING PAGE — MULTI-STEP SCHEMAS
// ============================================

const trackingFields = {
  source: z.string().optional().nullable(),
  medium: z.string().optional().nullable(),
  campaign: z.string().optional().nullable(),
  gclid: z.string().optional().nullable(),
  fbclid: z.string().optional().nullable(),
  kwParam: z.string().optional().nullable(),
  utmContent: z.string().optional().nullable(),
  keyword: z.string().optional().nullable(),
  landingPage: z.string().optional().nullable(),
  referrer: z.string().optional().nullable(),
  deviceType: z.string().optional().nullable(),
  browser: z.string().optional().nullable(),
}

export const googleStep1Schema = z.object({
  firstName: z.string().min(1, 'Name is required').max(50),
  phone: z.string().min(10, 'Valid phone number required').max(20),
  zipCode: z.string().regex(/^\d{5}$/, 'Valid 5-digit ZIP required'),
  creditScoreRange: z.string().optional().nullable(),
  ...trackingFields,
})

export type GoogleStep1Data = z.infer<typeof googleStep1Schema>

export const googleStep2Schema = z.object({
  leadId: z.string().min(1),
  hasSystem: z.boolean(),
  currentProvider: z.string().optional().nullable(),
  homeownership: z.enum(['OWN', 'RENT']),
})

export type GoogleStep2Data = z.infer<typeof googleStep2Schema>

export const googleStep3Schema = z.object({
  leadId: z.string().min(1),
  email: z.string().email('Valid email required').optional().nullable(),
  timeline: z.enum(['ASAP', 'WITHIN_30_DAYS', 'RESEARCHING']),
  tcpaConsent: z.literal(true, { error: 'Consent is required to continue' }),
})

export type GoogleStep3Data = z.infer<typeof googleStep3Schema>

// ============================================
// BUSINESS LANDING PAGE — LEAD SCHEMA
// ============================================

export const businessLeadSchema = z.object({
  fullName: z.string().min(1, 'Name is required').max(100),
  phone: z.string().min(10, 'Valid phone number required').max(20),
  businessType: z.string().optional().nullable(),
  currentProvider: z.string().optional().nullable(),
  numLocations: z.string().optional().nullable(),
  monthsRemaining: z.string().optional().nullable(),
  ...trackingFields,
})

export const businessQualifySchema = z.object({
  leadId: z.string().min(1),
  currentProvider: z.string().optional().nullable(),
  numLocations: z.string().optional().nullable(),
  monthsRemaining: z.string().optional().nullable(),
  businessType: z.string().optional().nullable(),
})

export type BusinessLeadData = z.infer<typeof businessLeadSchema>
export type BusinessQualifyData = z.infer<typeof businessQualifySchema>
