import { z } from 'zod'

export const leadSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50),
  lastName: z.string().max(50).optional().default(''),
  email: z.string().email('Valid email required'),
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

  source: z.string().optional().nullable(),
  medium: z.string().optional().nullable(),
  campaign: z.string().optional().nullable(),
  adSet: z.string().optional().nullable(),
  adId: z.string().optional().nullable(),
  keyword: z.string().optional().nullable(),
  utmContent: z.string().optional().nullable(),
  gclid: z.string().optional().nullable(),
  fbclid: z.string().optional().nullable(),
  landingPage: z.string().optional().nullable(),
  referrer: z.string().optional().nullable(),
  deviceType: z.string().optional().nullable(),
  browser: z.string().optional().nullable(),
  tcpaConsent: z.boolean().optional().default(false),
})

export type LeadFormData = z.infer<typeof leadSchema>

export const updateLeadSchema = z.object({
  status: z.string().optional(),
  appointmentDate: z.string().optional().nullable(),
  saleAmount: z.number().optional().nullable(),
  monthlyAmount: z.number().optional().nullable(),
  contractLength: z.number().optional().nullable(),
  notes: z.string().optional().nullable(),
  assignedRepId: z.string().optional().nullable(),
  firstContactAt: z.string().optional().nullable(),
})

export const dispositionSchema = z.object({
  status: z.string().min(1, 'Status required'),
  dispositionNote: z.string().optional().nullable(),
})
