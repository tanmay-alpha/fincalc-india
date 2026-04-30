import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/history'],
      }
    ],
    sitemap: 'https://fincalc-india.vercel.app/sitemap.xml',
  }
}
