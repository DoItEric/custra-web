import type { MetadataRoute } from "next";
import { getAllBlogs } from "@/lib/blogs";

const baseUrl = (process.env.NEXT_PUBLIC_DOMAIN ?? "").replace(/\/$/, "");

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/blogs`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact-us`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ];

  const blogPages: MetadataRoute.Sitemap = getAllBlogs().map((post) => ({
    url: `${baseUrl}/blogs/${post.slug}`,
    lastModified: post.meta.date ? new Date(post.meta.date) : new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticPages, ...blogPages];
}
