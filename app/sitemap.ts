import { MetadataRoute } from 'next'

const BASE_URL = 'https://shieldhome.pro'

// We import these dynamically to avoid build errors if data files aren't ready yet
async function getSitemapEntries(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = []

  // Core pages
  entries.push(
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${BASE_URL}/home-security-quiz`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/home-security-cost-calculator`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/home-security-statistics`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/compare`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/home-security`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  )

  // Blog posts
  try {
    const { blogPosts } = await import('@/lib/blog-data')
    for (const post of blogPosts) {
      entries.push({
        url: `${BASE_URL}/blog/${post.slug}`,
        lastModified: new Date(post.updatedAt),
        changeFrequency: 'monthly',
        priority: 0.7,
      })
    }
  } catch {
    // blog-data not ready yet
  }

  // Comparison pages
  try {
    const { comparisons } = await import('@/lib/comparison-data')
    for (const comp of comparisons) {
      entries.push({
        url: `${BASE_URL}/compare/${comp.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.8,
      })
    }
  } catch {
    // comparison-data not ready yet
  }

  // State and city pages
  try {
    const { states } = await import('@/lib/city-data')
    for (const state of states) {
      entries.push({
        url: `${BASE_URL}/home-security/${state.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.6,
      })

      for (const city of state.cities) {
        entries.push({
          url: `${BASE_URL}/home-security/${state.slug}/${city.slug}`,
          lastModified: new Date(),
          changeFrequency: 'monthly',
          priority: 0.5,
        })
      }
    }
  } catch {
    // city-data not ready yet
  }

  // Legal pages
  entries.push(
    {
      url: `${BASE_URL}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/terms`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  )

  return entries
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return getSitemapEntries()
}
