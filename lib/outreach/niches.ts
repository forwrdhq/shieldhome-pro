/**
 * Cold Outreach Niche Definitions
 *
 * 24 business categories ranked by composite score across:
 * theft risk, compliance pressure, deal size, DM accessibility, market size.
 *
 * Each niche includes a 3-step email sequence designed for maximum deliverability
 * and response rates using compliance-urgency and value-first approaches.
 */

export type NicheTier = 'A' | 'B' | 'C'

export interface EmailStep {
  subject: string
  body: string
  delayDays: number // days after previous step (0 for initial)
}

export interface NicheDefinition {
  slug: string
  name: string
  tier: NicheTier
  score: number
  decisionMaker: string
  avgDealRange: string
  complianceAngle: string
  /** States where this niche has legal/regulatory requirements. Null = all states. */
  legalStatesOnly: string[] | null
  /** 3-step email sequence: initial, follow-up 1, follow-up 2 */
  sequence: [EmailStep, EmailStep, EmailStep]
}

// Helper to build the CTA link — oid param ties the click back to the outreach prospect for conversion tracking
function ctaLink(label: string): string {
  return `${label}\n\nhttps://shieldhome.pro/business?oid={{lead_id}}`
}

// Physical address for CAN-SPAM compliance (must be a real postal address)
const PHYSICAL_ADDRESS = 'ShieldHome Pro | Vivint Smart Home Partner\n4931 N 300 W, Provo, UT 84604'
const UNSUB_LINE = `\n\n---\n${PHYSICAL_ADDRESS}\nNo longer interested? Reply "unsubscribe" or opt out here: https://shieldhome.pro/api/outreach/unsubscribe?email={{lead_email}}`

// Pricing + buyout value prop — injected into Email 2 of every sequence
// Tone: low-pressure, "why wouldn't I look into this?" framing
const PRICING_BLURB = `\n\nI should also mention something that surprises most business owners: our monitoring is $39.99/month. No commercial upcharge — it's the same rate we charge homeowners — backed by Vivint's newest commercial-grade equipment with 24/7 professional monitoring and remote access from your phone. If you're locked into a contract with your current provider, we cover up to $1,000 to buy you out of it. Most businesses we replace were paying $80–$150/month for older, less capable systems. There's genuinely not much downside to at least seeing what we'd put together for you.`

// Shorter pricing reminder for Email 3 graceful exits
const PRICING_REMINDER = `\n\nJust so you have the numbers: $39.99/month flat — no commercial markup — and we'll cover up to $1,000 to buy out your existing contract if you're currently locked in. If your provider is charging more than that (most are), a 10-minute conversation is probably worth it.`

// Brief pricing hook for Email 1 — gets the value prop in front of them immediately
const PRICING_HOOK = `\n\nQuick context on why this might be worth your time: our monitoring is $39.99/month — no commercial upcharge, same price we charge homeowners — backed by Vivint's newest commercial-grade equipment. If you're locked into a contract with your current provider, we cover up to $1,000 to buy you out. Most businesses we replace were paying $80–$150/month for older systems. There's not much downside to at least seeing what we'd put together for you.`

// ============================================
// TIER A — Highest Priority (Score >= 8.0)
// ============================================

const DISPENSARY: NicheDefinition = {
  slug: 'dispensary',
  name: 'Cannabis Dispensary',
  tier: 'A',
  score: 8.95,
  decisionMaker: 'Owner / Compliance Officer',
  avgDealRange: '$8k–$25k',
  complianceAngle: 'State licensing requires documented camera coverage with 90-day retention',
  legalStatesOnly: ['AK', 'AZ', 'CA', 'CO', 'CT', 'DE', 'IL', 'MA', 'MD', 'ME', 'MI', 'MN', 'MO', 'MT', 'NJ', 'NM', 'NV', 'NY', 'OH', 'OR', 'PA', 'RI', 'VA', 'VT', 'WA'],
  sequence: [
    {
      subject: '{{company_name}} — quick question about your camera compliance',
      delayDays: 0,
      body: `Hi {{first_name}},

I work with dispensary owners across {{state}} who need to stay ahead of their camera compliance requirements.

Quick question — does your current system cover every sales floor angle, vault entry, and back-of-house zone with the retention period your state board requires?

Most dispensaries I talk to have at least one blind spot they didn't know about until inspection day.

I put together a free compliance camera checklist specifically for {{state}} dispensaries. Happy to send it over if you'd like — no strings attached.${PRICING_HOOK}

${ctaLink('Or if you want, I can do a quick virtual walkthrough of your floor plan (takes about 10 minutes):')}${UNSUB_LINE}`,
    },
    {
      subject: 'Re: {{company_name}} camera compliance',
      delayDays: 3,
      body: `Hi {{first_name}},

Following up — I know compliance paperwork isn't anyone's favorite topic, but it beats the alternative.

One dispensary owner I worked with in {{state}} failed an inspection over a single camera blind spot in their trim room. 72-hour suspension while they scrambled to fix it. Lost about $45K in revenue.

The system we set up for them cost a fraction of what that closure did, and they haven't had a compliance issue since.

If that's something you'd want to avoid, I'm happy to do a no-pressure review of your current setup.
${PRICING_BLURB}

${ctaLink('You can grab a time here:')}${UNSUB_LINE}`,
    },
    {
      subject: '{{company_name}} — last note from me',
      delayDays: 5,
      body: `Hi {{first_name}},

I'll keep this short — I don't want to be that person who won't stop emailing.

If camera compliance is handled and you're feeling good about your current system, no worries at all. I'll step aside.

But if there's even a small question in the back of your mind about whether your setup would hold up during an inspection, that's exactly what I help with.
${PRICING_REMINDER}

Either way, here's the {{state}} dispensary compliance checklist I mentioned — yours to keep regardless:

${ctaLink('Grab it here:')}

Wishing you and {{company_name}} a great rest of the week.${UNSUB_LINE}`,
    },
  ],
}

const GROW_OPS: NicheDefinition = {
  slug: 'grow_ops',
  name: 'Marijuana Grow Operation',
  tier: 'A',
  score: 8.80,
  decisionMaker: 'Owner / Compliance Director',
  avgDealRange: '$15k–$80k',
  complianceAngle: 'Wall-to-wall camera coverage required for seed-to-sale tracking compliance',
  legalStatesOnly: ['AK', 'AZ', 'CA', 'CO', 'CT', 'IL', 'MA', 'MD', 'ME', 'MI', 'MN', 'MO', 'MT', 'NJ', 'NM', 'NV', 'NY', 'OH', 'OR', 'PA', 'RI', 'VA', 'VT', 'WA'],
  sequence: [
    {
      subject: '{{company_name}} — cultivation facility camera requirements',
      delayDays: 0,
      body: `Hi {{first_name}},

I specialize in helping licensed cultivators meet their state camera coverage requirements — the kind that hold up during regulatory audits.

Most grow facilities I visit have solid coverage in flowering rooms but gaps in processing areas, drying rooms, or loading docks. Those gaps are exactly where auditors look first.

Would it be helpful if I sent you a zone-by-zone camera placement guide for cultivation facilities in {{state}}? It maps to your state's specific retention and coverage requirements.${PRICING_HOOK}

${ctaLink('Or we can do a 10-minute virtual walkthrough of your facility layout:')}${UNSUB_LINE}`,
    },
    {
      subject: 'Re: {{company_name}} camera coverage',
      delayDays: 4,
      body: `Hi {{first_name}},

Quick follow-up — I recently helped a 15,000 sq ft cultivation facility in {{state}} upgrade from a patchwork DVR system to full IP cameras with cloud backup.

The result: they went from storing 30 days of footage (below their state minimum) to 90+ days with remote access. Their next audit took 15 minutes instead of 3 hours.

If your current system is giving you any headaches — storage running out, cameras going offline, footage quality too low for auditors — I can probably help.
${PRICING_BLURB}

${ctaLink('Happy to take a look at what you have now:')}${UNSUB_LINE}`,
    },
    {
      subject: '{{company_name}} — one last thought',
      delayDays: 5,
      body: `Hi {{first_name}},

Last note — I know you're running a complex operation and camera systems are just one piece of the puzzle.

If your coverage is solid and your retention meets {{state}} requirements, that's great. I'll leave you be.

But if you ever need a second opinion on your camera layout or want to compare what you're paying vs. what's available now, the offer stands.
${PRICING_REMINDER}

${ctaLink('Here\'s where to reach me:')}

Best of luck with the grow.${UNSUB_LINE}`,
    },
  ],
}

const GUN_SHOP: NicheDefinition = {
  slug: 'gun_shop',
  name: 'Gun Shop & Range',
  tier: 'A',
  score: 8.80,
  decisionMaker: 'Owner (FFL holder)',
  avgDealRange: '$8k–$35k',
  complianceAngle: 'ATF requires documented camera coverage of all firearm storage areas',
  legalStatesOnly: null,
  sequence: [
    {
      subject: '{{company_name}} — ATF camera documentation question',
      delayDays: 0,
      body: `Hi {{first_name}},

I work with FFL holders to make sure their camera systems meet ATF expectations — specifically around firearm storage, display cases, and transfer areas.

After a theft incident, the first thing ATF asks for is camera footage. If it's not there, or the quality isn't usable, that creates a very different conversation.

I put together a short ATF camera compliance checklist for FFL dealers. Want me to send it your way?${PRICING_HOOK}

${ctaLink('Or if you\'d rather, we can do a quick review of your current setup (takes about 10 minutes):')}${UNSUB_LINE}`,
    },
    {
      subject: 'Re: {{company_name}} — camera coverage',
      delayDays: 3,
      body: `Hi {{first_name}},

Following up — here's a situation I see often with FFL dealers:

Great cameras on the sales floor, but blind spots in the back room where inventory is stored, or at the rear entrance. Those are exactly the areas ATF wants covered.

One dealer I worked with had a break-in attempt at the back door. Because we'd covered that entry point with a deterrent camera (spotlight + siren + two-way audio), the attempt was stopped before entry. ATF was satisfied, insurance didn't spike, and his license was never in question.

That peace of mind is worth a lot in this business.
${PRICING_BLURB}

${ctaLink('If you want to see what a system like that looks like for your shop:')}${UNSUB_LINE}`,
    },
    {
      subject: '{{company_name}} — last note',
      delayDays: 5,
      body: `Hi {{first_name}},

I'll wrap up here — I know you're busy running {{company_name}}.

If your camera setup is solid and ATF-ready, you're in great shape. But if there's any part of your shop where you're not 100% confident the footage would hold up during an inspection, that's exactly the kind of thing I help with.
${PRICING_REMINDER}

The offer for a free review is open whenever you're ready.

${ctaLink('Here\'s where to reach me:')}

Stay safe out there.${UNSUB_LINE}`,
    },
  ],
}

const PAWN_SHOP: NicheDefinition = {
  slug: 'pawn_shop',
  name: 'Pawn Shop',
  tier: 'A',
  score: 8.20,
  decisionMaker: 'Owner',
  avgDealRange: '$4k–$12k',
  complianceAngle: 'City ordinances require 30-60 day retention and detective access within 24 hours',
  legalStatesOnly: null,
  sequence: [
    {
      subject: '{{company_name}} — pawn camera retention requirement',
      delayDays: 0,
      body: `Hi {{first_name}},

Quick question — does your current camera system meet the retention requirements for pawn dealers in {{state}}?

Most jurisdictions require 30–60 days of stored footage and the ability to provide it to law enforcement within 24 hours. A lot of the older DVR systems I see in pawn shops can't reliably do that.

I help pawn shop owners upgrade to compliant systems that also make it easier to work with detectives when they come looking for footage — which keeps your relationship with local PD smooth.${PRICING_HOOK}

${ctaLink('Want me to check what your city specifically requires? Takes 2 minutes:')}${UNSUB_LINE}`,
    },
    {
      subject: 'Re: {{company_name}} camera retention',
      delayDays: 3,
      body: `Hi {{first_name}},

Following up — one thing I see a lot with pawn shops is that the cameras are there, but the recorder is maxing out and overwriting footage before the retention period is up.

That's a compliance problem hiding in plain sight. Everything looks fine until a detective shows up asking for footage from 3 weeks ago and it's already been overwritten.

The fix is usually straightforward — modern systems with cloud backup ensure you never lose footage, and detectives can access clips remotely instead of coming into your shop.
${PRICING_BLURB}

${ctaLink('Happy to show you what that looks like for a shop your size:')}${UNSUB_LINE}`,
    },
    {
      subject: '{{company_name}} — wrapping up',
      delayDays: 5,
      body: `Hi {{first_name}},

Last message from me — if your cameras and retention are solid, that's great. One less thing to worry about.

But if you've ever had a detective ask for footage and felt even slightly unsure whether your system had it, that's exactly the gap I help close.
${PRICING_REMINDER}

${ctaLink('The offer for a free compliance check is always open:')}

Take care, {{first_name}}.${UNSUB_LINE}`,
    },
  ],
}

const JEWELRY_STORE: NicheDefinition = {
  slug: 'jewelry_store',
  name: 'Jewelry Store',
  tier: 'A',
  score: 8.00,
  decisionMaker: 'Owner',
  avgDealRange: '$8k–$30k',
  complianceAngle: 'Insurance carriers require UL-listed security systems; claims denied without footage',
  legalStatesOnly: null,
  sequence: [
    {
      subject: '{{company_name}} — does your insurance require a UL-listed system?',
      delayDays: 0,
      body: `Hi {{first_name}},

I work with jewelry store owners on one specific issue: making sure their security system meets what their insurance carrier actually requires.

Jewelers Mutual and most specialty carriers now require UL-listed alarm and camera systems. If your system doesn't meet that standard, you could face higher premiums — or worse, a denied claim after an incident.

When does your policy renew? I'd like to make sure you're covered before then.${PRICING_HOOK}

${ctaLink('Happy to do a quick check — takes about 10 minutes:')}${UNSUB_LINE}`,
    },
    {
      subject: 'Re: {{company_name}} insurance + security',
      delayDays: 3,
      body: `Hi {{first_name}},

Quick follow-up — after the wave of smash-and-grab incidents across the country, insurance adjusters are asking for camera footage first and asking questions second.

One jeweler I worked with had a break-in, filed a claim for $180K in stolen inventory, and nearly had it denied because his camera system wasn't on his carrier's approved list. We got him set up properly before his renewal, and the next year his premium actually dropped 15%.

That's the ROI story: better security = lower premiums + protected claims.
${PRICING_BLURB}

${ctaLink('If you want to see what an insurance-compliant system looks like for your store:')}${UNSUB_LINE}`,
    },
    {
      subject: '{{company_name}} — final note',
      delayDays: 5,
      body: `Hi {{first_name}},

I'll leave you with this: the worst time to find out your security system doesn't meet your insurance requirements is after something happens.

If you're confident your system is UL-listed and your carrier is happy with it, you're in great shape. But if there's any uncertainty, a 10-minute review could save you a world of trouble later.
${PRICING_REMINDER}

${ctaLink('Open invitation to check:')}

Wishing {{company_name}} all the best.${UNSUB_LINE}`,
    },
  ],
}

// ============================================
// TIER B — High Volume + Strong Deal Size (Score 7.0–7.9)
// ============================================

const PHARMACY: NicheDefinition = {
  slug: 'pharmacy',
  name: 'Independent Pharmacy',
  tier: 'B',
  score: 7.90,
  decisionMaker: 'Pharmacist-Owner',
  avgDealRange: '$5k–$15k',
  complianceAngle: 'DEA controlled substance storage requires documented camera coverage',
  legalStatesOnly: null,
  sequence: [
    {
      subject: '{{company_name}} — DEA camera documentation for controlled substances',
      delayDays: 0,
      body: `Hi {{first_name}},

Independent pharmacies are one of DEA's top audit targets for controlled substance handling — and one of the first things they check is camera coverage of your safe, dispensing area, and rear access.

I help pharmacist-owners make sure their camera systems document exactly what DEA wants to see, so that an audit is a formality rather than a fire drill.

Would it be helpful if I sent you a quick DEA camera compliance checklist for independent pharmacies?${PRICING_HOOK}

${ctaLink('Or we can do a brief virtual walkthrough of your pharmacy layout:')}${UNSUB_LINE}`,
    },
    {
      subject: 'Re: {{company_name}} — pharmacy security',
      delayDays: 3,
      body: `Hi {{first_name}},

Following up — beyond DEA compliance, the other reason pharmacy owners reach out to me is break-ins targeting controlled substances.

Pharmacies are one of the most targeted business types for after-hours break-ins. Modern deterrent cameras (with spotlights, sirens, and live monitoring) can stop attempts before entry — which is a very different outcome than reviewing footage after the fact.

One pharmacy owner I work with in {{state}} said the system paid for itself in the first year just through the insurance premium reduction.
${PRICING_BLURB}

${ctaLink('Worth a 10-minute conversation?')}${UNSUB_LINE}`,
    },
    {
      subject: '{{company_name}} — last thought',
      delayDays: 5,
      body: `Hi {{first_name}},

Final note — if your pharmacy security is dialed in and DEA-ready, excellent. That puts you ahead of most independents I talk to.

If not, the offer for a free compliance review stands whenever you're ready.
${PRICING_REMINDER}

${ctaLink('Here\'s where to reach me:')}

Take care.${UNSUB_LINE}`,
    },
  ],
}

const MEDICAL_OFFICE: NicheDefinition = {
  slug: 'medical_office',
  name: 'Medical / Dental Office',
  tier: 'B',
  score: 7.70,
  decisionMaker: 'Practice Owner',
  avgDealRange: '$4k–$15k',
  complianceAngle: 'After-hours break-ins for controlled substances trigger HIPAA reporting',
  legalStatesOnly: null,
  sequence: [
    {
      subject: '{{company_name}} — after-hours security for your practice',
      delayDays: 0,
      body: `Hi {{first_name}},

After-hours break-ins at medical and dental practices have increased significantly — mostly targeting controlled substances and expensive equipment.

Beyond the theft itself, a break-in can trigger HIPAA breach reporting requirements if patient records are accessed or compromised. That's a regulatory headache on top of a security one.

I help practice owners set up deterrent systems that stop break-in attempts before entry — the camera sees the person, activates spotlights and a siren, and alerts monitoring. Most attempts end right there.${PRICING_HOOK}

${ctaLink('Would a 10-minute virtual walkthrough of your practice layout be helpful?')}${UNSUB_LINE}`,
    },
    {
      subject: 'Re: {{company_name}} practice security',
      delayDays: 4,
      body: `Hi {{first_name}},

Following up — I recently helped a dental practice in {{state}} that had two break-in attempts in six months. Both times, the old alarm went off but no one responded until police arrived 20+ minutes later. Significant damage both times.

After we installed a smart deterrent system, a third attempt happened. This time: motion detected, spotlights activated, siren sounded, and a live monitoring agent verbally warned the intruder through the camera speaker. He ran. Zero damage, zero breach, zero HIPAA paperwork.

That's the difference between a system that records and one that prevents.
${PRICING_BLURB}

${ctaLink('If that\'s interesting, I can show you what it looks like for your practice:')}${UNSUB_LINE}`,
    },
    {
      subject: '{{company_name}} — wrapping up',
      delayDays: 5,
      body: `Hi {{first_name}},

Last note from me — if your practice's after-hours security is solid, that's one less thing to worry about.

If it's something you've been meaning to look into, I'm here whenever you're ready. No pressure, no sales pitch — just a straightforward review of your current setup and what, if anything, could be improved.
${PRICING_REMINDER}

${ctaLink('Open invitation:')}

Wishing your practice all the best.${UNSUB_LINE}`,
    },
  ],
}

const LIQUOR_STORE: NicheDefinition = {
  slug: 'liquor_store',
  name: 'Liquor Store',
  tier: 'B',
  score: 7.70,
  decisionMaker: 'Owner',
  avgDealRange: '$3.5k–$10k',
  complianceAngle: 'ABC license requires operational camera systems; license defense depends on footage',
  legalStatesOnly: null,
  sequence: [
    {
      subject: '{{company_name}} — ABC camera requirements for your license',
      delayDays: 0,
      body: `Hi {{first_name}},

Quick question — does your current camera system meet the requirements tied to your ABC license in {{state}}?

Most state liquor boards require operational cameras covering the sales floor, register area, and all entry/exit points. During a license renewal or incident review, they'll ask for footage — and if it's not there or not usable, it creates a problem.

I help liquor store owners make sure their cameras aren't just installed, but actually compliant and reliable when it matters.${PRICING_HOOK}

${ctaLink('Want me to pull up the specific requirements for your area? Takes 2 minutes:')}${UNSUB_LINE}`,
    },
    {
      subject: 'Re: {{company_name}} — camera setup',
      delayDays: 3,
      body: `Hi {{first_name}},

Following up — one issue I see repeatedly with liquor stores: the cameras are old, the footage is grainy, and the DVR is overwriting every 7–10 days.

That might have been fine 5 years ago, but regulators and insurance companies have raised the bar. They want HD footage with 30+ days of retention. If you're still on an analog system, you're probably not meeting that standard.

The good news: upgrading is more affordable than most owners expect, and the insurance savings often offset the cost within the first year.
${PRICING_BLURB}

${ctaLink('Happy to show you the numbers for a store your size:')}${UNSUB_LINE}`,
    },
    {
      subject: '{{company_name}} — final note',
      delayDays: 5,
      body: `Hi {{first_name}},

Last message — if your cameras are solid and your ABC compliance is handled, you're in good shape. No need to fix what isn't broken.

But if there's any doubt, a quick review now is much better than discovering a gap during a license renewal or after an incident.
${PRICING_REMINDER}

${ctaLink('The offer stands:')}

All the best to {{company_name}}.${UNSUB_LINE}`,
    },
  ],
}

const AUTO_DEALER: NicheDefinition = {
  slug: 'auto_dealer',
  name: 'Auto Dealership',
  tier: 'B',
  score: 7.50,
  decisionMaker: 'GM / Owner',
  avgDealRange: '$10k–$40k',
  complianceAngle: 'Floor plan lenders increasingly require documented lot security',
  legalStatesOnly: null,
  sequence: [
    {
      subject: '{{company_name}} — does your floor plan lender require lot cameras?',
      delayDays: 0,
      body: `Hi {{first_name}},

I've been working with auto dealers across {{state}}, and I'm seeing a trend: floor plan lenders (NextGear, AFC, Chase) are increasingly requiring documented camera coverage of the entire lot as a financing condition.

With stolen vehicles averaging $25K+ per loss, it makes sense from their perspective. But it means dealers who don't have compliant systems are getting flagged at renewal.

Does your lender currently require documented lot security? If so, I can help make sure your setup meets their specific requirements.${PRICING_HOOK}

${ctaLink('Happy to do a quick lot assessment:')}${UNSUB_LINE}`,
    },
    {
      subject: 'Re: {{company_name}} lot security',
      delayDays: 4,
      body: `Hi {{first_name}},

Following up — beyond the lender requirements, here's the other reason dealers reach out:

Catalytic converter theft, wheel theft, and vandalism on the lot. One dealer I work with was losing $15K+/month to cat thefts alone before we installed deterrent cameras with live monitoring.

Since installation: zero thefts. The cameras detect motion after hours, activate spotlights, and a live agent warns the person through the speaker. Thieves move on.

The system paid for itself in the first month.
${PRICING_BLURB}

${ctaLink('Want to see what coverage would look like for your lot size?')}${UNSUB_LINE}`,
    },
    {
      subject: '{{company_name}} — last note',
      delayDays: 5,
      body: `Hi {{first_name}},

I'll keep this brief — if your lot security is handled and your lender is satisfied, great.

If not, the offer for a free lot assessment stands. No pressure, just a straightforward review of your coverage and any gaps.
${PRICING_REMINDER}

${ctaLink('Here\'s where to reach me:')}

Wishing {{company_name}} a great month on the lot.${UNSUB_LINE}`,
    },
  ],
}

const PROPERTY_MGMT: NicheDefinition = {
  slug: 'property_mgmt',
  name: 'Property Management / Apartments',
  tier: 'B',
  score: 7.50,
  decisionMaker: 'Property Manager',
  avgDealRange: '$20k–$200k',
  complianceAngle: 'Security cameras increase rent premiums and reduce liability claims',
  legalStatesOnly: null,
  sequence: [
    {
      subject: '{{company_name}} — security as a leasing advantage',
      delayDays: 0,
      body: `Hi {{first_name}},

I work with property managers who are using smart security systems as a competitive leasing advantage — not just a cost center.

The data is compelling: properties with visible, modern security systems see higher lease-up rates, fewer package theft complaints (the #1 resident service ticket), and measurably higher renewal rates.

Some of our property management clients have even been able to justify $50–100/month rent premiums on units with smart security features.

Would it be worth a conversation about how security could help {{company_name}}'s portfolio?${PRICING_HOOK}

${ctaLink('Happy to do a property assessment:')}${UNSUB_LINE}`,
    },
    {
      subject: 'Re: {{company_name}} — property security ROI',
      delayDays: 4,
      body: `Hi {{first_name}},

Following up with a quick ROI case study:

A 200-unit apartment community we work with added smart cameras at entries, parking, package areas, and common spaces. Within 6 months:
- Package theft complaints dropped 90%
- Resident satisfaction scores went up 22%
- Lease renewals increased 8%
- They justified a $75/month "smart home" premium on new leases

That's $180K/year in additional revenue from a system that cost a fraction of that.

If you manage multiple properties, the numbers scale even further.
${PRICING_BLURB}

${ctaLink('Want me to run the ROI math for your portfolio?')}${UNSUB_LINE}`,
    },
    {
      subject: '{{company_name}} — wrapping up',
      delayDays: 5,
      body: `Hi {{first_name}},

Last note — I understand property managers juggle a hundred priorities. Security might not be top of mind until there's an incident.

But the property managers who get ahead of it — who use security as a leasing tool rather than a reactive expense — tend to see real bottom-line impact.

If that's interesting, I'm here whenever it makes sense to talk.
${PRICING_REMINDER}

${ctaLink('Open invitation:')}

Best regards.${UNSUB_LINE}`,
    },
  ],
}

const CONVENIENCE_STORE: NicheDefinition = {
  slug: 'convenience_store',
  name: 'Convenience Store / Gas Station',
  tier: 'B',
  score: 7.60,
  decisionMaker: 'Owner',
  avgDealRange: '$3k–$10k',
  complianceAngle: 'Insurance carriers require camera systems; high-theft environment',
  legalStatesOnly: null,
  sequence: [
    {
      subject: '{{company_name}} — when was the last time you checked your camera footage?',
      delayDays: 0,
      body: `Hi {{first_name}},

Simple question: if something happened at {{company_name}} tonight, would your cameras capture it clearly enough for police to actually use the footage?

A lot of convenience store owners I talk to have cameras — but the footage is grainy, the angles miss key areas, or the recorder is full and overwriting. When police ask for footage, it's either unusable or gone.

Modern systems fix all of that: HD footage, 30+ days of cloud storage, and remote access from your phone so you can check in from anywhere.${PRICING_HOOK}

${ctaLink('Want me to take a look at what you have now? Takes about 10 minutes:')}${UNSUB_LINE}`,
    },
    {
      subject: 'Re: {{company_name}} cameras',
      delayDays: 3,
      body: `Hi {{first_name}},

Following up — here's the thing about convenience store security that most owners don't think about until it's too late:

Your insurance carrier likely requires working cameras. If you file a claim and the footage isn't there, you could face a denied claim or higher premiums. I've seen it happen.

One store owner I work with switched to a modern system and his insurance premium dropped enough to cover the monthly cost of the new cameras. Net zero out of pocket, but dramatically better protection.
${PRICING_BLURB}

${ctaLink('Worth exploring for {{company_name}}?')}${UNSUB_LINE}`,
    },
    {
      subject: '{{company_name}} — final thought',
      delayDays: 5,
      body: `Hi {{first_name}},

Last note — if your cameras are solid and your insurance is satisfied, you're ahead of most convenience store owners I talk to.

If not, a quick review could save you real money on premiums and real headaches if something happens.
${PRICING_REMINDER}

${ctaLink('The offer is always open:')}

Take care, {{first_name}}.${UNSUB_LINE}`,
    },
  ],
}

const BAR_NIGHTCLUB: NicheDefinition = {
  slug: 'bar_nightclub',
  name: 'Bar & Nightclub',
  tier: 'B',
  score: 7.45,
  decisionMaker: 'Owner',
  avgDealRange: '$4k–$12k',
  complianceAngle: 'Assault liability claims average $250K+; liquor boards can pull license without footage',
  legalStatesOnly: null,
  sequence: [
    {
      subject: '{{company_name}} — one assault claim without footage = license risk',
      delayDays: 0,
      body: `Hi {{first_name}},

Here's something bar owners don't think about until it happens: one assault or injury claim without camera footage, and your liquor license is at risk.

Plaintiff attorneys request surveillance footage in every personal injury case. If you can't produce it, the assumption goes against you. And state liquor boards can use the lack of documented security as grounds to deny your license renewal.

I help bar and nightclub owners set up camera systems that protect their license and their liability — not just record what happened, but actively deter incidents.${PRICING_HOOK}

${ctaLink('When does your liquor license renew? I\'d like to make sure you\'re covered before then:')}${UNSUB_LINE}`,
    },
    {
      subject: 'Re: {{company_name}} — liability protection',
      delayDays: 3,
      body: `Hi {{first_name}},

Following up — a bar owner in {{state}} I worked with was hit with a $350K assault claim. A patron was injured in the parking lot and sued the bar for inadequate security.

Because he had full camera coverage (including the lot), with timestamped HD footage and audio, his attorney was able to show exactly what happened. The case was dismissed.

Without that footage, his insurance company told him they would have settled for $250K+ — and his premiums would have doubled.

The camera system cost less than one month of the premium increase would have been.
${PRICING_BLURB}

${ctaLink('If protecting {{company_name}} from that kind of scenario is important to you:')}${UNSUB_LINE}`,
    },
    {
      subject: '{{company_name}} — wrapping up',
      delayDays: 5,
      body: `Hi {{first_name}},

Last message — bars and nightclubs operate in a high-liability environment. The right camera system isn't a luxury, it's litigation armor.

If you're covered, great. If there's any gap, especially in parking areas, back exits, or the area around the bar itself, that's worth addressing before something happens.
${PRICING_REMINDER}

${ctaLink('The offer for a free review stands:')}

Cheers.${UNSUB_LINE}`,
    },
  ],
}

const WAREHOUSE: NicheDefinition = {
  slug: 'warehouse',
  name: 'Warehouse & Distribution Center',
  tier: 'B',
  score: 7.40,
  decisionMaker: 'Facilities Manager',
  avgDealRange: '$15k–$100k',
  complianceAngle: 'Cargo insurance carriers adding camera system requirements at renewal',
  legalStatesOnly: null,
  sequence: [
    {
      subject: '{{company_name}} — cargo insurance camera requirements',
      delayDays: 0,
      body: `Hi {{first_name}},

I'm reaching out because cargo insurance underwriters are increasingly adding camera system requirements to commercial policies at renewal.

If your warehouse doesn't have documented perimeter coverage, loading dock cameras, and interior monitoring, you could face higher premiums or coverage restrictions at your next renewal.

I work with warehouse and distribution center operators to get ahead of these requirements — ensuring your security setup meets what underwriters want to see.${PRICING_HOOK}

${ctaLink('What\'s the square footage of your facility? I can give you a rough camera count and budget range:')}${UNSUB_LINE}`,
    },
    {
      subject: 'Re: {{company_name}} — warehouse security',
      delayDays: 4,
      body: `Hi {{first_name}},

Following up — beyond insurance requirements, the biggest operational benefit I see warehouse operators get from modern camera systems is shrinkage reduction.

Employee theft, mis-shipments, and receiving discrepancies are all dramatically reduced when you have full camera coverage with cloud playback. One 50,000 sq ft distribution center I work with reduced inventory shrinkage by 40% in the first quarter after installation.

That's a real, measurable ROI that goes straight to the bottom line.
${PRICING_BLURB}

${ctaLink('Worth a conversation about your facility?')}${UNSUB_LINE}`,
    },
    {
      subject: '{{company_name}} — final note',
      delayDays: 5,
      body: `Hi {{first_name}},

Last note — if your warehouse security is solid and your insurance carrier is satisfied, you're in good shape.

If there are gaps — especially at loading docks, perimeter access points, or high-value storage areas — addressing them now is a lot better than addressing them after an incident or at insurance renewal.
${PRICING_REMINDER}

${ctaLink('Open invitation for a free facility assessment:')}

Best regards.${UNSUB_LINE}`,
    },
  ],
}

const SELF_STORAGE: NicheDefinition = {
  slug: 'self_storage',
  name: 'Self-Storage Facility',
  tier: 'B',
  score: 7.05,
  decisionMaker: 'Owner / Property Manager',
  avgDealRange: '$8k–$30k',
  complianceAngle: 'Tenant break-in lawsuits require documented reasonable security measures',
  legalStatesOnly: null,
  sequence: [
    {
      subject: '{{company_name}} — tenant break-in liability protection',
      delayDays: 0,
      body: `Hi {{first_name}},

When a storage unit gets broken into, the tenant sues the facility first. Your defense in that lawsuit depends on demonstrating you had reasonable security measures in place and documented.

Cameras at every entry/exit point, gate access logs, and perimeter monitoring are what courts consider "reasonable." If you don't have those documented, you're exposed.

I help storage facility operators set up security systems that protect against both break-ins and the lawsuits that follow.${PRICING_HOOK}

${ctaLink('How many entry/exit points does your facility have? I can spec a system in 10 minutes:')}${UNSUB_LINE}`,
    },
    {
      subject: 'Re: {{company_name}} — storage security',
      delayDays: 4,
      body: `Hi {{first_name}},

Following up — beyond lawsuit protection, here's the business case for upgrading your security:

Facilities with visible, modern camera systems attract more tenants. It's often the first thing potential tenants ask about during a tour. Properties with documented smart security can command higher unit rates and see better occupancy.

One facility operator I work with added smart cameras and electronic gate access across 3 locations. Occupancy increased 6% within a quarter, and they haven't had a successful break-in claim since.
${PRICING_BLURB}

${ctaLink('Want to see what that would look like for your facility?')}${UNSUB_LINE}`,
    },
    {
      subject: '{{company_name}} — last thought',
      delayDays: 5,
      body: `Hi {{first_name}},

Last message — if your facility security is solid and you're confident it would hold up in a liability claim, that's great.

If there's any uncertainty about your coverage at entry points, hallways, or the perimeter, that's worth addressing before you need it.
${PRICING_REMINDER}

${ctaLink('The offer stands:')}

All the best.${UNSUB_LINE}`,
    },
  ],
}

const CONSTRUCTION: NicheDefinition = {
  slug: 'construction',
  name: 'Construction Company',
  tier: 'B',
  score: 7.05,
  decisionMaker: 'Owner / Project Manager',
  avgDealRange: '$5k–$25k',
  complianceAngle: 'Equipment theft costs contractors $1B+ annually; insurance requires documented security',
  legalStatesOnly: null,
  sequence: [
    {
      subject: '{{company_name}} — job site equipment theft protection',
      delayDays: 0,
      body: `Hi {{first_name}},

Equipment theft from construction job sites costs US contractors over $1 billion annually. And here's the part that hurts most: insurance carriers are now requiring documented security measures before they'll pay theft claims.

No cameras, no documentation, no payout. That's the trend.

I work with construction companies to deploy portable, solar-powered camera systems that move with the job site. Set up in minutes, work on cellular, and provide live deterrent capability.${PRICING_HOOK}

${ctaLink('Do you have any active sites where theft has been a concern?')}${UNSUB_LINE}`,
    },
    {
      subject: 'Re: {{company_name}} — job site cameras',
      delayDays: 4,
      body: `Hi {{first_name}},

Following up — the key difference with construction site security vs. a building is portability. You need cameras that:

1. Run on solar (no power hookup needed)
2. Connect via cellular (no WiFi on site)
3. Set up in under 30 minutes
4. Move to the next job when this one wraps

That's exactly what we provide. One GC I work with deploys our cameras on every job over $500K. His equipment theft went from 3–4 incidents per year to zero. His insurance carrier gave him a rate reduction as a result.
${PRICING_BLURB}

${ctaLink('Worth a quick conversation about your active sites?')}${UNSUB_LINE}`,
    },
    {
      subject: '{{company_name}} — last note',
      delayDays: 5,
      body: `Hi {{first_name}},

Wrapping up — if equipment theft isn't a problem you're dealing with, that's great. But if it is (or if your insurance is asking about site security), I can help.

Portable, solar-powered cameras that move with your jobs. Simple as that.
${PRICING_REMINDER}

${ctaLink('Here\'s where to reach me:')}

Stay safe on site.${UNSUB_LINE}`,
    },
  ],
}

const VET_CLINIC: NicheDefinition = {
  slug: 'vet_clinic',
  name: 'Veterinary Clinic',
  tier: 'B',
  score: 7.00,
  decisionMaker: 'Practice Owner',
  avgDealRange: '$3.5k–$10k',
  complianceAngle: 'Controlled substance storage + after-hours animal monitoring',
  legalStatesOnly: null,
  sequence: [
    {
      subject: '{{company_name}} — after-hours monitoring for your clinic',
      delayDays: 0,
      body: `Hi {{first_name}},

Two things keep vet clinic owners up at night: controlled substance storage and overnight patients.

Modern camera systems solve both — they document your drug storage area for DEA compliance and let you check on overnight boarders and post-surgery patients from your phone.

I work with veterinary practice owners to set up systems that handle both the compliance and the peace-of-mind side.${PRICING_HOOK}

${ctaLink('Would a quick look at your clinic layout be helpful?')}${UNSUB_LINE}`,
    },
    {
      subject: 'Re: {{company_name}} clinic security',
      delayDays: 4,
      body: `Hi {{first_name}},

Following up — one vet clinic owner I work with had a simple but powerful realization: she was driving to the clinic at 11 PM every time she had an overnight surgical patient, just to check on them.

After we set up interior cameras, she can check from her couch. She sees the recovery area, the kennel room, and the front entrance — all from her phone. No more late-night drives.

That alone was worth the cost of the system, before you even factor in the security benefits.
${PRICING_BLURB}

${ctaLink('If that sounds appealing for your practice:')}${UNSUB_LINE}`,
    },
    {
      subject: '{{company_name}} — wrapping up',
      delayDays: 5,
      body: `Hi {{first_name}},

Last note — between DEA compliance, after-hours patient monitoring, and general practice security, a good camera system checks a lot of boxes for veterinary clinics.

If you'd ever like to explore what that looks like for {{company_name}}, I'm here.
${PRICING_REMINDER}

${ctaLink('Open invitation:')}

Take care.${UNSUB_LINE}`,
    },
  ],
}

// ============================================
// TIER B continued — remaining niches (shorter definitions)
// ============================================

const BANK: NicheDefinition = {
  slug: 'bank',
  name: 'Bank & Credit Union',
  tier: 'B',
  score: 7.70,
  decisionMaker: 'Security Director',
  avgDealRange: '$8k–$40k',
  complianceAngle: 'Federal banking regulations require comprehensive surveillance',
  legalStatesOnly: null,
  sequence: [
    { subject: '{{company_name}} — branch surveillance upgrade question', delayDays: 0, body: `Hi {{first_name}},\n\nI work with banks and credit unions on surveillance system upgrades that meet current federal requirements while dramatically improving footage quality and remote access capabilities.\n\nMany branches I visit are still running 10+ year old systems with SD-quality footage. When an incident occurs, the footage is often too poor for law enforcement to use effectively.\n\nWould it be worth a brief conversation about {{company_name}}'s current branch surveillance infrastructure?${PRICING_HOOK}\n\n${ctaLink('Happy to do a complimentary assessment:')}${UNSUB_LINE}` },
    { subject: 'Re: {{company_name}} branch surveillance', delayDays: 4, body: `Hi {{first_name}},\n\nFollowing up — one credit union I work with upgraded 12 branches from analog DVR to HD IP cameras with cloud backup. The result: 4K footage that law enforcement can actually use, remote access for the security team, and a 30% reduction in their insurance premium across all branches.\n\nThe ROI was clear within the first year.\n${PRICING_BLURB}\n\n${ctaLink('If {{company_name}} is considering an upgrade:')}${UNSUB_LINE}` },
    { subject: '{{company_name}} — last note', delayDays: 5, body: `Hi {{first_name}},\n\nFinal message — if your branch surveillance is current and meeting all requirements, that's great. If there's room for improvement, the offer for a complimentary assessment stands.\n${PRICING_REMINDER}\n\n${ctaLink('Here\'s where to reach me:')}${UNSUB_LINE}` },
  ],
}

const TRUCKING: NicheDefinition = {
  slug: 'trucking',
  name: 'Trucking & Freight Terminal',
  tier: 'B',
  score: 7.20,
  decisionMaker: 'Terminal Manager',
  avgDealRange: '$10k–$60k',
  complianceAngle: 'Cargo theft liability + insurance requirements for terminal security',
  legalStatesOnly: null,
  sequence: [
    { subject: '{{company_name}} — terminal cargo security requirements', delayDays: 0, body: `Hi {{first_name}},\n\nCargo theft at freight terminals is a growing insurance concern. Underwriters are increasingly requiring documented perimeter camera coverage as a condition of cargo insurance.\n\nI work with terminal operators to install comprehensive surveillance that satisfies insurance requirements and deters theft at loading docks, yard areas, and perimeter access points.${PRICING_HOOK}\n\n${ctaLink('What\'s the size of your terminal operation? I can provide a quick assessment:')}${UNSUB_LINE}` },
    { subject: 'Re: {{company_name}} terminal security', delayDays: 4, body: `Hi {{first_name}},\n\nFollowing up — one freight terminal I work with reduced cargo theft claims by 85% after installing deterrent cameras with live monitoring at all dock doors and yard access points. Their insurance carrier reduced their cargo premium at the next renewal.\n${PRICING_BLURB}\n\n${ctaLink('Worth exploring for {{company_name}}?')}${UNSUB_LINE}` },
    { subject: '{{company_name}} — final note', delayDays: 5, body: `Hi {{first_name}},\n\nLast message — if your terminal security is solid, great. If your insurance carrier has been asking about it, I can help.\n${PRICING_REMINDER}\n\n${ctaLink('Open invitation:')}${UNSUB_LINE}` },
  ],
}

const MANUFACTURING: NicheDefinition = {
  slug: 'manufacturing',
  name: 'Manufacturing Facility',
  tier: 'B',
  score: 7.15,
  decisionMaker: 'Facilities Director',
  avgDealRange: '$20k–$150k',
  complianceAngle: 'OSHA documentation + theft prevention + insurance requirements',
  legalStatesOnly: null,
  sequence: [
    { subject: '{{company_name}} — facility security + OSHA documentation', delayDays: 0, body: `Hi {{first_name}},\n\nModern camera systems in manufacturing facilities serve double duty: security monitoring and OSHA incident documentation. When a workplace incident occurs, having clear footage is the difference between a straightforward report and a protracted investigation.\n\nI work with manufacturing facilities to set up comprehensive coverage that addresses both needs.${PRICING_HOOK}\n\n${ctaLink('What\'s the square footage of your facility? I can provide a quick assessment:')}${UNSUB_LINE}` },
    { subject: 'Re: {{company_name}} facility security', delayDays: 4, body: `Hi {{first_name}},\n\nFollowing up — beyond OSHA documentation, the operational visibility that comes with modern cameras is valuable. Production floor monitoring, loading dock management, and perimeter security — all accessible from your phone.\n\nOne manufacturing client reduced shrinkage by 35% and expedited two OSHA reviews because they had clear footage of the incidents in question.\n${PRICING_BLURB}\n\n${ctaLink('If that\'s relevant for your operation:')}${UNSUB_LINE}` },
    { subject: '{{company_name}} — wrapping up', delayDays: 5, body: `Hi {{first_name}},\n\nLast note — if your facility security and documentation systems are solid, excellent. If there are gaps, especially on the production floor or at receiving areas, I'm here when you're ready.\n${PRICING_REMINDER}\n\n${ctaLink('Open invitation:')}${UNSUB_LINE}` },
  ],
}

// ============================================
// TIER C — Volume Fillers (Score < 7.0)
// ============================================

const RESTAURANT: NicheDefinition = {
  slug: 'restaurant',
  name: 'Restaurant (Multi-Location)',
  tier: 'C',
  score: 6.85,
  decisionMaker: 'Owner / Franchisee',
  avgDealRange: '$2.5k–$8k',
  complianceAngle: 'Employee theft at POS accounts for 75% of shrinkage in restaurants',
  legalStatesOnly: null,
  sequence: [
    { subject: '{{company_name}} — reducing shrinkage across your locations', delayDays: 0, body: `Hi {{first_name}},\n\nRestaurant owners lose 4–6% of revenue to employee theft — mostly at POS, the bar, and the walk-in. Multi-location operators feel this the most because patterns are harder to spot across sites.\n\nModern camera systems with remote monitoring let you watch any register, any location, from your phone. I work with multi-unit restaurant operators to set up exactly that.${PRICING_HOOK}\n\n${ctaLink('How many locations do you operate?')}${UNSUB_LINE}` },
    { subject: 'Re: {{company_name}} — restaurant security', delayDays: 4, body: `Hi {{first_name}},\n\nFollowing up — one multi-location franchisee I work with identified a cash skimming pattern across 3 of their 8 locations within the first month of installing smart cameras. The theft had been happening for over a year undetected.\n\nThe cameras paid for themselves in the first quarter.\n${PRICING_BLURB}\n\n${ctaLink('Worth exploring for your locations?')}${UNSUB_LINE}` },
    { subject: '{{company_name}} — last note', delayDays: 5, body: `Hi {{first_name}},\n\nFinal message — if shrinkage isn't a concern and your locations are covered, great. If not, I can help.\n${PRICING_REMINDER}\n\n${ctaLink('Open invitation:')}${UNSUB_LINE}` },
  ],
}

const DAYCARE: NicheDefinition = {
  slug: 'daycare',
  name: 'Childcare / Daycare',
  tier: 'C',
  score: 6.85,
  decisionMaker: 'Owner / Director',
  avgDealRange: '$2.5k–$8k',
  complianceAngle: 'State licensing + parent transparency + liability protection',
  legalStatesOnly: null,
  sequence: [
    { subject: '{{company_name}} — camera systems for daycare licensing compliance', delayDays: 0, body: `Hi {{first_name}},\n\nMany states are updating their daycare licensing requirements to include camera coverage of all childcare areas. Beyond compliance, parents increasingly expect it — and facilities that offer it have a real enrollment advantage.\n\nI help childcare operators set up camera systems that satisfy state requirements and give parents peace of mind.${PRICING_HOOK}\n\n${ctaLink('Does your state currently require cameras? I can check for you:')}${UNSUB_LINE}` },
    { subject: 'Re: {{company_name}} — daycare cameras', delayDays: 4, body: `Hi {{first_name}},\n\nFollowing up — beyond licensing, cameras in daycares serve a critical liability protection function. If a parent ever makes a complaint or allegation, clear footage is your strongest defense.\n\nOne daycare director I work with had a parent complaint completely resolved within an hour because the footage clearly showed what happened. Without cameras, it would have been a lengthy, costly investigation.\n${PRICING_BLURB}\n\n${ctaLink('If protecting your center and your staff is a priority:')}${UNSUB_LINE}` },
    { subject: '{{company_name}} — wrapping up', delayDays: 5, body: `Hi {{first_name}},\n\nLast note — cameras in childcare facilities protect everyone: children, staff, and the business. If it's something you've been considering, I'm here.\n${PRICING_REMINDER}\n\n${ctaLink('Open invitation:')}${UNSUB_LINE}` },
  ],
}

const GYM: NicheDefinition = {
  slug: 'gym',
  name: 'Gym & Fitness Center',
  tier: 'C',
  score: 6.30,
  decisionMaker: 'Owner / Manager',
  avgDealRange: '$3k–$10k',
  complianceAngle: 'Member safety + equipment theft + liability protection',
  legalStatesOnly: null,
  sequence: [
    { subject: '{{company_name}} — gym security + member safety', delayDays: 0, body: `Hi {{first_name}},\n\nGym owners face a unique security challenge: open floor plans, high foot traffic, locker room theft, and injury liability. Modern camera systems (covering workout areas, entrances, and parking — not locker rooms, obviously) address all of these.\n\nI help gym operators set up smart camera systems that protect members, reduce theft, and document incidents for liability purposes.${PRICING_HOOK}\n\n${ctaLink('Would a quick look at your facility layout be helpful?')}${UNSUB_LINE}` },
    { subject: 'Re: {{company_name}} — gym cameras', delayDays: 4, body: `Hi {{first_name}},\n\nFollowing up — the #1 reason gym owners reach out is locker room/car break-in complaints from members. You can't put cameras in the locker room, but you can cover every entrance, the parking lot, and common areas to identify who's coming and going.\n\nOne gym owner I work with reduced member theft complaints by 70% just by installing visible cameras at all entrances.\n${PRICING_BLURB}\n\n${ctaLink('Worth exploring?')}${UNSUB_LINE}` },
    { subject: '{{company_name}} — last note', delayDays: 5, body: `Hi {{first_name}},\n\nFinal message — if member safety and theft prevention are handled, great. If not, I'm here when you need it.\n${PRICING_REMINDER}\n\n${ctaLink('Open invitation:')}${UNSUB_LINE}` },
  ],
}

const CAR_WASH: NicheDefinition = {
  slug: 'car_wash',
  name: 'Car Wash',
  tier: 'C',
  score: 6.40,
  decisionMaker: 'Owner',
  avgDealRange: '$5k–$20k',
  complianceAngle: 'Vehicle damage claims require camera evidence to defend',
  legalStatesOnly: null,
  sequence: [
    { subject: '{{company_name}} — defending against vehicle damage claims', delayDays: 0, body: `Hi {{first_name}},\n\nCar wash operators know the drill: a customer claims their car was damaged during the wash. Without camera footage showing the vehicle's condition before, during, and after, you're on the hook.\n\nI help car wash owners set up camera systems that document every vehicle from entry to exit — protecting against fraudulent claims and giving you clear evidence when legitimate issues arise.${PRICING_HOOK}\n\n${ctaLink('Want to see what that looks like for your operation?')}${UNSUB_LINE}` },
    { subject: 'Re: {{company_name}} — car wash cameras', delayDays: 4, body: `Hi {{first_name}},\n\nFollowing up — one car wash operator I work with was paying out $15K+/year in damage claims before installing cameras. After: zero successful fraudulent claims. The cameras show the vehicle condition at entry and exit, and customers stop pursuing claims when they know footage exists.\n${PRICING_BLURB}\n\n${ctaLink('Worth exploring for your operation?')}${UNSUB_LINE}` },
    { subject: '{{company_name}} — wrapping up', delayDays: 5, body: `Hi {{first_name}},\n\nLast note — if vehicle damage claims aren't a problem, great. If they are, cameras pay for themselves fast.\n${PRICING_REMINDER}\n\n${ctaLink('The offer stands:')}${UNSUB_LINE}` },
  ],
}

// ============================================
// MASTER NICHE REGISTRY
// ============================================

export const NICHES: NicheDefinition[] = [
  // Tier A
  DISPENSARY,
  GROW_OPS,
  GUN_SHOP,
  PAWN_SHOP,
  JEWELRY_STORE,
  // Tier B
  PHARMACY,
  MEDICAL_OFFICE,
  LIQUOR_STORE,
  BANK,
  CONVENIENCE_STORE,
  AUTO_DEALER,
  PROPERTY_MGMT,
  BAR_NIGHTCLUB,
  WAREHOUSE,
  TRUCKING,
  MANUFACTURING,
  SELF_STORAGE,
  CONSTRUCTION,
  VET_CLINIC,
  // Tier C
  RESTAURANT,
  DAYCARE,
  CAR_WASH,
  GYM,
]

export const NICHE_MAP = new Map(NICHES.map((n) => [n.slug, n]))

export function getNiche(slug: string): NicheDefinition | undefined {
  return NICHE_MAP.get(slug)
}

export function getNichesByTier(tier: NicheTier): NicheDefinition[] {
  return NICHES.filter((n) => n.tier === tier)
}

export function isNicheAvailableInState(slug: string, state: string): boolean {
  const niche = NICHE_MAP.get(slug)
  if (!niche) return false
  if (!niche.legalStatesOnly) return true
  return niche.legalStatesOnly.includes(state.toUpperCase())
}
