# Klaviyo Draft Campaigns — ShieldHome Pro

Three outbound campaigns have been created as **drafts** in Klaviyo. Each has a template assigned and is ready to be scheduled or sent.

---

## Draft Campaigns

### 1. Re-Engagement: Cold Leads
- **Campaign ID**: `01KM60K5MS1WX91HV1SE7JRWWS`
- **Template**: `WGWxAS` (Re-Engagement)
- **Subject**: Still thinking about home security? Here's what's new.
- **Preview**: The promotions are better than ever — free camera, $0 down, and more.
- **From**: ShieldHome Pro `<quotes@shieldhomepro.com>`
- **Audience**: All Subscribers (`SQwBkU`) — **filter to leads 60+ days old before sending**
- **Best send time**: Tues–Thurs, 10am–2pm local time
- **Goal**: Win back cold leads who went dark after the nurture sequence

### 2. Spring Safety Campaign 2026
- **Campaign ID**: `01KM60K72XD74KNYM7EKB8QYW7`
- **Template**: `WvF2Kz` (Spring Safety)
- **Subject**: 🌱 Spring Home Security Checkup — Free Install Through April 30
- **Preview**: Burglaries spike in spring. Lock in free installation before April 30th.
- **From**: ShieldHome Pro `<quotes@shieldhomepro.com>`
- **Audience**: All Subscribers (`SQwBkU`)
- **Send window**: March 24 – April 25, 2026
- **Goal**: Seasonal urgency + free install offer to drive calls before spring travel season

### 3. Referral Program Launch
- **Campaign ID**: `01KM60K8PF20H1PWZ1D1PPK275`
- **Template**: `Urkn4p` (Referral)
- **Subject**: Refer a neighbor, get $100 — no limit
- **Preview**: Every friend you refer who gets a Vivint system = $100 Visa gift card for you.
- **From**: ShieldHome Pro `<quotes@shieldhomepro.com>`
- **Audience**: Closed-won customers — **create a segment of `status = CLOSED_WON` before sending**
- **Goal**: Activate existing customers as referral sources; compound install rate

---

## Pre-Send Checklist

Before scheduling any campaign:

- [ ] Verify sender domain is authenticated in Klaviyo (SPF, DKIM, DMARC)
- [ ] Create the correct audience segment (don't blast the full `All Subscribers` list without filtering)
- [ ] Send a test email to `quotes@shieldhomepro.com` and review on mobile
- [ ] Confirm current promotions are accurate (free camera, install pricing, etc.)
- [ ] Check that phone number `(877) 555-0199` matches `NEXT_PUBLIC_PHONE_NUMBER` in env
- [ ] Review unsubscribe link renders correctly in the footer
- [ ] Confirm Smart Sending is enabled (prevents over-mailing)

---

## Audience Segments to Create

| Segment | Definition | Used By |
|---------|-----------|---------|
| Cold Leads 60d+ | Leads submitted >60 days ago, status not CLOSED_WON | Re-Engagement campaign |
| Active Nurture | `nurtureActive = true`, step < 6 | Flow only (not campaigns) |
| Closed Won Customers | `status = CLOSED_WON` | Referral campaign |
| All Quote Requests | Anyone who submitted the quiz | Spring campaign |
