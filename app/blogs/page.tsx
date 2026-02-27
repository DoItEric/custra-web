import type { Metadata } from "next";
import Link from "next/link";
import { getAllBlogs } from "@/lib/blogs";

export const metadata: Metadata = {
  title: "Blogs",
  description:
    "Product updates and notes for CUSTRA — a local-first meeting & course capture assistant.",
};

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  } catch {
    return iso;
  }
}

export default function BlogsPage() {
  const posts = getAllBlogs();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="mb-10 flex items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight text-black/90 sm:text-4xl">
            Blogs
          </h1>
          <p className="max-w-2xl text-black/60">
            Product communication. New updates will land here.
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-black/5 bg-white/70 shadow-sm">
        <div className="divide-y divide-black/5">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blogs/${post.slug}`}
              className="group block p-6 transition hover:bg-white"
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
                {post.meta?.date && (
                  <div className="text-xs font-medium text-black/45">
                    {formatDate(post.meta.date)}
                  </div>
                )}
                <div className="inline-flex w-fit items-center rounded-full bg-[#EAF2FF] px-2 py-1 text-[11px] font-medium text-[#1F6FEB]">
                  Update
                </div>
              </div>
              <div className="mt-3 flex items-start justify-between gap-6">
                <div className="min-w-0">
                  <h2 className="text-lg font-semibold tracking-tight text-black/90 group-hover:text-black">
                    {post.meta.title}
                  </h2>
                  {post.meta?.summary && (
                    <p className="mt-2 text-sm leading-relaxed text-black/60">
                      {post.meta.summary}
                    </p>
                  )}
                </div>
                <div className="mt-1 shrink-0 text-sm font-medium text-[#1F6FEB]">
                  Read →
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
