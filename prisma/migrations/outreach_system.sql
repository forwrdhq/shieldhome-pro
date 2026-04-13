-- ============================================
-- COLD OUTREACH SYSTEM MIGRATION
-- Run this in your Supabase SQL Editor
-- ============================================

-- 1. OutreachDMA (metro areas for geographic targeting)
CREATE TABLE IF NOT EXISTS outreach_dmas (
  id TEXT PRIMARY KEY,
  "metroName" TEXT NOT NULL,
  states TEXT[] NOT NULL DEFAULT '{}',
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. OutreachCampaign
CREATE TABLE IF NOT EXISTS outreach_campaigns (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  "nicheSlug" TEXT NOT NULL,
  "dmaId" TEXT,
  "instantlyCampaignId" TEXT UNIQUE,
  status TEXT NOT NULL DEFAULT 'DRAFT',
  "totalProspects" INTEGER NOT NULL DEFAULT 0,
  "totalSent" INTEGER NOT NULL DEFAULT 0,
  "totalOpens" INTEGER NOT NULL DEFAULT 0,
  "totalClicks" INTEGER NOT NULL DEFAULT 0,
  "totalReplies" INTEGER NOT NULL DEFAULT 0,
  "totalInterested" INTEGER NOT NULL DEFAULT 0,
  "totalConversions" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_campaign_dma FOREIGN KEY ("dmaId") REFERENCES outreach_dmas(id)
);

CREATE INDEX IF NOT EXISTS idx_outreach_campaigns_niche ON outreach_campaigns("nicheSlug");
CREATE INDEX IF NOT EXISTS idx_outreach_campaigns_status ON outreach_campaigns(status);
CREATE INDEX IF NOT EXISTS idx_outreach_campaigns_created ON outreach_campaigns("createdAt");

-- 3. OutreachProspect
CREATE TABLE IF NOT EXISTS outreach_prospects (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  email TEXT NOT NULL UNIQUE,
  "firstName" TEXT,
  "lastName" TEXT,
  "businessName" TEXT NOT NULL,
  phone TEXT,
  website TEXT,
  "nicheSlug" TEXT NOT NULL,
  "dmaId" TEXT,
  city TEXT,
  state TEXT,
  "zipCode" TEXT,
  source TEXT NOT NULL,
  "instantlyLeadId" TEXT UNIQUE,
  status TEXT NOT NULL DEFAULT 'QUEUED',
  "campaignId" TEXT,
  "emailsSent" INTEGER NOT NULL DEFAULT 0,
  "opensCount" INTEGER NOT NULL DEFAULT 0,
  "clicksCount" INTEGER NOT NULL DEFAULT 0,
  "repliedAt" TIMESTAMP(3),
  "replyLabel" TEXT,
  "convertedLeadId" TEXT UNIQUE,
  "convertedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_prospect_dma FOREIGN KEY ("dmaId") REFERENCES outreach_dmas(id),
  CONSTRAINT fk_prospect_campaign FOREIGN KEY ("campaignId") REFERENCES outreach_campaigns(id),
  CONSTRAINT fk_prospect_lead FOREIGN KEY ("convertedLeadId") REFERENCES leads(id)
);

CREATE INDEX IF NOT EXISTS idx_outreach_prospects_niche ON outreach_prospects("nicheSlug");
CREATE INDEX IF NOT EXISTS idx_outreach_prospects_dma ON outreach_prospects("dmaId");
CREATE INDEX IF NOT EXISTS idx_outreach_prospects_status ON outreach_prospects(status);
CREATE INDEX IF NOT EXISTS idx_outreach_prospects_campaign ON outreach_prospects("campaignId");
CREATE INDEX IF NOT EXISTS idx_outreach_prospects_created ON outreach_prospects("createdAt");

-- 4. OutreachRotationLog
CREATE TABLE IF NOT EXISTS outreach_rotation_logs (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "dmaId" TEXT NOT NULL,
  "nicheSlug" TEXT NOT NULL,
  "campaignId" TEXT,
  "prospectsQueued" INTEGER NOT NULL DEFAULT 0,
  "contactedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_rotation_dma FOREIGN KEY ("dmaId") REFERENCES outreach_dmas(id)
);

CREATE INDEX IF NOT EXISTS idx_rotation_dma_niche ON outreach_rotation_logs("dmaId", "nicheSlug");
CREATE INDEX IF NOT EXISTS idx_rotation_contacted ON outreach_rotation_logs("contactedAt");

-- 5. OutreachEvent (webhook event log)
CREATE TABLE IF NOT EXISTS outreach_events (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "eventId" TEXT UNIQUE,
  "eventType" TEXT NOT NULL,
  "prospectId" TEXT,
  "campaignId" TEXT,
  payload JSONB NOT NULL,
  "processedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_event_prospect FOREIGN KEY ("prospectId") REFERENCES outreach_prospects(id)
);

CREATE INDEX IF NOT EXISTS idx_outreach_events_type_created ON outreach_events("eventType", "createdAt");
CREATE INDEX IF NOT EXISTS idx_outreach_events_prospect ON outreach_events("prospectId");

-- 6. SuppressionList (CAN-SPAM compliance)
CREATE TABLE IF NOT EXISTS suppression_list (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  email TEXT NOT NULL UNIQUE,
  reason TEXT NOT NULL,
  source TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 7. Add email index to existing leads table
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);

-- 8. Seed the 14 priority DMAs
INSERT INTO outreach_dmas (id, "metroName", states) VALUES
  ('new-york', 'New York', ARRAY['NY', 'NJ', 'CT']),
  ('los-angeles', 'Los Angeles', ARRAY['CA']),
  ('chicago', 'Chicago', ARRAY['IL']),
  ('philadelphia', 'Philadelphia', ARRAY['PA']),
  ('dallas-fort-worth', 'Dallas-Fort Worth', ARRAY['TX']),
  ('houston', 'Houston', ARRAY['TX']),
  ('washington-dc', 'Washington DC', ARRAY['DC', 'MD', 'VA']),
  ('miami', 'Miami-Fort Lauderdale', ARRAY['FL']),
  ('atlanta', 'Atlanta', ARRAY['GA']),
  ('seattle', 'Seattle-Tacoma', ARRAY['WA']),
  ('minneapolis', 'Minneapolis-St. Paul', ARRAY['MN']),
  ('phoenix', 'Phoenix', ARRAY['AZ']),
  ('denver', 'Denver', ARRAY['CO']),
  ('las-vegas', 'Las Vegas', ARRAY['NV'])
ON CONFLICT (id) DO UPDATE SET
  "metroName" = EXCLUDED."metroName",
  states = EXCLUDED.states;

-- Done!
-- Verify: SELECT count(*) FROM outreach_dmas; -- should return 14
