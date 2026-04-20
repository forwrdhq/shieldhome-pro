# ShieldHome Pro — Vivint Authorized Dealer Lead Generation Platform

Full-stack lead generation and CRM system for an authorized Vivint Smart Home dealer.

## Tech Stack

- **Framework:** Next.js 14 (App Router) + TypeScript
- **Database:** PostgreSQL via Prisma ORM (v5)
- **Styling:** Tailwind CSS
- **SMS:** Twilio
- **Email:** SendGrid
- **Auth:** NextAuth.js v4 (credentials)
- **Hosting:** Vercel

## Quick Start (Local Development)

```bash
# 1. Install dependencies
cd shieldhome-pro
npm install

# 2. Configure environment
cp .env.example .env.local
# Fill in all values (see Environment Variables below)

# 3. Set up database (PostgreSQL required)
npx prisma migrate dev

# 4. Seed database (creates admin user + sample leads)
npm run seed

# 5. Start dev server
npm run dev
```

Open http://localhost:3000 for the landing page.
Open http://localhost:3000/login for the CRM dashboard.

**Default credentials after seeding:**
- Admin: `admin@shieldhomepro.com` / `admin123`
- Rep: `rep@shieldhomepro.com` / `rep123`

## Routes

### Landing Pages
| Route | Description |
|-------|-------------|
| `/` | Primary landing page with full quiz funnel |
| `/fb` | Facebook ads landing page (no nav, mobile-optimized) |
| `/google` | Google ads landing page (dynamic headline via `?kw=`) |
| `/thank-you` | Post-submission confirmation + conversion pixels |

### CRM Dashboard (auth required)
| Route | Description |
|-------|-------------|
| `/login` | Admin login |
| `/dashboard` | Overview with KPIs + recent leads table |
| `/leads` | Pipeline (Kanban) + Table view |
| `/leads/[id]` | Full lead detail + activity timeline |
| `/analytics` | Analytics, funnel metrics, source breakdown, CSV export |
| `/commissions` | Commission tracking |
| `/settings` | System settings |

### API Routes
| Route | Method | Description |
|-------|--------|-------------|
| `/api/leads` | POST | Create lead (scores, notifies, saves) |
| `/api/leads` | GET | List leads with filters + pagination |
| `/api/leads/[id]` | GET/PATCH | Lead detail + updates |
| `/api/leads/[id]/disposition` | PATCH | Quick status disposition |
| `/api/analytics` | GET | Analytics data by date range |
| `/api/analytics/export` | GET | CSV export |
| `/api/notifications/sms` | POST | Send SMS via Twilio |
| `/api/notifications/email` | POST | Send email via SendGrid |
| `/api/cron/nurture` | GET | Nurture email sequence (every 6h) |
| `/api/cron/followup-sms` | GET | Follow-up SMS sequence (every 2h) |
| `/api/cron/stale-leads` | GET | Stale lead alerts (daily) |

## Deployment (Vercel + Supabase)

```bash
# 1. Push to GitHub
# 2. Connect repo to Vercel
# 3. Add all env vars in Vercel dashboard
# 4. Run migrations on production DB:
npx prisma migrate deploy

# Cron jobs are auto-configured via vercel.json
```

## Environment Variables

See `.env.example` for all required variables. Key ones:

```env
DATABASE_URL=              # PostgreSQL connection string
NEXTAUTH_SECRET=           # Random secret for JWT signing
TWILIO_ACCOUNT_SID=        # Twilio credentials
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=       # Your Twilio number
REP_PHONE_NUMBER=          # Sales rep phone for lead alerts
SENDGRID_API_KEY=          # SendGrid API key
SLACK_WEBHOOK_URL=         # Optional Slack notifications
GHL_API_KEY=               # GoHighLevel Private Integration Token (pit-...)
GHL_LOCATION_ID=           # GoHighLevel sub-account Location ID
NEXT_PUBLIC_META_PIXEL_ID= # Facebook Pixel ID
NEXT_PUBLIC_GOOGLE_ADS_ID= # Google Ads conversion ID
CRON_SECRET=               # Secret for cron route protection
```

## Lead Scoring Algorithm

Leads are automatically scored 0-100:
- Homeowner: +30 | Renter: +5
- House: +15 | Townhome: +12 | Condo: +8 | Business: +10
- ASAP: +25 | 1-2 weeks: +18 | 1 month: +10 | Researching: +3
- Products selected: +5 each (max +15)
- Google traffic: +10 | Organic: +8 | Facebook: +5
- Desktop: +5

Priority: **HOT** (80+) | **HIGH** (60-79) | **MEDIUM** (40-59) | **LOW** (0-39)

## Post-Deployment Checklist

- [ ] Quiz funnel submits without errors
- [ ] Confirmation SMS sends within 10 seconds
- [ ] Rep alert SMS sends immediately
- [ ] Welcome email sends within 30 seconds
- [ ] Slack notification fires
- [ ] Lead appears in CRM dashboard
- [ ] Meta Pixel events fire (use Pixel Helper extension)
- [ ] Google Ads conversion fires (use Tag Assistant)
- [ ] All pages pass mobile responsiveness check
