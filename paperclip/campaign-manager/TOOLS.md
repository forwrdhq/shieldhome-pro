# Tools

## APIs

- **ShieldHome Outreach API** (`https://shieldhome.pro/api/outreach/`)
  - `GET /niches` — list all niche definitions (pass `?sequences=true` for email templates)
  - `GET /niches/{slug}` — get full niche config including 3-step email sequence
  - `GET /prospects?status=QUEUED` — find prospects waiting for campaigns
  - `GET /prospects?status=QUEUED&limit=100` — paginated (use `offset=` to page)
  - `POST /prospects/bulk-update` — mark a batch of prospects SENT after loading into Instantly
  - `POST /campaigns` — create campaign record (set `createInInstantly: true` to also create in Instantly)
  - `GET /campaigns` — list campaigns with filters (`?niche=`, `?status=`, `?limit=`)
  - `GET /campaigns/{id}` — get single campaign with full stats
  - `PATCH /campaigns/{id}` — update status, instantlyCampaignId, or stats
  - Auth: `Authorization: Bearer {OUTREACH_API_TOKEN}`

- **Instantly API v2** (`https://api.instantly.ai/api/v2/`)
  - `POST /campaigns` — create Instantly campaign
  - `POST /campaigns/{id}/activate` — start sending
  - `POST /campaigns/{id}/pause` — stop sending
  - `POST /leads/add` — bulk add leads to campaign (max 1000/request)
  - `GET /campaigns/analytics` — campaign performance metrics
  - `GET /campaigns/analytics/overview` — aggregate dashboard
  - `POST /subsequences` — create follow-up sequences
  - Auth: `Authorization: Bearer {INSTANTLY_API_KEY}`

## Workflow Notes

### Creating a Campaign End-to-End

1. `GET /niches/{slug}` — fetch the niche's 3-step email sequence
2. `POST /campaigns` with `createInInstantly: true` — creates DB record + Instantly campaign shell
3. Configure 3 sequence steps in Instantly using the niche's `sequence` array
4. `POST /leads/add` — bulk upload prospects with custom variables
5. `POST /campaigns/{id}/activate` — start sending
6. `PATCH /api/outreach/campaigns/{db-id}` — set `status: "ACTIVE"` and `instantlyCampaignId`
7. `POST /prospects/bulk-update` — set all loaded prospect IDs to `status: "SENT"`

### Custom Variables for Instantly Leads

Every lead uploaded to Instantly should include:
```json
{
  "email": "owner@business.com",
  "first_name": "{{firstName or 'there'}}",
  "custom_variables": {
    "company_name": "Business Name",
    "state": "CO",
    "campaign_slug": "dispensary_denver_2026-04-13",
    "lead_id": "prospect-db-id"
  }
}
```
