# Lead Sourcing Standard Operating Procedure
## ShieldHome Pro — Weekly B2B Prospect List Building

---

## Apollo.io SOP — By Vertical

### General Settings for All Verticals
- **Employee count:** 5–200
- **Company HQ location:** United States
- **Contact status:** Verified emails only
- **Exclude:** Contacts already in your CRM (upload suppression list monthly)
- **Export limit:** 500 contacts per vertical per week to start

---

### Vertical 1: Dental & Medical Offices
**Apollo Filters:**
- Industry: Healthcare → Dental / Medical Practice / Chiropractic
- NAICS codes: 621210 (Dental), 621111 (Physician Offices), 621310 (Chiropractic)
- Employees: 5–100
- Job Titles: `Owner`, `Practice Manager`, `Office Manager`, `Managing Partner`, `DDS`, `DMD`, `Principal Dentist`
- Seniority: Owner, C-Suite, VP, Director, Manager

**Weekly target:** 200 contacts

---

### Vertical 2: Retail Stores
**Apollo Filters:**
- Industry: Retail → Clothing, Electronics, Sporting Goods, Home Goods, Specialty Retail
- NAICS codes: 448110–448190 (Clothing), 443142 (Electronics), 451110 (Sporting Goods), 453998 (General Retail)
- Employees: 5–150
- Job Titles: `Owner`, `Store Manager`, `General Manager`, `Regional Manager`, `Director of Operations`, `Loss Prevention Manager`
- Seniority: Owner, C-Suite, VP, Director

**Weekly target:** 200 contacts

---

### Vertical 3: Restaurants
**Apollo Filters:**
- Industry: Food & Beverage → Restaurants, Food Service
- NAICS codes: 722511 (Full-Service), 722513 (Limited-Service), 722514 (Cafeterias/Buffets)
- Employees: 5–100
- Job Titles: `Owner`, `General Manager`, `Franchise Owner`, `Managing Partner`, `Director of Operations`
- Seniority: Owner, C-Suite, VP, Director

**Weekly target:** 150 contacts

---

### Vertical 4: Property Management
**Apollo Filters:**
- Industry: Real Estate → Property Management, Real Estate Services
- NAICS codes: 531311 (Residential Property Managers), 531312 (Nonresidential), 531390 (Other Activities)
- Employees: 5–200
- Job Titles: `Owner`, `Property Manager`, `Director of Property Management`, `Portfolio Manager`, `VP of Operations`, `Asset Manager`
- Seniority: Owner, C-Suite, VP, Director

**Weekly target:** 150 contacts

---

### Vertical 5: Cannabis Dispensaries
**Apollo Filters:**
- Industry: Cannabis (search "cannabis" or "marijuana" in company keywords)
- Employees: 5–100
- Job Titles: `Owner`, `General Manager`, `Director of Operations`, `Compliance Manager`, `Security Director`
- **Important:** Filter by states where recreational/medical cannabis is legal
- Target states: CA, CO, OR, WA, IL, MI, MA, NV, AZ, NJ, NY, MD, MO

**Weekly target:** 100 contacts

---

### Vertical 6: General SMB
**Apollo Filters:**
- Industry: All industries EXCEPT the 5 above (to avoid duplicates)
- NAICS codes: Broad — 811 (Repair/Maintenance), 812 (Personal Services), 561 (Administrative), 623 (Nursing/Residential Care)
- Employees: 10–200
- Job Titles: `Owner`, `CEO`, `COO`, `General Manager`, `Office Manager`, `Facilities Manager`
- Seniority: Owner, C-Suite, VP

**Weekly target:** 200 contacts

---

### Apollo Export Settings
1. Select all filtered contacts → **Export**
2. File format: CSV
3. Include fields: First Name, Last Name, Email, Phone, Company Name, Title, Industry, City, State, Employee Count, LinkedIn URL, Website
4. File naming: `YYYY-MM-DD_vertical_apollo.csv` (e.g., `2026-03-20_dental_apollo.csv`)

---

## Google Maps / Outscraper SOP

### Why Outscraper
Apollo doesn't cover every local business. Outscraper scrapes Google Maps data — phone, address, website, reviews, rating — for businesses Apollo might miss.

### Setting Up an Outscraper Task
1. Go to outscraper.com → Google Maps Scraper
2. Enter search query (see below)
3. Set location (city, state or coordinates)
4. Set limit: 500 results per query
5. Enable enrichment: emails, phone numbers
6. Run task → download CSV

### Search Queries by Vertical (5 per vertical)

**Dental/Medical:**
```
"dental office" in Phoenix AZ
"dentist" in Austin TX
"medical practice" in Denver CO
"chiropractic clinic" in Nashville TN
"orthodontist" in Charlotte NC
```

**Retail:**
```
"retail store" in Phoenix AZ
"clothing store" in Dallas TX
"electronics store" in Atlanta GA
"jewelry store" in Miami FL
"sporting goods" in Seattle WA
```

**Restaurants:**
```
"restaurant" in Phoenix AZ
"restaurant owner" in Austin TX
"fine dining" in Denver CO
"fast casual restaurant" in Nashville TN
"restaurant group" in Charlotte NC
```

**Property Management:**
```
"property management company" in Phoenix AZ
"property manager" in Austin TX
"apartment management" in Denver CO
"HOA management" in Tampa FL
"commercial property management" in Dallas TX
```

**Cannabis:**
```
"dispensary" in Denver CO
"cannabis dispensary" in Los Angeles CA
"marijuana dispensary" in Portland OR
"recreational dispensary" in Seattle WA
"medical dispensary" in Phoenix AZ
```

**General SMB:**
```
"small business" in Phoenix AZ
"auto dealership" in Austin TX
"gym" in Denver CO
"daycare center" in Nashville TN
"warehouse" in Dallas TX
```

### Import Outscraper Data into Clay
1. Export from Outscraper as CSV
2. In Clay → Create New Table → Import CSV
3. Map columns: Name → firstName/lastName (may need splitting), Email, Phone, Company → companyName, City, State, Rating → googleRating, Reviews → reviewCount
4. Run deduplication against existing Clay tables before enrichment

---

## Weekly Cadence

### Recommended Volume

| Vertical | Leads/Week | Source Split |
|----------|-----------|-------------|
| Dental/Medical | 200 | 150 Apollo + 50 Outscraper |
| Retail | 200 | 150 Apollo + 50 Outscraper |
| Restaurants | 150 | 100 Apollo + 50 Outscraper |
| Property Management | 150 | 100 Apollo + 50 Outscraper |
| Cannabis | 100 | 50 Apollo + 50 Outscraper |
| General SMB | 200 | 150 Apollo + 50 Outscraper |
| **Total** | **~1,000/week** | |

### File Naming Convention
```
YYYY-MM-DD_vertical_source.csv
```
Examples:
- `2026-03-20_dental_apollo.csv`
- `2026-03-20_retail_outscraper.csv`

### Folder Structure
```
/lead-lists/
├── 2026-03/
│   ├── week-1/
│   │   ├── 2026-03-03_dental_apollo.csv
│   │   ├── 2026-03-03_dental_outscraper.csv
│   │   ├── 2026-03-03_retail_apollo.csv
│   │   └── ...
│   ├── week-2/
│   └── ...
├── 2026-04/
└── suppression/
    ├── master-suppression-list.csv
    └── not-interested-replies.csv
```

### Weekly Workflow (Monday morning)
1. **Pull Apollo lists** for 2–3 verticals (rotate weekly)
2. **Run Outscraper** tasks for the same verticals
3. **Import into Clay** — run enrichment + AI personalization
4. **Filter** out bad data (see Data Hygiene below)
5. **Push to Instantly** — each vertical goes to its matching campaign
6. **Update suppression list** with any new not-interested replies from last week

---

## Data Hygiene Rules

### Deduplication
1. Before importing into Clay, check for duplicates by email address against existing tables
2. In Clay: use the **Deduplicate** action → match on `email` column → keep the most recent entry
3. Cross-check against your GHL contact list monthly (export GHL contacts → import as suppression in Clay)

### 90-Day Suppression Window
**Rule:** Do not contact the same company twice within 90 days.

How to maintain:
1. After each campaign, export the contact list from Instantly (include email, company, date sent)
2. Add to your `master-suppression-list.csv` with the send date
3. Before each new import into Clay, filter against this list — exclude any company contacted in the last 90 days
4. In Instantly: Settings → Blocklist → upload suppression CSV quarterly

### Handling "Not Interested" Replies
1. Instantly auto-tags these in the campaign
2. Export not-interested contacts monthly
3. Add to `not-interested-replies.csv`
4. Upload to Instantly's global blocklist
5. Also add to GHL via Make.com → tag `b2b-not-qualified`
6. These contacts are permanently suppressed — do NOT re-contact

### Handling Bounced Emails
1. Instantly tracks bounces automatically
2. If bounce rate exceeds 3% on a batch, **stop the campaign** and review the list source
3. Export bounced emails → add to global blocklist
4. Consider switching email verification providers in Clay if bounce rate is consistently high

### Monthly List Cleaning
**First Monday of each month:**
1. Export all active Instantly campaigns → download contact lists
2. Cross-reference against GHL contacts (anyone already converted → remove from campaigns)
3. Remove any contacts that have been in a sequence for 30+ days with no reply
4. Update master suppression list
5. Verify global blocklist is up to date in Instantly
