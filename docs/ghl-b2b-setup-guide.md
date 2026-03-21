# GoHighLevel B2B Setup Guide — ShieldHome Pro

## Overview

This guide covers setting up GoHighLevel (GHL) as the CRM and automation backbone for ShieldHome Pro's B2B outbound operation. It covers sub-account configuration, pipeline setup, automation workflows, and integration with Clay and Instantly.

---

## 1. Sub-Account Structure

### Recommended Setup
Create a dedicated sub-account for the B2B outbound operation, separate from any B2C or referral pipelines.

**Sub-Account Name:** `ShieldHome Pro — B2B Outbound`

**Timezone:** Set to match primary sales team timezone (e.g., `America/Chicago`)

**Business Category:** Home Services / Security

---

## 2. Contact Fields (Custom)

Add the following custom fields under **Settings → Custom Fields → Contacts**:

| Field Name | Type | Notes |
|---|---|---|
| `Company Name` | Text | Required for B2B |
| `Company Size` | Dropdown | 1-10, 11-50, 51-200, 200+ |
| `Industry` | Dropdown | Property Mgmt, HOA, Commercial, Construction, etc. |
| `Lead Source` | Dropdown | Clay, Apollo, Manual, Referral |
| `Properties Under Management` | Number | For property managers |
| `Clay Enriched` | Checkbox | Mark when Clay data is appended |
| `Instantly Sequence` | Text | Track active Instantly sequence name |
| `Meeting Booked Date` | Date | Auto-populated via calendar link |

---

## 3. Pipeline Setup

### Pipeline: B2B Outbound

Navigate to **Opportunities → Pipelines → Add Pipeline**

**Pipeline Name:** `B2B Outbound`

**Stages:**

1. **New Lead** — Freshly imported from Clay/Apollo
2. **Contacted** — At least one touch sent via Instantly or manual
3. **Engaged** — Replied to email or clicked link
4. **Meeting Booked** — Calendar link clicked / meeting confirmed
5. **Meeting Held** — Discovery call completed
6. **Proposal Sent** — Deck / pricing sent
7. **Negotiating** — Active back-and-forth on deal terms
8. **Closed Won** — Contract signed
9. **Closed Lost** — Not a fit / timing / competitor

**Default Pipeline:** Set B2B Outbound as default for contacts tagged `B2B`

---

## 4. Tags

Use consistent tags to segment contacts and trigger automations:

| Tag | Purpose |
|---|---|
| `b2b-prospect` | All B2B outbound leads |
| `clay-enriched` | Enriched via Clay workflow |
| `instantly-active` | Currently in an Instantly sequence |
| `instantly-replied` | Replied to Instantly email |
| `meeting-requested` | Requested a call |
| `meeting-booked` | Meeting on calendar |
| `meeting-no-show` | Did not attend scheduled meeting |
| `disqualified` | Not a fit — remove from all sequences |
| `do-not-contact` | Opted out — never contact again |

---

## 5. Automations (Workflows)

### 5.1 — New Lead Intake

**Trigger:** Contact tag added → `b2b-prospect`

**Actions:**
1. Wait 0 min → Assign to default B2B rep
2. Move opportunity to stage: **New Lead**
3. Send internal Slack notification (via webhook) with contact name, company, and source
4. Add to GHL SMS sequence (optional): intro text if mobile number present

---

### 5.2 — Instantly Reply Received

**Trigger:** Webhook from Instantly (reply event) → tag added `instantly-replied`

**Actions:**
1. Move opportunity to stage: **Engaged**
2. Remove tag: `instantly-active`
3. Create task for rep: "Follow up with [Contact Name] — replied to email"
4. Due date: same day, high priority
5. Send internal notification to rep

**Webhook Setup in Instantly:**
- Go to Instantly → Settings → Webhooks
- Add webhook URL: `https://[your-ghl-subdomain].gohighlevel.com/webhooks/instantly-reply`
- Events: `reply_received`
- Map fields: `email` → GHL contact lookup

---

### 5.3 — Meeting Booked

**Trigger:** Calendar appointment created (GHL Calendars)

**Actions:**
1. Move opportunity to stage: **Meeting Booked**
2. Add tag: `meeting-booked`
3. Send confirmation email to prospect (use template: *Meeting Confirmation — B2B*)
4. Create task: "Prep discovery call notes for [Contact Name]"
5. Send rep SMS reminder 1 hour before meeting

---

### 5.4 — Meeting No-Show

**Trigger:** Appointment status changed → `No Show`

**Actions:**
1. Add tag: `meeting-no-show`
2. Wait 30 min
3. Send email: *No-Show Follow-Up* template
4. Create task: "Re-engage no-show — [Contact Name]" — due in 2 days
5. Move opportunity back to: **Engaged**

---

### 5.5 — Disqualification

**Trigger:** Contact tag added → `disqualified`

**Actions:**
1. Move opportunity to stage: **Closed Lost**
2. Remove from all active sequences (webhook to Instantly to pause contact)
3. Remove tags: `instantly-active`, `b2b-prospect`
4. Log reason in opportunity notes (manual step — remind via task)

---

## 6. Calendar Setup

### B2B Discovery Call Calendar

Navigate to **Settings → Calendars → Add Calendar**

**Settings:**
- **Name:** `B2B Discovery Call — ShieldHome Pro`
- **Duration:** 30 minutes
- **Buffer:** 15 min before, 15 min after
- **Availability:** Mon–Fri, 9am–5pm (rep's timezone)
- **Confirmation Page:** Custom page with case study link
- **Reminder Emails:** 24 hours before, 1 hour before

**Calendar Link Usage:**
- Embed in Instantly email sequences (Step 3+)
- Include in GHL follow-up emails post-reply
- Share in LinkedIn DMs manually

---

## 7. Integrations

### 7.1 — Clay → GHL (via Webhook)

In Clay, add a webhook action at the end of your enrichment table:

- **URL:** `https://[your-ghl-subdomain].gohighlevel.com/webhooks/clay-import`
- **Method:** POST
- **Payload fields to map:**

```json
{
  "firstName": "{{first_name}}",
  "lastName": "{{last_name}}",
  "email": "{{email}}",
  "phone": "{{phone}}",
  "companyName": "{{company_name}}",
  "industry": "{{industry}}",
  "companySize": "{{employee_count}}",
  "tags": ["b2b-prospect", "clay-enriched"],
  "source": "Clay"
}
```

In GHL, configure the inbound webhook under **Settings → Integrations → Webhooks** to map these fields to the correct contact properties.

---

### 7.2 — Instantly → GHL (Reply Webhook)

See Section 5.2 above. Key events to hook:

| Instantly Event | GHL Action |
|---|---|
| `reply_received` | Tag `instantly-replied`, move to Engaged |
| `unsubscribe` | Tag `do-not-contact`, remove from pipeline |
| `bounce` | Tag `email-bounced`, create task to find alt email |

---

### 7.3 — Make.com (Optional Middleware)

If direct webhooks are insufficient, use Make.com as middleware:

- **Scenario:** Instantly → Make → GHL
- Map reply events to GHL contact updates
- Handle deduplication logic in Make before creating GHL contacts
- See `docs/make-b2b-scenarios.md` for scenario blueprints

---

## 8. Reporting & Dashboards

### Opportunity Pipeline Report

Navigate to **Reporting → Opportunities**

Track weekly:
- Leads added (New Lead stage entries)
- Engaged rate (% reaching Engaged stage)
- Meeting booked rate (% reaching Meeting Booked)
- Close rate (Closed Won / Meeting Held)

### Recommended Dashboard Widgets

| Widget | Metric |
|---|---|
| Pipeline Value | Total open opportunity value |
| Meetings This Week | Count of Meeting Booked this week |
| Leads by Source | Clay vs Apollo vs Manual |
| Stage Funnel | Visual drop-off across pipeline stages |
| Tasks Due Today | Rep accountability view |

---

## 9. User Roles & Permissions

| Role | Access Level |
|---|---|
| Admin | Full access — owner/ops |
| Sales Rep | Contacts, Opportunities, Calendar, Tasks |
| SDR | Contacts (read/add), Tasks |
| Reporting Only | Dashboards and reports only |

Assign roles under **Settings → Team → Roles**

---

## 10. Checklist — Initial Setup

- [ ] Sub-account created and configured
- [ ] Custom fields added
- [ ] B2B Outbound pipeline created with all stages
- [ ] Tags documented and added to GHL
- [ ] Automations 5.1–5.5 built and tested
- [ ] Discovery Call calendar configured
- [ ] Clay webhook configured and tested with a sample contact
- [ ] Instantly reply webhook connected and tested
- [ ] Dashboard widgets configured
- [ ] Team users added with correct roles
- [ ] Test end-to-end: Clay → GHL → Instantly → Reply → GHL stage update
