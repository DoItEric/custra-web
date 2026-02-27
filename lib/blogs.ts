import fs from "fs";
import path from "path";
import matter from "gray-matter";

const BLOGS_DIR = path.join(process.cwd(), "content", "blogs");

export type BlogMeta = {
  title: string;
  date: string;
  summary: string;
  description?: string;
  keywords?: string | string[];
  ogImage?: string;
};

export type BlogPost = {
  slug: string;
  meta: BlogMeta;
  content: string;
};

export function getAllBlogs(): BlogPost[] {
  if (!fs.existsSync(BLOGS_DIR)) return [];
  const files = fs
    .readdirSync(BLOGS_DIR)
    .filter((f) => f.endsWith(".md") && f.toLowerCase() !== "readme.md");
  return files
    .map((filename) => {
      const slug = filename.replace(/\.md$/, "");
      const fileContent = fs.readFileSync(
        path.join(BLOGS_DIR, filename),
        "utf-8"
      );
      const { data, content } = matter(fileContent);
      return {
        slug,
        meta: data as BlogMeta,
        content,
      };
    })
    .sort((a, b) => (b.meta.date ?? "").localeCompare(a.meta.date ?? ""));
}

export function getBlogBySlug(slug: string): BlogPost | null {
  const filePath = path.join(BLOGS_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContent);
  return {
    slug,
    meta: data as BlogMeta,
    content,
  };
}
