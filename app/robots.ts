import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/dashboard/',
          '/leads/',
          '/analytics/',
          '/commissions/',
          '/settings/',
          '/login',
          '/thank-you',
          '/fb',
          '/fb/',
          '/google',
          '/google/',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/api/',
          '/dashboard/',
          '/leads/',
          '/analytics/',
          '/commissions/',
          '/settings/',
          '/login',
          '/thank-you',
          '/fb',
          '/fb/',
          '/google',
          '/google/',
        ],
      },
    ],
    sitemap: 'https://shieldhome.pro/sitemap.xml',
  }
}
