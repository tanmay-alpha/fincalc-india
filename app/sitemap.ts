import { MetadataRoute } from "next";
import { CALCULATOR_REGISTRY } from "@/lib/registry";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://fincalc-india.vercel.app";
  const lastModified = new Date();

  const publicPages: MetadataRoute.Sitemap = [
    {
      url: `${base}/login`,
      lastModified,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${base}/calculators`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${base}/privacy`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${base}/terms`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.4,
    },
  ];

  const calculatorPages: MetadataRoute.Sitemap = CALCULATOR_REGISTRY.map(
    (calc) => ({
      url: `${base}${calc.route}`,
      lastModified,
      changeFrequency: "monthly",
      priority: calc.isPopular ? 0.9 : 0.8,
    })
  );

  return [...publicPages, ...calculatorPages];
}
