# Tools

## APIs

- **ShieldHome Outreach API** (`https://shieldhome.pro/api/outreach/`)
  - `POST /daily-run` -- get today's niche+DMA rotation pick
  - `POST /prospects` -- bulk add prospects (handles dedup)
  - `GET /prospects` -- list prospects with filters
  - Auth: `Authorization: Bearer {OUTREACH_API_TOKEN}`

- **Instantly API v2** (`https://api.instantly.ai/api/v2/`)
  - `POST /supersearch-enrichment/count-leads-from-supersearch` -- count available leads
  - `POST /supersearch-enrichment/preview-leads-from-supersearch` -- preview before importing
  - `POST /supersearch-enrichment/enrich-leads-from-supersearch` -- import leads
  - Auth: `Authorization: Bearer {INSTANTLY_API_KEY}`
