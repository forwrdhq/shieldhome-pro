# GoHighLevel B2B Setup Guide — ShieldHome Pro

Complete guide to integrating GoHighLevel (GHL) with the ShieldHome Pro lead generation platform. This enables two-way sync between our built-in CRM and GHL so that dealer partners, appointment setters, and sales managers can work leads from either system.

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [GHL Sub-Account Setup](#2-ghl-sub-account-setup)
3. [Pipeline & Stages Configuration](#3-pipeline--stages-configuration)
4. [Environment Variables](#4-environment-variables)
5. [Webhook Configuration (Two-Way Sync)](#5-webhook-configuration-two-way-sync)
6. [Conversation AI Agent Prompt](#6-conversation-ai-agent-prompt)
7. [Testing & Verification](#7-testing--verification)
8. [Troubleshooting](#8-troubleshooting)

---

## 1. Architecture Overview

```
┌──────────────────┐         ┌──────────────────┐
│  ShieldHome Pro  │         │   GoHighLevel    │
│  (Next.js CRM)   │         │  (Sub-Account)   │
│                  │         │                  │
│  Lead Created ───┼────────►│  Contact + Opp   │
│  Status Changed ─┼────────►│  Stage Updated   │
│                  │         │                  │
│  Lead Updated  ◄─┼─────────┼─ Webhook POST    │
│  Activity Log  ◄─┼─────────┼─ Stage Change    │
│                  │         │  Inbound Msg     │
└──────────────────┘         └──────────────────┘
```

**Outbound (ShieldHome → GHL):**
- New lead → GHL Contact (upsert) + Opportunity in pipeline
- Status change → Opportunity stage update
- Lead tags: priority, score, property type, interests

**Inbound (GHL → ShieldHome):**
- Opportunity stage change → Lead status update + activity log
- Contact update → Tag sync
- Inbound message (call/SMS/email) → Activity log entry
- Note created → Activity log entry

---

## 2. GHL Sub-Account Setup

### 2a. Create or Select a Sub-Account

1. Log in to your GHL Agency account
2. Go to **Sub-Accounts** → **Create Sub-Account**
3. Name it: `ShieldHome Pro — [Market Name]`
4. Fill in business info:
   - Business Name: ShieldHome Pro
   - Phone: Your rep phone number
   - Industry: Home Security
5. Save

### 2b. Get Your API Credentials

1. In the sub-account, go to **Settings** → **Business Profile**
2. Copy the **Location ID** — this is your `GHL_LOCATION_ID`
3. Go to **Settings** → **Integrations** → **API Key**
4. If using a Location API key (v1): copy the key
5. If using a Private Integration (recommended for production):
   - Go to **Marketplace** → **My Apps** → **Create App**
   - Set scopes: `contacts.read`, `contacts.write`, `opportunities.read`, `opportunities.write`
   - Install in your sub-account
   - Copy the access token
6. This becomes your `GHL_API_KEY`

---

## 3. Pipeline & Stages Configuration

### Create the Pipeline

1. In GHL, go to **Opportunities** → **Pipelines**
2. Click **+ Create Pipeline**
3. Name it: `Vivint Sales Pipeline`
4. Create these stages **in order** (names must match exactly):

| Stage Name        | ShieldHome Status    | Description                       |
|-------------------|----------------------|-----------------------------------|
| New Lead          | NEW                  | Fresh lead, not yet contacted     |
| Contacted         | CONTACTED            | Rep has made first contact        |
| No Answer         | NO_ANSWER            | Could not reach the lead          |
| Appointment Set   | APPOINTMENT_SET      | Consultation scheduled            |
| Appointment Sat   | APPOINTMENT_SAT      | Consultation completed            |
| Quoted            | QUOTED               | Quote delivered to homeowner      |
| Won               | CLOSED_WON           | Sale closed                       |
| Lost              | CLOSED_LOST          | Lost / Cancelled                  |
| Not Qualified     | NOT_QUALIFIED        | Lead does not qualify             |

5. Save the pipeline
6. Copy the **Pipeline ID** from the URL — this is your `GHL_PIPELINE_ID`
   - The URL looks like: `app.gohighlevel.com/.../opportunities/pipeline/<PIPELINE_ID>`

---

## 4. Environment Variables

Add these to your Vercel project (or `.env.local`):

```bash
# GoHighLevel
GHL_API_KEY="eyJhbGciOi..."           # API key or Private Integration token
GHL_LOCATION_ID="abc123def456"         # Location (sub-account) ID
GHL_PIPELINE_ID="pipeline_xyz789"      # Pipeline ID from step 3
GHL_WEBHOOK_SECRET="a-strong-random-secret"  # You generate this
```

Generate the webhook secret:
```bash
openssl rand -hex 32
```

### Vercel Dashboard

1. Go to your Vercel project → **Settings** → **Environment Variables**
2. Add each variable above for **Production** and **Preview**
3. Redeploy for changes to take effect

---

## 5. Webhook Configuration (Two-Way Sync)

### Set Up GHL → ShieldHome Webhooks

This enables GHL to push updates back to ShieldHome when reps work leads inside GHL.

1. In GHL, go to **Automation** → **Workflows**
2. Create a new workflow: `ShieldHome Sync`
3. Set the trigger to **Opportunity Stage Changed**
4. Add an action: **Webhook (Custom)**
5. Configure:
   - **Method:** POST
   - **URL:** `https://shieldhomepro.com/api/webhooks/ghl?secret=YOUR_GHL_WEBHOOK_SECRET`
   - **Body:** Use the default JSON payload (includes contact info + stage data)
6. Save and **publish** the workflow

### Additional Webhook Triggers (Optional)

For full two-way sync, create additional workflows for:

| Trigger                    | URL (same base)                                            |
|----------------------------|------------------------------------------------------------|
| Contact Tag Added          | `https://shieldhomepro.com/api/webhooks/ghl?secret=XXX`   |
| Inbound Message Received   | `https://shieldhomepro.com/api/webhooks/ghl?secret=XXX`   |
| Note Created               | `https://shieldhomepro.com/api/webhooks/ghl?secret=XXX`   |

All events go to the same endpoint — the handler routes by event type automatically.

### Verify the Webhook

```bash
curl -X GET "https://shieldhomepro.com/api/webhooks/ghl?secret=YOUR_SECRET"
# Should return: {"status":"ok","message":"GHL webhook endpoint active"}
```

---

## 6. Conversation AI Agent Prompt

If you're using GHL's **Conversation AI** to auto-respond to leads, use this system prompt to ensure the bot represents ShieldHome Pro correctly:

```
You are a friendly, professional appointment setter for ShieldHome Pro, an authorized Vivint Smart Home dealer. Your job is to qualify leads and book appointments with our Smart Home Pros.

ABOUT US:
- ShieldHome Pro is an authorized Vivint Smart Home dealer
- We help homeowners get professional home security systems installed at $0 down
- Vivint is the #1 rated smart home security provider (2M+ customers)
- We serve homeowners (not renters) across the US

YOUR GOALS (in order):
1. Greet warmly and confirm they requested a home security quote
2. Confirm they are a homeowner (renters do not qualify)
3. Confirm their property type and timeline
4. Book an appointment for a free in-home or virtual consultation
5. Set the opportunity to "Appointment Set" stage when booked

QUALIFYING QUESTIONS:
- "Great news! I see you requested a free home security quote. Is this still something you're interested in?"
- "Perfect! And just to confirm — do you own your home?"
- "What's the best day and time for a quick 15-minute consultation? We can do in-person or virtual."

OBJECTION HANDLING:
- "How much does it cost?" → "That's the best part — Vivint systems start at $0 down with professional installation included. Your Smart Home Pro will walk you through all the pricing options during your free consultation."
- "I'm just looking" → "Totally understand! The consultation is completely free and no-obligation. Most people are surprised by how affordable it is. What day works best for a quick chat?"
- "I'm a renter" → "I appreciate your interest! Unfortunately, Vivint requires homeowner approval for installation. If you become a homeowner in the future, we'd love to help you out!"
- "Is this a scam?" → "Great question! ShieldHome Pro is an authorized Vivint dealer. Vivint is a publicly traded company (NYSE: VVNT) with over 2 million customers. You can verify us at vivint.com."

RULES:
- Never make up pricing — always direct to the consultation
- Never guarantee specific discounts or promotions
- Be concise — keep messages under 3 sentences when possible
- If they ask to speak to a human, say "Absolutely! Let me connect you with one of our Smart Home Pros right away." and set the tag "human-requested"
- Always be warm, helpful, and zero-pressure
- If they are not interested, thank them and wish them well
```

---

## 7. Testing & Verification

### Test the Full Flow

1. **Submit a test lead** on the ShieldHome Pro landing page
2. **Check GHL:** The contact should appear in Contacts and an Opportunity should appear in the Vivint Sales Pipeline at the "New Lead" stage
3. **Move the opportunity** in GHL from "New Lead" to "Contacted"
4. **Check ShieldHome CRM:** The lead status should update to "CONTACTED" with an activity log entry noting the sync from GHL

### Test the Webhook

```bash
# Simulate a GHL opportunity stage change
curl -X POST "https://shieldhomepro.com/api/webhooks/ghl?secret=YOUR_SECRET" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "OpportunityStageUpdate",
    "contact": {
      "email": "test@example.com",
      "phone": "+15551234567"
    },
    "pipelineStageName": "Contacted"
  }'
```

### Verify Logs

Check Vercel function logs for `[GHL]` prefixed messages:
- `[GHL] Synced lead xxx → contact yyy, opp zzz` — outbound sync working
- `[GHL Webhook] Updated lead xxx status: NEW → CONTACTED` — inbound sync working

---

## 8. Troubleshooting

| Symptom                           | Cause                                  | Fix                                                    |
|-----------------------------------|----------------------------------------|--------------------------------------------------------|
| Leads not appearing in GHL        | Missing `GHL_API_KEY` or `GHL_LOCATION_ID` | Check env vars in Vercel dashboard                 |
| Webhook returns 401               | Wrong secret in URL                    | Verify `GHL_WEBHOOK_SECRET` matches query param        |
| Stage sync not working            | Stage names don't match                | Stage names in GHL must exactly match the table in §3  |
| Duplicate contacts in GHL         | GHL upsert failing                     | Check that email/phone format is consistent            |
| GHL API returns 401               | Expired or invalid API key             | Regenerate API key in GHL settings                     |
| Webhook not firing from GHL       | Workflow not published                 | Go to Automation → Workflows → ensure it's "Published" |

### Key Files

| File                                    | Purpose                                    |
|-----------------------------------------|--------------------------------------------|
| `lib/gohighlevel.ts`                    | GHL API client, contact/opportunity sync   |
| `app/api/webhooks/ghl/route.ts`         | Inbound webhook handler (GHL → ShieldHome) |
| `app/api/leads/route.ts`               | Lead creation (includes GHL outbound sync) |
| `app/api/leads/[id]/route.ts`          | Lead update (syncs status changes to GHL)  |

---

## Data Flow Summary

```
LEAD SUBMITS FORM
       │
       ▼
  POST /api/leads
       │
       ├── Create lead in PostgreSQL
       ├── Send SMS confirmation (Twilio)
       ├── Send rep alert SMS (Twilio)
       ├── Send welcome email (SendGrid)
       ├── Send Slack notification
       └── Sync to GHL ← NEW
             ├── Upsert Contact (with tags)
             └── Create Opportunity (New Lead stage)

REP UPDATES LEAD IN SHIELDHOME CRM
       │
       ▼
  PATCH /api/leads/[id]
       │
       ├── Update lead in PostgreSQL
       ├── Log activity
       └── Sync stage to GHL ← NEW

REP MOVES OPPORTUNITY IN GHL
       │
       ▼
  POST /api/webhooks/ghl
       │
       ├── Match contact → lead by email/phone
       ├── Update lead status in PostgreSQL
       └── Log activity with GHL source tag
```
