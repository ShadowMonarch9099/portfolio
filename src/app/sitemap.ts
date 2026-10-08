import type { MetadataRoute } from "next";
import { profile, work } from "@/data/profile";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: profile.siteUrl, lastModified: new Date(), changeFrequency: "monthly", priority: 1 },
    { url: `${profile.siteUrl}/work`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    ...work.map((w) => ({
      url: `${profile.siteUrl}/work/${w.slug}`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.8,
    })),
  ];
}
