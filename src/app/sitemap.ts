import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://ascynpro.com";
  const lastModified = new Date();

  return [
    { url: baseUrl, lastModified, changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/demo`, lastModified, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/pilot`, lastModified, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/contact`, lastModified, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/privacy`, lastModified, changeFrequency: "monthly", priority: 0.4 },
    { url: `${baseUrl}/terms`, lastModified, changeFrequency: "monthly", priority: 0.4 },
  ];
}
