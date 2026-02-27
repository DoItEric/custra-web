import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import BlogLayout from "@/components/blog/BlogLayout";
import { getAllBlogs, getBlogBySlug } from "@/lib/blogs";

type PageProps = {
  params: { slug: string };
};

const siteName = process.env.NEXT_PUBLIC_SITE_NAME ?? "CUSTRA";
const baseUrl = process.env.NEXT_PUBLIC_DOMAIN
  ? process.env.NEXT_PUBLIC_DOMAIN.replace(/\/$/, "")
  : "";

export function generateStaticParams() {
  return getAllBlogs().map((post) => ({ slug: post.slug }));
}

function normalizeKeywords(keywords?: string | string[]): string[] {
  if (!keywords) return [];
  return Array.isArray(keywords) ? keywords : [keywords];
}

export function generateMetadata({ params }: PageProps): Metadata {
  const post = getBlogBySlug(params.slug);
  if (!post) return { title: "Blog" };

  const { meta } = post;
  const fullTitle = `${meta.title} — ${siteName}`;
  const description = meta.description || meta.summary;
  const keywords = normalizeKeywords(meta.keywords);
  const canonicalUrl = baseUrl ? `${baseUrl}/blogs/${params.slug}` : undefined;
  const ogImage = meta.ogImage
    ? baseUrl
      ? `${baseUrl}${meta.ogImage.startsWith("/") ? "" : "/"}${meta.ogImage}`
      : meta.ogImage
    : baseUrl
      ? `${baseUrl}/icon.png`
      : undefined;

  return {
    title: fullTitle,
    description,
    keywords: keywords.length > 0 ? keywords : undefined,
    authors: [{ name: siteName, url: baseUrl || undefined }],
    openGraph: {
      type: "article",
      title: fullTitle,
      description,
      siteName,
      url: canonicalUrl,
      ...(ogImage && { images: [{ url: ogImage, alt: meta.title }] }),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      ...(ogImage && { images: [ogImage] }),
    },
    alternates: canonicalUrl ? { canonical: canonicalUrl } : undefined,
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function BlogDetailPage({ params }: PageProps) {
  const post = getBlogBySlug(params.slug);
  if (!post) notFound();

  return (
    <BlogLayout title={post.meta.title} date={post.meta.date} summary={post.meta.summary}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          p: ({ children }) => (
            <p className="leading-relaxed text-black/65">{children}</p>
          ),
          h2: ({ children }) => (
            <h2 className="text-xl font-semibold tracking-tight text-black/90">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-lg font-semibold tracking-tight text-black/85">
              {children}
            </h3>
          ),
          ul: ({ children }) => (
            <ul className="list-disc space-y-2 pl-5 text-black/65 [&_li]:leading-relaxed">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal space-y-2 pl-5 text-black/65 [&_li]:leading-relaxed">
              {children}
            </ol>
          ),
          li: ({ children }) => <li>{children}</li>,
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#1F6FEB] underline underline-offset-2 hover:opacity-80"
            >
              {children}
            </a>
          ),
          img: ({ src, alt }) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={src}
              alt={alt ?? ""}
              className="w-full rounded-xl"
            />
          ),
          code: ({ children, className }) => {
            const isBlock = className?.includes("language-");
            if (isBlock) {
              return (
                <pre className="overflow-x-auto rounded-lg bg-black/5 p-4 text-sm">
                  <code className="text-black/80">{children}</code>
                </pre>
              );
            }
            return (
              <code className="rounded bg-black/5 px-1 py-0.5 text-sm text-black/80">
                {children}
              </code>
            );
          },
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-black/10 pl-4 text-black/50 italic">
              {children}
            </blockquote>
          ),
          hr: () => <hr className="border-black/10" />,
          strong: ({ children }) => (
            <strong className="font-semibold text-black/80">{children}</strong>
          ),
        }}
      >
        {post.content}
      </ReactMarkdown>
    </BlogLayout>
  );
}
