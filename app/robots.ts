import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/login", "/privacy", "/terms", "/calculators"],
        disallow: ["/api/", "/history", "/result/"],
      },
    ],
    sitemap: "https://fincalc-india.vercel.app/sitemap.xml",
  };
}
