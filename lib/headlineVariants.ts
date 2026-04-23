export type HeadlineVariant = {
  preHeadline: string
  h1Mobile: string
  h1Desktop: string
  subheadline: string
}

export const headlineVariants: Record<string, HeadlineVariant> = {
  default: {
    preHeadline: 'Vivint Smart Home Partner · Homeowner Pricing Program',
    h1Mobile: 'The Smartest Home Security in America. Now $0 Down.',
    h1Desktop: 'The Smartest Home Security in America. Now $0 Down.',
    subheadline:
      "ShieldHome is a Vivint Smart Home partner — which means you get PCMag's 2026 #1-rated smart security system at partner pricing. Installed free. Protected in 48 hours.",
  },
  social_proof: {
    preHeadline: 'Vivint Smart Home Partner · Neighborhood Pricing',
    h1Mobile: 'See The Deal Your Neighbors Are Claiming',
    h1Desktop: 'The Vivint Package Your Neighbors Are Getting for $0 Down',
    subheadline: 'Vivint partner pricing. Install this week.',
  },
  neighbor: {
    preHeadline: 'Vivint Smart Home Partner · Local Homeowner Program',
    h1Mobile: 'The Vivint Deal Your Neighbors Found',
    h1Desktop: 'See Why Homeowners On Your Street Are Switching to Vivint',
    subheadline: 'Dealer pricing for $0 down. See if you qualify.',
  },
  comparison: {
    preHeadline: 'Vivint Smart Home Partner · Real Numbers',
    h1Mobile: "Why Ring Isn't Actually Cheaper",
    h1Desktop: 'The Real Math: Ring vs. Professional Vivint Over 3 Years',
    subheadline:
      'Pro install, 24/7 monitoring, $0 down — the real numbers inside.',
  },
  transparent: {
    preHeadline: 'Vivint Smart Home Partner · No Sales Pitch',
    h1Mobile: 'The Real Vivint Deal — No Sales Pitch',
    h1Desktop: "Here's Exactly What You Get — Full Package Breakdown",
    subheadline: 'Vivint Smart Home partner. No upsell. Just the numbers.',
  },
  ring_switch: {
    preHeadline: 'Vivint Smart Home Partner · Ring Comparison',
    h1Mobile: 'Before You Buy Ring — Read This',
    h1Desktop: 'Why Homeowners Cancel Ring Orders After Seeing This',
    subheadline:
      'Pro-installed Vivint for $0 down. Here\'s how it compares.',
  },
  deal: {
    preHeadline: 'Vivint Smart Home Partner · Homeowner Pricing Program',
    h1Mobile: "The Vivint Deal That Isn't On Their Site",
    h1Desktop: 'Homeowner Pricing: Full Smart System for $0 Down',
    subheadline: 'Vivint partner program. Qualifying purchase required.',
  },
  adt: {
    preHeadline: 'Vivint Smart Home Partner · ADT Buyout Program',
    h1Mobile: 'Switching From ADT? We Pay Up to $1,000',
    h1Desktop: "We'll Pay Up to $1,000 to End Your ADT Contract",
    subheadline:
      'Vivint Smart Home partner. Free upgrade to smarter security.',
  },
}

export function getHeadlineVariant(src: string | null | undefined): HeadlineVariant {
  if (!src) return headlineVariants.default
  return headlineVariants[src] ?? headlineVariants.default
}
