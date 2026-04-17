export type HeadlineVariant = {
  preHeadline: string
  h1Mobile: string
  h1Desktop: string
  subheadline: string
}

export const headlineVariants: Record<string, HeadlineVariant> = {
  default: {
    preHeadline: 'Authorized Vivint Dealer · Homeowner Pricing Program',
    h1Mobile: 'Get a $2,847 Vivint Smart Security System for $0 Down',
    h1Desktop: 'Get a $2,847 Vivint Smart Security System for $0 Down',
    subheadline:
      'Free professional installation. Installed this week. See if you qualify in 60 seconds.',
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
    subheadline: '$2,847 system for $0 down. See if you qualify.',
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
    h1Desktop: "Here's Exactly What You Get — $2,847 Package Breakdown",
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
    h1Desktop: 'Homeowner Pricing: $2,847 System for $0 Down',
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
