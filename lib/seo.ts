import { COMPANY_NAME, PHONE_NUMBER } from './constants'

export const BASE_URL = 'https://shieldhome.pro'

export interface BlogPost {
  slug: string
  title: string
  metaTitle: string
  metaDescription: string
  excerpt: string
  category: string
  tags: string[]
  author: string
  publishedAt: string
  updatedAt: string
  readTime: number
  content: string
}

export interface FAQItem {
  q: string
  a: string
}

export interface BreadcrumbItem {
  name: string
  url: string
}

export interface HowToStep {
  name: string
  text: string
  image?: string
}

export function generateBlogSchema(post: BlogPost) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.metaDescription,
    image: `${BASE_URL}/images/blog/${post.slug}.jpg`,
    author: {
      '@type': 'Person',
      name: post.author,
      url: BASE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: COMPANY_NAME,
      logo: {
        '@type': 'ImageObject',
        url: `${BASE_URL}/images/logo.png`,
      },
    },
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${BASE_URL}/blog/${post.slug}`,
    },
    wordCount: post.content.split(/\s+/).length,
    articleSection: post.category,
    keywords: post.tags.join(', '),
  }
}

export function generateFAQSchema(faqs: FAQItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a,
      },
    })),
  }
}

export function generateBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${BASE_URL}${item.url}`,
    })),
  }
}

export function generateLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${BASE_URL}/#organization`,
    name: COMPANY_NAME,
    description:
      'Vivint Smart Home Partner providing professional home security system installation, smart home automation, and 24/7 professional monitoring services.',
    url: BASE_URL,
    telephone: PHONE_NUMBER,
    logo: `${BASE_URL}/images/logo.png`,
    image: `${BASE_URL}/images/og-image.jpg`,
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'US',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 39.8283,
      longitude: -98.5795,
    },
    areaServed: {
      '@type': 'Country',
      name: 'United States',
    },
    serviceArea: {
      '@type': 'Country',
      name: 'United States',
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '08:00',
        closes: '21:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Saturday'],
        opens: '09:00',
        closes: '18:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Sunday'],
        opens: '10:00',
        closes: '17:00',
      },
    ],
    sameAs: [
      'https://www.facebook.com/shieldhomepro',
      'https://www.instagram.com/shieldhomepro',
      'https://twitter.com/shieldhomepro',
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '2847',
      bestRating: '5',
      worstRating: '1',
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Home Security Services',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Professional Home Security Installation',
            description:
              'Complete home security system installation with smart home integration',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: '24/7 Professional Monitoring',
            description:
              'Round-the-clock professional monitoring with emergency dispatch',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Smart Home Automation',
            description:
              'Integrated smart home control including locks, thermostats, and lighting',
          },
        },
      ],
    },
  }
}

export function generateComparisonSchema(title: string, description: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Review',
    name: title,
    description,
    author: {
      '@type': 'Organization',
      name: COMPANY_NAME,
    },
    publisher: {
      '@type': 'Organization',
      name: COMPANY_NAME,
      logo: {
        '@type': 'ImageObject',
        url: `${BASE_URL}/images/logo.png`,
      },
    },
    reviewRating: {
      '@type': 'Rating',
      ratingValue: '4.8',
      bestRating: '5',
      worstRating: '1',
    },
    itemReviewed: {
      '@type': 'Product',
      name: 'Home Security Systems',
      category: 'Home Security',
    },
  }
}

export function generateHowToSchema(
  steps: HowToStep[],
  name?: string,
  description?: string
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: name || 'Home Security Guide',
    description: description || 'Step-by-step guide for home security',
    step: steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
      ...(step.image
        ? {
            image: {
              '@type': 'ImageObject',
              url: step.image.startsWith('http')
                ? step.image
                : `${BASE_URL}${step.image}`,
            },
          }
        : {}),
    })),
  }
}
