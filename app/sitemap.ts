import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://fincalc-india.onrender.com'
  const pages = [
    '', '/sip', '/emi', '/fd', 
    '/ppf', '/lumpsum', '/tax'
  ]
  
  return pages.map(path => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: path === '' ? 1 : 0.8,
  }))
}
