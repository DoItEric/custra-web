import Link from "next/link";
import { cn } from "@/lib/utils";

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

export type BlogLayoutProps = {
  title: string;
  date?: string;
  summary?: string;
  children: React.ReactNode;
  className?: string;
};

export default function BlogLayout({
  title,
  date,
  summary,
  children,
  className,
}: BlogLayoutProps) {
  return (
    <div className={cn("mx-auto max-w-3xl px-4 py-12 sm:px-6", className)}>
      <div className="mb-8">
        <Link
          href="/blogs"
          className="text-sm font-medium text-black/60 transition hover:text-black"
        >
          ← Back to Blogs
        </Link>
      </div>

      <article className="rounded-2xl border border-black/5 bg-white/70 p-7 shadow-sm sm:p-10">
        {date && (
          <div className="text-xs font-medium text-black/45">
            {formatDate(date)}
          </div>
        )}
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-black/90 sm:text-4xl">
          {title}
        </h1>
        {summary && (
          <p className="mt-4 text-base leading-relaxed text-black/30">
            {summary}
          </p>
        )}

        <div className="mt-8 space-y-6">{children}</div>
      </article>
    </div>
  );
}
