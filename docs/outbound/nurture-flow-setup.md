# Klaviyo Nurture Flow Setup Guide

This guide explains how to wire the 6 Klaviyo nurture templates into a Klaviyo Flow to replace or supplement the SendGrid-based cron at `/app/api/cron/nurture/route.ts`.

---

## Current State (SendGrid Cron)

The existing nurture system works as follows:
- Cron runs every 6 hours (`/api/cron/nurture`)
- Queries leads where `nurtureActive = true` and `nurtureStep < 6`
- Sends the next email when the required hours have elapsed since `submittedAt`
- Tracks sends in `EmailLog` table and increments `nurtureStep`

**Schedule**: 0h → 24h → 72h → 168h → 336h → 504h

---

## Klaviyo Flow Configuration

To set up the equivalent flow in Klaviyo:

### Trigger
- **Type**: API / Custom Event
- **Event name**: `Lead Submitted`
- Fire this event from `/app/api/leads/route.ts` after a lead is created (see integration notes below)

### Flow Steps

```
[Trigger: Lead Submitted]
  │
  ├─ Email: TugN76 (Welcome)          ← Send immediately
  │
  ├─ Time Delay: 24 hours
  ├─ Email: RuzpKi (Social Proof)
  │
  ├─ Time Delay: 48 hours (72h total)
  ├─ Email: T5HLqu (Stats)
  │
  ├─ Time Delay: 96 hours (168h total)
  ├─ Email: XgaPVU (Offer)
  │
  ├─ Time Delay: 168 hours (336h total)
  ├─ Email: Yei9Yt (Testimonials)
  │
  ├─ Time Delay: 168 hours (504h total)
  └─ Email: UwN8tA (Last Chance)
```

### Flow Filters (add to each step)
- **Profile property** `status` is not equal to `CLOSED_WON`, `CLOSED_LOST`, `NOT_QUALIFIED`, `CANCELLED`
- This prevents nurture emails from going to leads already converted or disqualified

---

## Klaviyo Integration (API Event Firing)

To fire the `Lead Submitted` event from the app, add this to the lead creation flow:

```typescript
// lib/klaviyo.ts
export async function trackLeadSubmitted(lead: {
  id: string
  email: string
  firstName: string
  lastName: string
  phone: string
  zipCode?: string | null
  propertyType?: string | null
  timeline?: string | null
  leadScore: number
  priority: string
}) {
  const KLAVIYO_API_KEY = process.env.KLAVIYO_PRIVATE_API_KEY
  if (!KLAVIYO_API_KEY) return

  await fetch('https://a.klaviyo.com/api/events/', {
    method: 'POST',
    headers: {
      'Authorization': `Klaviyo-API-Key ${KLAVIYO_API_KEY}`,
      'Content-Type': 'application/json',
      'revision': '2024-10-15',
    },
    body: JSON.stringify({
      data: {
        type: 'event',
        attributes: {
          metric: { data: { type: 'metric', attributes: { name: 'Lead Submitted' } } },
          profile: {
            data: {
              type: 'profile',
              attributes: {
                email: lead.email,
                first_name: lead.firstName,
                last_name: lead.lastName,
                phone_number: lead.phone,
                location: { zip: lead.zipCode },
                properties: {
                  lead_id: lead.id,
                  property_type: lead.propertyType,
                  timeline: lead.timeline,
                  lead_score: lead.leadScore,
                  priority: lead.priority,
                  status: 'NEW',
                }
              }
            }
          },
          properties: {
            lead_id: lead.id,
            lead_score: lead.leadScore,
            priority: lead.priority,
          }
        }
      }
    })
  })
}
```

Add `KLAVIYO_PRIVATE_API_KEY` to `.env.local` and Vercel environment variables.

---

## Decision: Klaviyo Flow vs SendGrid Cron

| Factor | SendGrid Cron | Klaviyo Flow |
|--------|--------------|--------------|
| Current implementation | ✅ Active | Requires setup |
| Email deliverability | Good | Better (dedicated IP available) |
| Unsubscribe handling | Manual (`/unsubscribe` route) | Automatic (Klaviyo manages) |
| A/B testing | Not supported | Built-in |
| Analytics | `EmailLog` table only | Full Klaviyo reporting |
| Suppression list sync | Manual | Automatic |
| **Recommendation** | Keep for now | Migrate when ready |

**Suggested path**: Run both in parallel initially. Add a `klaviyoSynced` flag to the `Lead` model. When Klaviyo flow is confirmed working, set `nurtureActive = false` on synced leads to stop the cron from double-sending.
