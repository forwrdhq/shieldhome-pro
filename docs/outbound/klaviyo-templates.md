# Klaviyo Email Templates — ShieldHome Pro

All templates live in the shared Klaviyo account (`REgZTV`). They use `{{ first_name }}` for personalization and include a standard `{% unsubscribe 'Unsubscribe' %}` footer block.

---

## Nurture Sequence (6 emails)

These templates are designed for use in a **Klaviyo Flow** triggered when a lead is created. They mirror the 6-step sequence already running via SendGrid (`/app/api/cron/nurture/route.ts`).

| Step | Klaviyo Template ID | Name | Subject | Timing |
|------|---------------------|------|---------|--------|
| 1 | `TugN76` | Nurture 1: Welcome / Quote Confirmation | Your Free Home Security Quote — Here's What's Next | Immediate (0h) |
| 2 | `RuzpKi` | Nurture 2: Social Proof (2M Families) | Why 2 million families chose Vivint | +24h |
| 3 | `T5HLqu` | Nurture 3: The Case for Home Security (Stats) | Is a home security system really worth it? | +72h |
| 4 | `XgaPVU` | Nurture 4: Exclusive Offer (Limited-Time Promo) | Your exclusive Vivint offer — this won't last long | +168h (7d) |
| 5 | `Yei9Yt` | Nurture 5: Testimonials / Customer Stories | Still thinking about home security? | +336h (14d) |
| 6 | `UwN8tA` | Nurture 6: Last Chance / File Closing | Closing your quote file — last chance | +504h (21d) |

### Email Angle per Step

1. **Welcome** — Confirmation + next steps. Builds trust immediately after form submit.
2. **Social Proof** — 2M+ families stat + Vivint feature table. Addresses "is this legit?" hesitation.
3. **Stats** — 1-in-36 burglary rate, $2,800 average loss, 300% deterrent effect. Answers "do I really need it?"
4. **Offer** — Free doorbell camera ($249 value) + free install + $0 down. Creates urgency to act now.
5. **Testimonials** — Three real customer stories (peace of mind, app control, monitoring response). Social proof for slow decision-makers.
6. **Last Chance** — Soft close. Sets a deadline and gives an easy "I'm still interested" path.

---

## Outbound Campaign Templates (3 templates)

These templates are assigned to draft campaigns and are designed for **one-time blast** sends to cold or warm lists.

| Klaviyo Template ID | Name | Subject | Best Audience |
|---------------------|------|---------|---------------|
| `WGWxAS` | Outbound: Re-Engagement (Cold Leads) | Still thinking about home security? Here's what's new. | Leads 60+ days old, no purchase |
| `WvF2Kz` | Outbound: Spring Safety Campaign | 🌱 Spring Home Security Checkup — Free Install Through April 30 | All subscribers (seasonal, send late March) |
| `Urkn4p` | Outbound: Referral / Neighbor Alert | Refer a neighbor, get $100 — no limit | Closed-won customers |

---

## Design System

All templates share the same design system:

- **Header**: `#1A1A2E` dark navy background, `#00C853` green brand name
- **CTAs**: `#00C853` green pill buttons, `font-weight:700`
- **Body bg**: `#f8f9fa` light gray
- **Card**: `#fff` white, `border-radius:12px`, subtle box-shadow
- **Font**: Arial/Helvetica, `color:#555`, `line-height:1.6`
- **Footer**: `#f1f1f1` gray, unsubscribe link + privacy policy

---

## Klaviyo Variable Reference

| Variable | Source | Usage |
|----------|--------|-------|
| `{{ first_name }}` | Profile property | Personalized greeting in subject + body |
| `{% unsubscribe 'Unsubscribe' %}` | Klaviyo built-in | Footer unsubscribe link (required) |
