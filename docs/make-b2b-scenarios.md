# Make.com B2B Integration Scenarios
## ShieldHome Pro — Build Guide

These three scenarios connect Instantly.ai (cold email) → GoHighLevel (CRM) via Make.com, handle appointment notifications, and provide a redundant intake path for website leads.

---

## Prerequisites

Before building any scenario:
1. Create a Make.com account at make.com
2. Install these Make.com apps/connections: **Custom Webhooks**, **HTTP**, **Slack**, **Google Calendar**
3. Have your GHL B2B webhook URL ready (from GHL Automations → Webhooks)
4. Have your Slack workspace connected
5. Have a Google Calendar connection authorized

---

## Scenario 1: "Instantly Reply → GoHighLevel B2B Pipeline"

**Purpose:** When a prospect replies to a cold email in Instantly and the sentiment is "Interested," automatically push them into GHL and notify the team.

**Expected Instantly Webhook Payload:**
```json
{
  "email": "jane@acmedental.com",
  "firstName": "Jane",
  "lastName": "Smith",
  "companyName": "Acme Dental Group",
  "replyText": "Yes, I'd be interested in learning more about switching.",
  "campaignName": "Dental - HIPAA Compliance Q1 2026",
  "campaignId": "camp_xxxxx",
  "leadId": "lead_xxxxx",
  "sentimentLabel": "Interested"
}
```

**Sentiment labels Instantly sends:** `Interested` | `Not Interested` | `Unsubscribe` | `Out of Office` | `Other`

---

### Step-by-Step Build

#### Module 1 — Custom Webhook (Trigger)

1. Click **+ Create a new scenario**
2. Search for and add **Webhooks → Custom webhook**
3. Click **Add** to create a new webhook
4. Name it: `Instantly Reply Intake`
5. Copy the webhook URL — you will paste this into Instantly's webhook settings
6. Click **OK**
7. In Instantly: go to **Settings → Webhooks → Add Webhook**
   - URL: paste the Make.com webhook URL
   - Events: select `Reply Received`
   - Click Save
8. Back in Make.com: click **Run once** and send a test reply in Instantly to capture the data structure
9. Make.com will show the incoming data — verify all fields are mapped correctly

#### Module 2 — Router

1. Click the **+** after the webhook module
2. Search for **Flow Control → Router**
3. This creates a branching path — you'll add 3 routes

**Route A — Interested (continue to GHL):**
- Click the first route's filter icon (wrench)
- Condition: `sentimentLabel` → `Equal to` → `Interested`
- Click **OK**

**Route B — Not Interested / Unsubscribe:**
- Click **Add route** on the Router
- Condition: `sentimentLabel` → `Equal to` → `Not Interested`
  Add OR: `sentimentLabel` → `Contains` → `Unsubscribe`
- Click **OK**

**Route C — Everything else (Out of Office, etc.):**
- Click **Add route**
- No filter — this is the fallback/catch-all
- This route has no actions (Instantly handles OOO re-scheduling automatically)

---

#### Route A, Module 3 — HTTP: POST to GoHighLevel

1. On Route A, click **+** to add a module
2. Search for **HTTP → Make a request**
3. Configure:
   - **URL:** `{{your GHL B2B webhook URL}}` (paste from GHL — Settings → Integrations → Webhooks or from your Workflow trigger)
   - **Method:** POST
   - **Headers:**
     - `Content-Type`: `application/json`
   - **Body type:** Raw
   - **Content type:** JSON (application/json)
   - **Request content:**
```json
{
  "firstName": "{{1.firstName}}",
  "lastName": "{{1.lastName}}",
  "email": "{{1.email}}",
  "companyName": "{{1.companyName}}",
  "leadSource": "Cold Email",
  "instantlyCampaignName": "{{1.campaignName}}",
  "replyText": "{{1.replyText}}",
  "tags": ["b2b-source-cold-email"],
  "leadType": "B2B"
}
```
   - Replace `{{1.fieldName}}` with the actual mapped fields from Module 1 using Make's variable picker
4. Click **OK**

> **Note:** The `{{1.x}}` references are Make.com's variable syntax — use the variable picker (click inside the field and select fields from Module 1's output).

---

#### Route A, Module 4 — Slack Notification

1. After the HTTP module on Route A, add **Slack → Create a Message**
2. Connect your Slack workspace if not already done
3. Configure:
   - **Channel:** `#b2b-leads`
   - **Message:**
```
📧 *New B2B Cold Email Reply*
*From:* {{1.firstName}} {{1.lastName}} at {{1.companyName}}
*Campaign:* {{1.campaignName}}
*Reply:* {{1.replyText}}
*Sentiment:* ✅ {{1.sentimentLabel}}
```
4. Click **OK**

---

#### Route B, Module 3 — HTTP: Mark as Not Interested in GHL

1. On Route B, click **+** to add an HTTP module
2. Same HTTP module setup as Route A, but modify the body:
```json
{
  "email": "{{1.email}}",
  "tags": ["b2b-not-qualified"],
  "status": "Not Interested",
  "leadType": "B2B"
}
```
3. This fires a GHL webhook that your "B2B Not Interested" workflow handles (add tag, move to Lost stage)

---

#### Scenario 1 Final Settings

1. Click the **clock icon** (scheduling) in the bottom left
2. Set to **Immediately** (webhook-triggered, runs instantly)
3. Click **Save** (disk icon, top right)
4. Name the scenario: `Instantly Reply → GoHighLevel B2B Pipeline`
5. Toggle the scenario **ON** (blue toggle, bottom left)

---

## Scenario 2: "GHL B2B Appointment Booked → Slack + Google Calendar"

**Purpose:** When a prospect books a B2B Security Assessment via GHL's calendar, notify the sales team in Slack and create a Google Calendar event for the rep.

**GHL Webhook Payload (from GHL Appointment Booked trigger):**
```json
{
  "type": "AppointmentCreate",
  "contactId": "contact_xxxxx",
  "contactName": "Jane Smith",
  "contactPhone": "+15555555555",
  "contactEmail": "jane@acmedental.com",
  "appointmentTitle": "B2B Security Assessment",
  "appointmentStatus": "confirmed",
  "startTime": "2026-04-15T10:00:00-07:00",
  "endTime": "2026-04-15T10:45:00-07:00",
  "calendarId": "cal_xxxxx",
  "calendarName": "B2B Security Assessment",
  "locationId": "loc_xxxxx",
  "customFields": {
    "business_name": "Acme Dental Group",
    "business_type": "Dental/Medical Office",
    "number_of_locations": "2–5 Locations"
  }
}
```

---

### Step-by-Step Build

#### Module 1 — Custom Webhook (Trigger)

1. **+ Create a new scenario**
2. Add **Webhooks → Custom webhook**
3. Name it: `GHL B2B Appointment Booked`
4. Copy webhook URL
5. In GHL: go to **Automation → Workflows → B2B Security Assessment Calendar**
   - Add action: **Webhook**
   - URL: paste the Make.com URL
   - Method: POST
   - Trigger: Appointment Created (on B2B Security Assessment calendar only)
6. Run a test booking to capture the data structure in Make.com

#### Module 2 — Slack: Post to #b2b-sales

1. Add **Slack → Create a Message**
2. Configure:
   - **Channel:** `#b2b-sales`
   - **Message:**
```
📅 *B2B Assessment Booked*
*Business:* {{1.customFields.business_name}} ({{1.customFields.business_type}})
*Contact:* {{1.contactName}}
*Date/Time:* {{formatDate(1.startTime; "MMMM D, YYYY")}} at {{formatDate(1.startTime; "h:mm A z")}}
*Phone:* {{1.contactPhone}}
*Email:* {{1.contactEmail}}
*# Locations:* {{1.customFields.number_of_locations}}
```
3. Click **OK**

#### Module 3 — Google Calendar: Create Event

1. Add **Google Calendar → Create an Event**
2. Connect your Google Calendar account (the sales rep's calendar)
3. Configure:
   - **Calendar:** select the rep's calendar or use `SALES_REP_CALENDAR_ID` env variable
   - **Title:** `Security Assessment — {{1.customFields.business_name}}`
   - **Start date/time:** `{{1.startTime}}`
   - **End date/time:** `{{1.endTime}}`
   - **Description:**
```
B2B Security Assessment — ShieldHome Pro

Contact: {{1.contactName}}
Phone: {{1.contactPhone}}
Email: {{1.contactEmail}}
Business: {{1.customFields.business_name}}
Business Type: {{1.customFields.business_type}}
Locations: {{1.customFields.number_of_locations}}

Notes: Please arrive 5 minutes early. Walk the full property perimeter and all entry points. Provide written recommendation within 24 hours.
```
   - **Location:** leave blank (specialist sets before visit)
4. Click **OK**

#### Scenario 2 Final Settings

1. Name: `GHL B2B Appointment Booked → Slack + Google Calendar`
2. Scheduling: Immediate (webhook-triggered)
3. Save and toggle **ON**

---

## Scenario 3: "New B2B Website Lead → Slack (Redundant Path)"

**Purpose:** This is a backup/redundant notification path. The ShieldHome Next.js `/api/b2b-lead` endpoint fires GHL directly as the primary path. Make.com also receives the webhook for Slack notifications and any additional routing logic.

**Payload sent by `/api/b2b-lead`:**
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane@acmedental.com",
  "phone": "5555555555",
  "businessName": "Acme Dental Group",
  "businessType": "Dental/Medical Office",
  "numberOfLocations": "2–5 Locations",
  "biggestConcern": "Compliance Requirements (HIPAA, State)",
  "leadType": "B2B",
  "source": "website",
  "leadId": "clxxxxxxxxx"
}
```

---

### Step-by-Step Build

#### Module 1 — Custom Webhook (Trigger)

1. **+ Create a new scenario**
2. Add **Webhooks → Custom webhook**
3. Name it: `ShieldHome B2B Website Lead`
4. Copy the webhook URL
5. Add this URL to your Vercel environment variables as `MAKE_B2B_WEBHOOK_URL`
   - Go to Vercel Dashboard → Project → Settings → Environment Variables
   - Add: `MAKE_B2B_WEBHOOK_URL` = the webhook URL you just copied
6. Run a test form submission on `/business` to capture the data structure

#### Module 2 — Slack: Post to #b2b-leads

1. Add **Slack → Create a Message**
2. Configure:
   - **Channel:** `#b2b-leads`
   - **Message:**
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

#### Optional Module 3 — HTTP: Secondary GHL Routing

If you want Make.com to also push to a specific GHL sub-account or pipeline not covered by the primary webhook:

1. Add **HTTP → Make a request**
2. URL: your secondary GHL webhook URL
3. Method: POST, Body: same JSON as the incoming webhook payload
4. This is optional — skip if the primary GHL integration in `/api/b2b-lead` is sufficient

#### Scenario 3 Final Settings

1. Name: `New B2B Website Lead → Slack`
2. Scheduling: Immediate
3. Save and toggle **ON**

---

## Testing All Scenarios

### Scenario 1 Test
1. Set Scenario 1 to **Run once**
2. Send a test reply to one of your Instantly campaigns (or use Postman to POST to the Make webhook URL with `"sentimentLabel": "Interested"`)
3. Verify in Make.com that all modules show green checkmarks
4. Check GHL → Contacts for the new contact
5. Check Slack #b2b-leads for the notification

### Scenario 2 Test
1. Book a test appointment in GHL's B2B Security Assessment calendar
2. Verify Slack #b2b-sales receives the message
3. Verify Google Calendar event is created

### Scenario 3 Test
1. Submit the form on `/business` (your ShieldHome site)
2. Verify Slack #b2b-leads receives the notification
3. Verify GHL received the lead directly from the API endpoint

---

## Common Issues & Fixes

| Issue | Fix |
|-------|-----|
| Webhook not receiving data | Check that Instantly/GHL has the correct Make.com URL with no trailing slash |
| Variables showing as `null` | Re-run the webhook with a real payload to re-map the data structure |
| Slack not posting | Re-authorize the Slack connection in Make.com → Connections |
| Google Calendar event not creating | Check that the calendar ID is correct and the OAuth scope includes write access |
| Scenario running but GHL not updating | Verify the GHL webhook URL is the correct trigger URL (from Automation → Workflow → Trigger → Webhook) |

---

## Environment Variables Summary

| Variable | Where to Set | Value |
|----------|-------------|-------|
| `MAKE_B2B_WEBHOOK_URL` | Vercel env vars | Scenario 3 webhook URL from Make.com |
| `GHL_B2B_WEBHOOK_URL` | Vercel env vars | GHL workflow trigger webhook URL |
| `INSTANTLY_WEBHOOK_SECRET` | Vercel env vars | Bearer token (optional) for direct Instantly → ShieldHome endpoint |

---

## Maintenance

- **Monthly:** Review Make.com error logs (Scenarios → History) for failed runs
- **If Instantly changes payload format:** Update Module 1 field mappings by clicking on the webhook module and re-running with a fresh payload
- **If GHL changes webhook URL:** Update `GHL_B2B_WEBHOOK_URL` in both Vercel and Make.com HTTP modules
