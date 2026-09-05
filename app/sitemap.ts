import { MetadataRoute } from 'next';
import { CALCULATOR_REGISTRY } from '@/lib/registry';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://fincalc-india.vercel.app';
  const lastModified = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: base,
      lastModified,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${base}/history`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  const calculatorPages: MetadataRoute.Sitemap = CALCULATOR_REGISTRY.map((calc) => ({
    url: `${base}${calc.route}`,
    lastModified,
    changeFrequency: 'monthly',
    priority: calc.isPopular ? 0.9 : 0.8,
  }));

  return [...staticPages, ...calculatorPages];
}
