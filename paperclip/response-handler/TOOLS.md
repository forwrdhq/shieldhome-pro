# Tools

## APIs

- **ShieldHome Outreach API** (`https://shieldhome.pro/api/outreach/`)
  - `GET /prospects?status=REPLIED` -- find prospects who replied
  - `GET /prospects?status=INTERESTED` -- find interested prospects
  - `GET /campaigns` -- campaign analytics and stats
  - `GET /unsubscribe?email={email}` -- process unsubscribe
  - Auth: `Authorization: Bearer {OUTREACH_API_TOKEN}`

- **Instantly API v2** (`https://api.instantly.ai/api/v2/`)
  - `GET /campaigns/analytics` -- detailed campaign metrics
  - `GET /campaigns/analytics/overview` -- aggregate stats
  - `GET /campaigns/analytics/daily` -- day-by-day breakdown
  - `POST /leads/update-interest-status` -- update lead status in Instantly
  - Auth: `Authorization: Bearer {INSTANTLY_API_KEY}`

- **ShieldHome CRM** (`https://shieldhome.pro/api/`)
  - `POST /leads/business` -- create CRM lead (fallback if webhook auto-conversion failed)
  - Slack notifications are automatic when leads are created
