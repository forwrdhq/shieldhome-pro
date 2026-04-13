# Tools

## APIs

- **ShieldHome Outreach API** (`https://shieldhome.pro/api/outreach/`)
  - `GET /prospects?status=REPLIED` — find prospects who replied
  - `GET /prospects?status=INTERESTED` — find interested prospects not yet converted
  - `GET /prospects/{id}` — get full prospect record with campaign and DMA info
  - `PATCH /prospects/{id}` — update prospect status or assign to campaign
  - `GET /campaigns` — campaign list with stats for weekly report
  - `GET /campaigns/{id}` — single campaign detail
  - `GET /suppression` — list suppression entries
  - `GET /suppression?email={email}` — check if a specific email is suppressed
  - `POST /suppression` — add emails/domains to suppression list (syncs to Instantly)
  - `GET /unsubscribe?email={email}` — process unsubscribe (use for manual unsubscribes)
  - Auth: `Authorization: Bearer {OUTREACH_API_TOKEN}`

- **Instantly API v2** (`https://api.instantly.ai/api/v2/`)
  - `GET /campaigns/analytics` — detailed campaign metrics
  - `GET /campaigns/analytics/overview` — aggregate stats
  - `GET /campaigns/analytics/daily` — day-by-day breakdown
  - `POST /leads/update-interest-status` — sync interest status back to Instantly
  - Auth: `Authorization: Bearer {INSTANTLY_API_KEY}`

- **ShieldHome CRM** (`https://shieldhome.pro/api/`)
  - `POST /leads/business` — create CRM lead (fallback if webhook auto-conversion failed)
  - Slack notifications fire automatically when a lead is created via this endpoint

## Suppression Workflow

When adding to suppression list via `POST /suppression`:
```json
{
  "entries": ["email@domain.com"],
  "reason": "not_interested",
  "syncToInstantly": true
}
```
Valid reasons: `manual`, `unsubscribe`, `bounce`, `not_interested`, `complaint`

The API auto-updates matching prospect statuses to `SUPPRESSED` and syncs to Instantly's block list.
