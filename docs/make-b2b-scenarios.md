# Make.com B2B Integration Scenarios — ShieldHome Pro

Step-by-step build guides for each Make.com scenario connecting Instantly, GoHighLevel, Slack, and Google Calendar.

---

## Table of Contents

1. [Scenario 1: Instantly Reply → GHL B2B Pipeline](#scenario-1-instantly-reply--ghl-b2b-pipeline)
2. [Scenario 2: GHL B2B Appointment Booked → Slack + Google Calendar](#scenario-2-ghl-b2b-appointment-booked--slack--google-calendar)
3. [Scenario 3: New B2B Website Lead → GHL + Slack](#scenario-3-new-b2b-website-lead--ghl--slack)
4. [Environment Variables Reference](#environment-variables-reference)

---

## Scenario 1: Instantly Reply → GHL B2B Pipeline

**Purpose:** When a prospect replies to a cold email in Instantly, route the reply into GHL and notify the team on Slack.

### Module 1 — Custom Webhook (Trigger)

1. In Make.com, create a new scenario
2. Add module: **Webhooks → Custom webhook**
3. Click **Add** to create a new webhook. Name it: `Instantly Reply Webhook`
4. Copy the generated URL — you'll paste this into Instantly's webhook settings
5. Click **OK**

**Instantly webhook payload structure:**

When a reply is detected, Instantly fires a POST with this JSON body:

```json
{
  "event_type": "reply_received",
  "timestamp": "2026-03-20T14:30:00Z",
  "lead": {
    "email": "john@acmecorp.com",
    "firstName": "John",
    "lastName": "Smith",
    "companyName": "Acme Corp"
  },
  "reply": {
    "text": "Hi, we're definitely interested in learning more about commercial security...",
    "subject": "Re: Security assessment for Acme Corp",
    "timestamp": "2026-03-20T14:30:00Z"
  },
  "campaign": {
    "id": "camp_abc123",
    "name": "Q1 2026 — Retail Security Outreach"
  },
  "lead_id": "lead_xyz789",
  "sentimentLabel": "Interested"
}
```

**Key fields:**

| Field | Path | Description |
|-------|------|-------------|
| Email | `lead.email` | Prospect's email address |
| First Name | `lead.firstName` | Prospect's first name |
| Last Name | `lead.lastName` | Prospect's last name |
| Company | `lead.companyName` | Business name |
| Reply Text | `reply.text` | Full reply message body |
| Campaign Name | `campaign.name` | Instantly campaign name |
| Campaign ID | `campaign.id` | Instantly campaign ID |
| Lead ID | `lead_id` | Instantly lead ID |
| Sentiment | `sentimentLabel` | One of: `Interested`, `Not Interested`, `Out of Office`, `Neutral`, `Unsubscribe` |

6. In Instantly, go to **Settings → Integrations → Webhooks**
7. Add a new webhook:
   - **Event:** Reply Received
   - **URL:** Paste the Make.com webhook URL from step 4
   - **Method:** POST
8. Save and test by sending a test reply from a test campaign

### Module 2 — Router

1. Add module: **Flow Control → Router**
2. Configure 3 branches:

**Branch A — Interested:**
- Label: `Interested`
- Condition: `sentimentLabel` **Text operators: Equal to** `Interested`

**Branch B — Not Interested / Unsubscribe:**
- Label: `Not Interested`
- Condition: `sentimentLabel` **Text operators: Equal to** `Not Interested`
- **OR** `sentimentLabel` **Text operators: Equal to** `Unsubscribe`

**Branch C — Out of Office:**
- Label: `Out of Office`
- Condition: `sentimentLabel` **Text operators: Equal to** `Out of Office`
- This branch has NO modules attached — Instantly handles re-scheduling automatically

### Module 3 — Branch A: HTTP POST to GHL (Interested)

1. On **Branch A**, add module: **HTTP → Make a request**
2. Configure:
   - **URL:** `{{GHL_B2B_WEBHOOK_URL}}` (set this in scenario Data Stores or as a variable)
   - **Method:** POST
   - **Headers:**
     - `Content-Type`: `application/json`
   - **Body type:** Raw
   - **Content type:** JSON (application/json)
   - **Request content:**

```json
{
  "firstName": "{{1.lead.firstName}}",
  "lastName": "{{1.lead.lastName}}",
  "email": "{{1.lead.email}}",
  "companyName": "{{1.lead.companyName}}",
  "leadSource": "Cold Email",
  "instantlyCampaignName": "{{1.campaign.name}}",
  "replyText": "{{1.reply.text}}",
  "tags": ["b2b-source-cold-email"]
}
```

3. Click **OK**

### Module 4 — Branch A: Slack Notification (Interested)

1. After the HTTP module on Branch A, add module: **Slack → Create a Message**
2. Configure:
   - **Connection:** Select your Slack workspace connection
   - **Channel:** `#b2b-leads`
   - **Text:**

```
📧 *New B2B Cold Email Reply*
*From:* {{1.lead.firstName}} {{1.lead.lastName}} at {{1.lead.companyName}}
*Campaign:* {{1.campaign.name}}
*Reply:* {{1.reply.text}}
*Sentiment:* {{1.sentimentLabel}}
```

3. Click **OK**

### Module 5 — Branch B: HTTP POST to GHL (Not Interested)

1. On **Branch B**, add module: **HTTP → Make a request**
2. Configure:
   - **URL:** `{{GHL_B2B_WEBHOOK_URL}}`
   - **Method:** POST
   - **Headers:**
     - `Content-Type`: `application/json`
   - **Body type:** Raw
   - **Content type:** JSON (application/json)
   - **Request content:**

```json
{
  "firstName": "{{1.lead.firstName}}",
  "lastName": "{{1.lead.lastName}}",
  "email": "{{1.lead.email}}",
  "companyName": "{{1.lead.companyName}}",
  "leadSource": "Cold Email",
  "instantlyCampaignName": "{{1.campaign.name}}",
  "tags": ["b2b-not-qualified", "b2b-source-cold-email"]
}
```

3. Click **OK**

### Activate

1. Toggle the scenario to **ON** (bottom-left)
2. Set scheduling to **Immediately** (runs on every webhook hit)
3. Name the scenario: `Instantly Reply → GHL B2B Pipeline`

---

## Scenario 2: GHL B2B Appointment Booked → Slack + Google Calendar

**Purpose:** When an appointment is booked in GHL's B2B Security Assessment calendar, notify Slack and create a Google Calendar event for the sales rep.

### Module 1 — Custom Webhook (Trigger)

1. Create a new scenario in Make.com
2. Add module: **Webhooks → Custom webhook**
3. Name it: `GHL Appointment Booked`
4. Copy the webhook URL

**Configure GHL to fire this webhook:**

1. In GHL, go to **Automation → Workflows**
2. Create a new workflow: `B2B Appointment → Make.com`
3. Set trigger: **Appointment Status → Booked**
   - Filter: Calendar = `B2B Security Assessment`
4. Add action: **Webhook (Custom)**
   - Method: POST
   - URL: Paste the Make.com webhook URL
   - Body: Default (GHL sends full appointment + contact data)
5. Publish the workflow

**GHL appointment webhook payload:**

```json
{
  "type": "AppointmentBooked",
  "appointment": {
    "id": "appt_abc123",
    "calendarId": "cal_xyz",
    "startTime": "2026-03-25T10:00:00-05:00",
    "endTime": "2026-03-25T11:00:00-05:00",
    "title": "B2B Security Assessment",
    "notes": "Interested in full camera system for 3 retail locations",
    "status": "booked"
  },
  "contact": {
    "id": "contact_123",
    "firstName": "Sarah",
    "lastName": "Johnson",
    "email": "sarah@retailco.com",
    "phone": "+15551234567",
    "companyName": "RetailCo Inc",
    "tags": ["b2b", "retail"],
    "customFields": {
      "businessType": "Retail",
      "numberOfLocations": "3"
    }
  }
}
```

### Module 2 — Slack Notification

1. Add module: **Slack → Create a Message**
2. Configure:
   - **Connection:** Your Slack workspace
   - **Channel:** `#b2b-sales`
   - **Text:**

```
📅 *B2B Assessment Booked*
*Business:* {{1.contact.firstName}} {{1.contact.lastName}} — {{1.contact.companyName}}
*Type:* {{1.contact.customFields.businessType}}
*Date/Time:* {{formatDate(1.appointment.startTime; "MMMM D, YYYY")}} at {{formatDate(1.appointment.startTime; "h:mm A")}}
*Phone:* {{1.contact.phone}}
*Notes:* {{1.appointment.notes}}
```

3. Click **OK**

### Module 3 — Google Calendar Event

1. Add module: **Google Calendar → Create an Event**
2. Configure:
   - **Connection:** Connect your Google account (the one with access to the sales rep calendar)
   - **Calendar ID:** Use the `SALES_REP_CALENDAR_ID` — typically `sales@shieldhomepro.com` or the rep's email
   - **Event Name:** `Security Assessment — {{1.contact.companyName}}`
   - **Start Date:** `{{1.appointment.startTime}}`
   - **End Date:** `{{1.appointment.endTime}}`
   - **Description:**

```
B2B Security Assessment

Contact: {{1.contact.firstName}} {{1.contact.lastName}}
Business: {{1.contact.companyName}}
Type: {{1.contact.customFields.businessType}}
Locations: {{1.contact.customFields.numberOfLocations}}
Phone: {{1.contact.phone}}
Email: {{1.contact.email}}

Notes: {{1.appointment.notes}}

---
Lead managed in GHL: https://app.gohighlevel.com/contacts/{{1.contact.id}}
```

   - **Reminders:** Add: 30 minutes before (popup), 1 day before (email)
   - **Color:** Green (Sage)

3. Click **OK**

### Activate

1. Toggle scenario to **ON**
2. Scheduling: **Immediately**
3. Name: `GHL B2B Appointment Booked → Slack + Calendar`

---

## Scenario 3: New B2B Website Lead → GHL + Slack

**Purpose:** Backup/redundant path — when a B2B lead submits the commercial security form on the website, the Next.js API posts to this Make.com webhook for Slack notification and any additional routing.

> **Note:** The primary path fires to GHL directly from `POST /api/b2b-lead`. This Make.com scenario provides the Slack notification and is a backup GHL path.

### Module 1 — Custom Webhook (Trigger)

1. Create a new scenario in Make.com
2. Add module: **Webhooks → Custom webhook**
3. Name it: `B2B Website Lead`
4. Copy the webhook URL → set it as `MAKE_B2B_WEBHOOK_URL` in your Vercel env vars

**Payload sent by the Next.js API (`POST /api/b2b-lead`):**

```json
{
  "firstName": "David",
  "lastName": "Chen",
  "email": "david@officepark.com",
  "phone": "+15559876543",
  "businessName": "OfficeParks LLC",
  "businessType": "Office",
  "numberOfLocations": "5",
  "biggestConcern": "Break-ins after hours",
  "source": "b2b-website",
  "submittedAt": "2026-03-20T15:45:00Z"
}
```

### Module 2 — Slack Notification

1. Add module: **Slack → Create a Message**
2. Configure:
   - **Connection:** Your Slack workspace
   - **Channel:** `#b2b-leads`
   - **Text:**

```
🏢 *New B2B Website Lead*
*Name:* {{1.firstName}} {{1.lastName}}
*Business:* {{1.businessName}} ({{1.businessType}})
*Locations:* {{1.numberOfLocations}}
*Phone:* {{1.phone}}
*Email:* {{1.email}}
*Concern:* {{1.biggestConcern}}
```

3. Click **OK**

### Activate

1. Toggle scenario to **ON**
2. Scheduling: **Immediately**
3. Name: `New B2B Website Lead → Slack`

---

## Environment Variables Reference

These environment variables are used across the Make.com scenarios and the ShieldHome Pro application:

| Variable | Where Used | Description |
|----------|------------|-------------|
| `GHL_B2B_WEBHOOK_URL` | Make.com Scenario 1 & /api/instantly-webhook | GHL inbound webhook URL for B2B contacts |
| `MAKE_B2B_WEBHOOK_URL` | /api/b2b-lead | Make.com Scenario 3 webhook URL |
| `INSTANTLY_WEBHOOK_SECRET` | /api/instantly-webhook | Bearer token for Instantly webhook auth |
| `SLACK_WEBHOOK_URL` | /api/instantly-webhook | Slack incoming webhook URL |
| `SALES_REP_CALENDAR_ID` | Make.com Scenario 2 | Google Calendar ID for the sales rep |

### Instantly Setup

1. In Instantly, go to **Settings → Integrations → Webhooks**
2. Add two webhooks for the "Reply Received" event:
   - **Primary:** Make.com Scenario 1 webhook URL
   - **Backup:** `https://shieldhomepro.com/api/instantly-webhook` with header `Authorization: Bearer {{INSTANTLY_WEBHOOK_SECRET}}`

### Testing Checklist

- [ ] Send a test reply in Instantly with sentiment "Interested" → verify contact appears in GHL and Slack notification fires
- [ ] Send a test reply with sentiment "Not Interested" → verify GHL receives `b2b-not-qualified` tag
- [ ] Book a test appointment in GHL B2B calendar → verify Slack notification and Google Calendar event
- [ ] Submit the B2B form on the website → verify Slack notification via Make.com
- [ ] Hit `/api/instantly-webhook` with a test payload → verify GHL and Slack receive it
