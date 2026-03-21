# Sending Domain Setup Checklist
## ShieldHome Pro — B2B Cold Email Infrastructure

---

## 1. Domain Purchase

### Why You Need Separate Domains
Never send cold email from your main domain (shieldhome.pro). If a sending domain gets flagged for spam, it only affects that domain — not your primary website or transactional email.

### Recommended Domains to Buy
Pick 3–4 that are available. Variations that work well:
- `getshieldhome.com`
- `shieldhomesecurity.com`
- `shieldhomepro.io`
- `shieldhomesolutions.com`
- `trysecureshield.com`
- `shieldhomequotes.com`

### Where to Buy
**Namecheap** (recommended) — cheapest .com pricing, clean DNS management UI
- Go to namecheap.com → search your domain → add to cart → checkout
- Cost: ~$10–13/year per .com domain
- Enable auto-renew and WhoisGuard (free privacy protection)

### How Many
- **1 domain per 2–3 sending accounts**
- Start with **3 domains = 6–9 sending accounts**
- Budget: ~$36/year for domains + ~$36/mo for Google Workspace accounts

---

## 2. Google Workspace Setup

### Create Workspace Account (per domain)
1. Go to workspace.google.com → Get Started
2. Enter your domain name (e.g., `getshieldhome.com`)
3. Choose **Business Starter** plan ($6/user/month)
4. Set up 2–3 user accounts per domain

### Naming Convention
Use real-sounding names:
```
mike.johnson@getshieldhome.com
sarah.chen@getshieldhome.com
david.martinez@shieldhomesecurity.com
lisa.thompson@shieldhomesecurity.com
```

### Account Limits
- **2–3 accounts per domain** (max)
- **25–30 emails/day per account** when fully warmed
- Total capacity with 3 domains × 2 accounts = ~150 emails/day

### Connect to Instantly
1. In Instantly → Settings → Email Accounts → Add Account
2. Choose **Google** and sign in with each Workspace account
3. Grant permissions (Instantly needs send/read access)
4. Repeat for every account

---

## 3. DNS Records

### SPF Record
Tells email servers that Google is authorized to send on behalf of your domain.

```
Type: TXT
Name: @
Value: v=spf1 include:_spf.google.com ~all
TTL: 3600
```

### DKIM Record
Proves emails haven't been tampered with. Generated per domain in Google Workspace.

**How to get your DKIM value:**
1. Go to admin.google.com → Apps → Google Workspace → Gmail → Authenticate Email
2. Click **Generate New Record**
3. Keep prefix as `google` and key length as `2048`
4. Click **Generate** — Google gives you a TXT record value
5. Add this record to your domain's DNS:

```
Type: TXT
Name: google._domainkey
Value: (paste the value Google generated)
TTL: 3600
```

6. Back in Google Admin, click **Start Authentication**

### DMARC Record
Tells receiving servers what to do with emails that fail SPF/DKIM checks.

```
Type: TXT
Name: _dmarc
Value: v=DMARC1; p=quarantine; rua=mailto:dmarc@yourdomain.com; pct=10
TTL: 3600
```

Start with `pct=10` (only enforce on 10% of emails). After 2–4 weeks with no issues, increase to `pct=100`.

### Custom Tracking Domain for Instantly
Instantly uses a tracking domain for open/click tracking. Without this, your emails use Instantly's shared domain which hurts deliverability.

1. In Instantly → Settings → Tracking Domain → Add Domain
2. Instantly gives you a CNAME value
3. Add to your DNS:

```
Type: CNAME
Name: track
Value: (provided by Instantly, typically something like track.instantly.ai)
TTL: 3600
```

4. Click **Verify** in Instantly
5. Repeat for each sending domain

### MX Records (for receiving replies)
Google Workspace MX records should be set automatically during setup. Verify these exist:

```
Type: MX  Priority: 1   Value: aspmx.l.google.com
Type: MX  Priority: 5   Value: alt1.aspmx.l.google.com
Type: MX  Priority: 5   Value: alt2.aspmx.l.google.com
Type: MX  Priority: 10  Value: alt3.aspmx.l.google.com
Type: MX  Priority: 10  Value: alt4.aspmx.l.google.com
```

---

## 4. Instantly Warmup Setup

### Enable Warmup
1. In Instantly → Email Accounts → click on the account
2. Toggle **Warmup** to ON
3. Configure warmup settings:
   - **Daily warmup limit:** Start at 20, increase to 40 over time
   - **Reply rate:** 30%
   - **Warmup tag:** Leave as default
   - **Read emulation:** Enable (simulates opening and reading warmup emails)

### Ramp Schedule

| Week | Emails/Day/Account | Activity |
|------|-------------------|----------|
| Week 1 | 5 warmup only | Warmup running, no real campaigns |
| Week 2 | 10 warmup only | Monitor warmup health score |
| Week 3 | 15 warmup only | Check deliverability in Instantly dashboard |
| Week 4 | 20 warmup only | Final warmup week — verify health score is 90+ |
| Week 5 | 15 real + 15 warmup | **Start first campaign** (dental). Keep warmup ON. |
| Week 6 | 20 real + 10 warmup | Add second campaign if reply rate is healthy |
| Week 7+ | 25–30 real + 10 warmup | Steady state. Never turn off warmup entirely. |

### Key Rules
- **Never turn off warmup** — keep it running alongside real campaigns at 10–15/day
- **Never exceed 30 real emails/day per account** — this is the ceiling for cold outreach
- **Never send on weekends** — schedule campaigns Mon–Fri, 8am–12pm recipient's timezone
- **Don't start real campaigns until warmup health score is 90+** in Instantly

---

## 5. Domain Health Monitoring

### Daily Check (30 seconds)
In Instantly → Email Accounts → check the **health score** badge next to each account. Green (90+) = good. Yellow (70–89) = slow down. Red (<70) = pause campaigns.

### Key Metrics to Watch

| Metric | Healthy | Warning | Action Needed |
|--------|---------|---------|---------------|
| Open rate | 50%+ | 35–50% | Below 35% — check subject lines or deliverability |
| Reply rate | 3%+ | 1–3% | Below 1% — review copy, targeting, or list quality |
| Bounce rate | <2% | 2–5% | Above 5% — **pause immediately**, clean your list |
| Spam complaints | 0% | 0.1% | Above 0.1% — pause and investigate |
| Warmup health | 90+ | 70–89 | Below 70 — reduce sending volume |

### When to Retire a Domain
- Warmup health drops below 60 and doesn't recover in 1 week
- Bounce rate consistently above 5%
- Emails going to spam (check with mail-tester.com — score should be 8+ out of 10)
- Domain age is < 30 days and health is dropping (some domains just don't work)

**Rotation strategy:** Always have 1 domain warming up as a backup. When you retire a domain, the backup is ready to go.

### Monitoring Tools
- **mail-tester.com** — send a test email to their address, get a spam score (free, 3/day)
- **MxToolbox.com** → Blacklist Check — verify your domain isn't on any blacklists
- **Google Postmaster Tools** — set up for each sending domain to monitor Gmail reputation

---

## 6. Inbox Management

### Out-of-Office Replies
Instantly auto-detects OOO replies and pauses the lead. When the OOO period ends, the sequence resumes. No action needed.

### Unsubscribe Requests
1. Instantly detects "unsubscribe" keywords and auto-marks the lead
2. The lead is removed from the active campaign automatically
3. Add their email to your **global blocklist** in Instantly → Settings → Blocklist
4. Also add to GHL suppression list via Make.com webhook

### "Wrong Person" Replies
1. Reply manually: "Apologies for the confusion! Could you point me to the right person for security decisions at [Company]? Thanks, [Name]"
2. If they give you a name → add the new contact to Clay → enrich → add to campaign
3. If they don't respond → mark as "Wrong Contact" in Instantly

### "Not Interested" Replies
1. Reply once (politely): "Totally understand, [Name]. If anything changes down the road, feel free to reach out. Have a great day."
2. Mark as "Not Interested" in Instantly
3. Make.com webhook pushes to GHL → adds `b2b-not-qualified` tag
4. Add to 90-day suppression list
5. **Never argue or send follow-ups** to not-interested replies

### Interested Reply SLA
**All interested replies must reach GHL within 15 minutes.**
This is handled automatically by Make.com Scenario 1 (Instantly Reply → GHL). Verify the scenario is running and not erroring.

If Make.com is down, the backup is the `/api/instantly-webhook` endpoint on your site which also pushes to GHL.

---

## Quick Reference: Setup Timeline

| Day | Task | Time |
|-----|------|------|
| Day 1 | Buy 3 domains on Namecheap | 15 min |
| Day 1 | Set up Google Workspace on each domain | 30 min |
| Day 1 | Add DNS records (SPF, DKIM, DMARC, tracking) | 45 min |
| Day 1 | Connect all accounts to Instantly + enable warmup | 20 min |
| Day 2 | Verify DNS propagation (MxToolbox) | 10 min |
| Day 2 | Verify DKIM authentication in Google Admin | 5 min |
| Week 2 | Check warmup health scores | 5 min |
| Week 4 | Verify health scores are 90+ → ready to launch | 5 min |
