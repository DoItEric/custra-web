import Link from "next/link";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/blogs", label: "Blogs" },
  { href: "/contact-us", label: "Contact Us" },
];

export default function SiteHeader({
  className,
}: {
  className?: string;
}) {
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME ?? "CUSTRA";

  return (
    <header className={cn("w-full", className)}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="group inline-flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/icon32.png"
              alt={`${siteName} logo`}
              className="h-8 w-8 rounded-md bg-white/60 ring-1 ring-black/5"
            />
            <span className="text-sm font-semibold tracking-tight text-black/90">
              {siteName}
            </span>
          </Link>

          <nav className="flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full px-3 py-1.5 text-sm text-black/70 transition hover:bg-black/5 hover:text-black"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}

