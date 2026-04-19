export type HeadlineVariant = {
  preHeadline: string
  h1Mobile: string
  h1Desktop: string
  subheadline: string
}

export const headlineVariants: Record<string, HeadlineVariant> = {
  default: {
    preHeadline: 'Authorized Vivint Dealer · Homeowner Pricing Program',
    h1Mobile: 'The Smartest Home Security in America. Now $0 Down.',
    h1Desktop: 'The Smartest Home Security in America. Now $0 Down.',
    subheadline:
      "ShieldHome is an authorized Vivint dealer — which means you get PCMag's 2026 #1-rated smart security system at dealer pricing. Installed free. Protected in 48 hours.",
  },
  social_proof: {
    preHeadline: 'Authorized Vivint Dealer · Neighborhood Pricing',
    h1Mobile: 'See The Deal Your Neighbors Are Claiming',
    h1Desktop: 'The Vivint Package Your Neighbors Are Getting for $0 Down',
    subheadline: 'Authorized dealer pricing. Install this week.',
  },
  neighbor: {
    preHeadline: 'Authorized Vivint Dealer · Local Homeowner Program',
    h1Mobile: 'The Vivint Deal Your Neighbors Found',
    h1Desktop: 'See Why Homeowners On Your Street Are Switching to Vivint',
    subheadline: 'Dealer pricing for $0 down. See if you qualify.',
  },
  comparison: {
    preHeadline: 'Authorized Vivint Dealer · Real Numbers',
    h1Mobile: "Why Ring Isn't Actually Cheaper",
    h1Desktop: 'The Real Math: Ring vs. Professional Vivint Over 3 Years',
    subheadline:
      'Pro install, 24/7 monitoring, $0 down — the real numbers inside.',
  },
  transparent: {
    preHeadline: 'Authorized Vivint Dealer · No Sales Pitch',
    h1Mobile: 'The Real Vivint Deal — No Sales Pitch',
    h1Desktop: "Here's Exactly What You Get — Full Package Breakdown",
    subheadline: 'Authorized Vivint dealer. No upsell. Just the numbers.',
  },
  ring_switch: {
    preHeadline: 'Authorized Vivint Dealer · Ring Comparison',
    h1Mobile: 'Before You Buy Ring — Read This',
    h1Desktop: 'Why Homeowners Cancel Ring Orders After Seeing This',
    subheadline:
      'Pro-installed Vivint for $0 down. Here\'s how it compares.',
  },
  deal: {
    preHeadline: 'Authorized Vivint Dealer · Homeowner Pricing Program',
    h1Mobile: "The Vivint Deal That Isn't On Their Site",
    h1Desktop: 'Homeowner Pricing: Full Smart System for $0 Down',
    subheadline: 'Authorized dealer program. Qualifying purchase required.',
  },
  adt: {
    preHeadline: 'Authorized Vivint Dealer · ADT Buyout Program',
    h1Mobile: 'Switching From ADT? We Pay Up to $1,000',
    h1Desktop: "We'll Pay Up to $1,000 to End Your ADT Contract",
    subheadline:
      'Authorized Vivint dealer. Free upgrade to smarter security.',
  },
}

export function getHeadlineVariant(src: string | null | undefined): HeadlineVariant {
  if (!src) return headlineVariants.default
  return headlineVariants[src] ?? headlineVariants.default
}
