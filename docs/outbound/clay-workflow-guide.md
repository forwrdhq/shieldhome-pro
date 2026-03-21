# Clay Enrichment Table Workflow Guide
## ShieldHome Pro — B2B Lead Enrichment Pipeline

---

## 1. Table Setup

### Create a New Table
1. Log into Clay → click **New Table**
2. Name it: `B2B Leads — [Vertical] — [Date]` (e.g., `B2B Leads — Dental — 2026-03`)
3. You'll use one table per vertical per month

### Column Structure

**Input Columns (from CSV import):**
| Column | Type | Source |
|--------|------|--------|
| firstName | Text | Apollo/Outscraper |
| lastName | Text | Apollo/Outscraper |
| email | Text | Apollo/Outscraper |
| phone | Text | Apollo/Outscraper |
| companyName | Text | Apollo/Outscraper |
| title | Text | Apollo |
| industry | Text | Apollo |
| city | Text | Apollo/Outscraper |
| state | Text | Apollo/Outscraper |
| linkedinUrl | Text | Apollo |
| website | Text | Apollo/Outscraper |
| employeeCount | Number | Apollo |

**Enrichment Columns (Clay adds these):**
| Column | Type | Source |
|--------|------|--------|
| emailVerified | Boolean | Hunter/Snov/Apollo waterfall |
| enrichedPhone | Text | Clay phone enrichment |
| enrichedLinkedin | Text | Clay LinkedIn finder |
| companyDomain | Text | Clay domain finder |
| estimatedRevenue | Text | Clay company enrichment |
| foundingYear | Number | Clay company enrichment |
| googleRating | Number | Outscraper or Clay Google enrichment |
| recentNews | Text | Clay news enrichment |
| aiPersonalizedLine | Text | Clay AI column |

**Output/Filter Columns:**
| Column | Type | Purpose |
|--------|------|---------|
| isValid | Boolean | Passes all filter rules |
| campaignName | Text | Which Instantly campaign to push to |

---

## 2. Import Sources

### Import from Apollo CSV
1. In Clay, open your table → click **Import** → **CSV Upload**
2. Select your Apollo export CSV file
3. Map the columns:
   - `First Name` → firstName
   - `Last Name` → lastName
   - `Email` → email
   - `Phone` → phone (Apollo's "Direct Phone" or "Mobile Phone")
   - `Company Name` → companyName
   - `Title` → title
   - `Industry` → industry
   - `City` → city
   - `State` → state
   - `Person Linkedin Url` → linkedinUrl
   - `Website` → website
   - `# Employees` → employeeCount
4. Click **Import** → rows are added to the table

### Import from Outscraper CSV
1. Same process: Import → CSV Upload
2. Outscraper column mapping:
   - `name` → companyName
   - `full_address` → parse into city/state
   - `phone` → phone
   - `site` → website
   - `rating` → googleRating
   - `reviews` → reviewCount
3. **Note:** Outscraper gives you the business, not the contact person. You'll need Clay's enrichment to find the decision maker (see step 3.7 below).

### Handle Duplicates
After import: click the **Deduplicate** action in Clay's toolbar → match on `email` column → keep the first occurrence. This prevents sending duplicate emails.

---

## 3. Waterfall Enrichment Columns

Set up each enrichment column in order. Each column runs automatically for every row.

### 3.1 Email Verification (Waterfall: Hunter → Snov → Apollo)

This verifies the email is real and deliverable before you send to it.

1. Click **+ Add Column** → **Enrichment** → search for **Hunter.io Email Verifier**
2. Configure: Input = `email` column
3. Output: `hunterStatus` (valid, invalid, risky, unknown)
4. Click **+ Add Column** → **Enrichment** → search for **Snov.io Email Verifier**
5. Configure: Input = `email` column
6. Output: `snovStatus`
7. Click **+ Add Column** → **Formula** → name it `emailVerified`
8. Formula logic:
```
IF(hunterStatus = "valid", true,
  IF(snovStatus = "valid", true, false))
```

This creates a waterfall — if Hunter says valid, great. If not, check Snov. Only keep emails that at least one service verifies.

### 3.2 Phone Number Enrichment
1. **+ Add Column** → **Enrichment** → **Clay Phone Finder**
2. Input: firstName + lastName + companyName
3. Output: `enrichedPhone`
4. This fills in phone numbers for contacts where Apollo didn't have one

### 3.3 LinkedIn Profile URL
1. **+ Add Column** → **Enrichment** → **Clay LinkedIn Finder**
2. Input: firstName + lastName + companyName
3. Output: `enrichedLinkedin`
4. Useful for LinkedIn outreach as a parallel channel

### 3.4 Company Domain & Website
1. **+ Add Column** → **Enrichment** → **Clay Company Domain Finder**
2. Input: companyName + city + state
3. Output: `companyDomain`
4. Helps verify the email domain matches the company

### 3.5 Employee Count
1. If not already from Apollo: **+ Add Column** → **Enrichment** → **Clay Company Enrichment**
2. Input: companyName or companyDomain
3. Output: `employeeCount`, `estimatedRevenue`

### 3.6 Estimated Annual Revenue
Comes from the same Clay Company Enrichment in 3.5. Map the revenue field.

### 3.7 Decision Maker Name & Title
For Outscraper imports (where you have the business but not the contact):
1. **+ Add Column** → **Enrichment** → **Clay Find People at Company**
2. Input: companyName + companyDomain
3. Filter by title: `Owner`, `Manager`, `Director`
4. Output: firstName, lastName, title, email
5. This fills in the actual person to contact

### 3.8 Company Founding Year
1. **+ Add Column** → **Enrichment** → **Clay Company Enrichment** (same as 3.5)
2. Map the `founded_year` field → `foundingYear`
3. If `foundingYear < 2016`, the business is 10+ years old — they likely have an outdated security system. Use this in personalization.

---

## 4. AI Personalization Column

This is the most important column. It generates a 2-sentence custom opening line for each lead that makes the cold email feel personal.

### Setup
1. **+ Add Column** → **AI** → **Generate Text with AI**
2. Name the column: `aiPersonalizedLine`
3. Paste this exact prompt:

```
You are writing the opening 2 sentences of a cold email to a business owner about commercial security systems. Your goal is to create a personalized, relevant opener that shows you know something about their business — NOT a generic pitch.

Inputs:
- Company: {{companyName}}
- Business type: {{industry}}
- City: {{city}}
- Employees: {{employeeCount}}
- Google rating: {{googleRating}} (if available)
- Recent news: {{recentNews}} (if available)

Rules:
1. Max 2 sentences. Keep it under 40 words total.
2. Reference something specific: their city, their business type, their size, their Google reviews, or recent news.
3. Sound like a human wrote it — casual, direct, no marketing speak.
4. Do NOT mention security, cameras, or monitoring yet — just build rapport.
5. Do NOT use exclamation marks.
6. Do NOT start with "I noticed" or "I came across" — these are overused.

Examples of good output:
- "Running a dental practice in Austin with a 4.8-star rating is no small feat. Wanted to reach out about something most practice owners overlook."
- "Managing 12 properties across Denver means you're juggling a lot of moving parts. Quick question about one of them."
- "Your restaurant on Yelp looks packed — congrats on the growth. There's something worth 2 minutes of your time."

Now write the personalized opener:
```

4. Map the input variables to your table columns using Clay's variable picker
5. Model: Select **Claude** or **GPT-4** (Claude preferred for natural tone)
6. Click **Save** — Clay runs this for every row

---

## 5. Filtering / Cleanup Column

### Create the Filter Column
1. **+ Add Column** → **Formula** → name it `isValid`
2. Formula logic (exclude any row where ANY of these are true):

```
AND(
  emailVerified = true,
  NOT(CONTAINS(email, "gmail.com")),
  NOT(CONTAINS(email, "yahoo.com")),
  NOT(CONTAINS(email, "hotmail.com")),
  NOT(CONTAINS(email, "outlook.com")),
  NOT(CONTAINS(email, "aol.com")),
  employeeCount >= 5,
  NOT(CONTAINS(LOWER(companyName), "security")),
  NOT(CONTAINS(LOWER(companyName), "alarm")),
  NOT(CONTAINS(LOWER(companyName), "protection services")),
  NOT(CONTAINS(LOWER(companyName), "adt")),
  NOT(CONTAINS(LOWER(companyName), "brinks")),
  NOT(CONTAINS(LOWER(companyName), "vivint")),
  LEN(firstName) > 0,
  LEN(companyName) > 0,
  LEN(email) > 0
)
```

3. This gives you a `true/false` for every row
4. Before pushing to Instantly, filter the table view to show only `isValid = true` rows

### Campaign Assignment Column
1. **+ Add Column** → **Formula** → name it `campaignName`
2. Logic:
```
IF(CONTAINS(LOWER(industry), "dental") OR CONTAINS(LOWER(industry), "medical") OR CONTAINS(LOWER(industry), "chiropractic"),
  "Dental & Medical — Physical Security Compliance",
IF(CONTAINS(LOWER(industry), "retail") OR CONTAINS(LOWER(industry), "clothing") OR CONTAINS(LOWER(industry), "store"),
  "Retail — AI Cameras & Shrinkage",
IF(CONTAINS(LOWER(industry), "restaurant") OR CONTAINS(LOWER(industry), "food"),
  "Restaurants — Remote Monitoring",
IF(CONTAINS(LOWER(industry), "property") OR CONTAINS(LOWER(industry), "real estate"),
  "Property Management — Multi-Location",
IF(CONTAINS(LOWER(industry), "cannabis") OR CONTAINS(LOWER(industry), "dispensary"),
  "Cannabis — State Compliance",
  "General SMB — Overpaying Angle")))))
```

---

## 6. Push to Instantly

### Connect Clay to Instantly
1. In Clay → Settings → Integrations → search **Instantly**
2. Connect with your Instantly API key (found in Instantly → Settings → API)
3. Authorize the connection

### Push Enriched Leads
1. Filter your table: `isValid = true`
2. Select all filtered rows
3. Click **Actions** → **Push to Instantly**
4. Configure the push:
   - **Campaign:** Select the matching campaign from the `campaignName` column (or push to a specific campaign manually)
   - **Map fields:**
     - `email` → Email
     - `firstName` → First Name
     - `lastName` → Last Name
     - `companyName` → Company Name
     - `city` → Custom Variable `{{city}}`
     - `aiPersonalizedLine` → Custom Variable `{{personalizedLine}}`
     - `googleRating` → Custom Variable `{{googleRating}}`
     - `employeeCount` → Custom Variable `{{employeeCount}}`
5. Click **Push** — leads are added to the Instantly campaign and will start receiving emails based on the campaign schedule

### Post-Push Checklist
- [ ] Verify leads appear in Instantly campaign
- [ ] Check that custom variables are populated (preview a few emails)
- [ ] Confirm campaign is active and schedule is set
- [ ] Mark the Clay table rows as "pushed" to avoid double-sending
