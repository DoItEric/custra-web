# Blog posts

Each blog is **purely static (SSG)**: `generateStaticParams` + content in TSX files produce static HTML at build time, which is good for SEO and performance.

---

# Adding a new blog post

1. **Add entry to `content/blogs.json`** (title + path only):
   ```json
   { "slug": "your-slug", "title": "Your post title" }
   ```

2. **Create content file** `content/blogs/your-slug.tsx`:
   - Export `meta`: `{ date: "YYYY-MM-DD", summary: "One line for list & SEO", keywords?: string[], ogImage?: "/path/to/image.png" }`
   - `keywords` (optional): array of strings for `<meta name="keywords">` and SEO.
   - `ogImage` (optional): path for Open Graph / Twitter card image (relative to site root).
   - Export default: a React component that renders the post body using shared components from `@/components/blog/BlogBody`:
     - `BlogParagraph` – paragraph
     - `BlogH2` – section heading
     - `BlogList` – `{ items: string[] }`

   Example:
   ```tsx
   import { BlogParagraph, BlogH2, BlogList } from "@/components/blog/BlogBody";

   export const meta = {
     date: "2026-02-01",
     summary: "Short description for list and SEO.",
   };

   export default function YourSlugContent() {
     return (
       <>
         <BlogParagraph>First paragraph...</BlogParagraph>
         <BlogH2>Section title</BlogH2>
         <BlogList items={["Item one", "Item two"]} />
       </>
     );
   }
   ```

3. **Register the post** in `content/blogs/registry.ts`:
   - Import your content: `import yourSlug from "./your-slug";`
   - Add to `BLOG_REGISTRY`: `"your-slug": { meta: yourSlug.meta, Content: yourSlug.default }`

Blog list page reads `blogs.json` for slug + title; date and summary come from each post’s `meta`. Detail pages are statically generated; content lives only in the TSX files, which is good for SEO.
