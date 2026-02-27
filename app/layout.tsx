import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import SiteHeader from "@/components/SiteHeader";

const inter = Inter({ subsets: ["latin"] });

const siteName = process.env.NEXT_PUBLIC_SITE_NAME ?? "Quick Waitlist";
const siteDescription =
  process.env.NEXT_PUBLIC_SITE_DESCRIPTION ??
  "Quick Waitlist and coming soon page for your SAAS and website.";
const siteAlternateNames = [
  "CUSTRA-Auto-Screenshot-Tool",
  "CUSTRA-Auto-Screenshot",
];
const siteDomain = process.env.NEXT_PUBLIC_DOMAIN
  ? process.env.NEXT_PUBLIC_DOMAIN.replace(/\/$/, "")
  : undefined;

export const metadata: Metadata = {
  title: siteName,
  description: siteDescription,
  icons: { icon: "/icon32.png" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} min-h-screen bg-gradient-to-b from-white via-[#F4F9FF] to-[#EAF2FF] text-black`}
      >
        <div className="pointer-events-none fixed inset-0 -z-10">
          <div className="absolute left-1/2 top-[-240px] h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-gradient-radial from-[#7CC4FF]/35 to-transparent blur-2xl" />
          <div className="absolute right-[-220px] top-[140px] h-[520px] w-[520px] rounded-full bg-gradient-radial from-[#B7D9FF]/35 to-transparent blur-2xl" />
        </div>

        <div className="flex min-h-screen flex-col">
          <SiteHeader className="sticky top-0 z-50 border-b border-black/5 bg-white/70 backdrop-blur" />
          <main className="flex-1">{children}</main>
          <footer className="border-t border-black/5">
            <div className="mx-auto max-w-6xl px-4 py-10 text-sm text-black/50 sm:px-6">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  © {new Date().getFullYear()}{" "}
                  <span className="font-medium text-black/70">{siteName}</span>
                </div>
                <div className="flex items-center gap-4">
                  <a
                    href="/privacy-policy"
                    className="transition hover:text-black/70"
                  >
                    Privacy
                  </a>
                  <a
                    href="/unsubscribe"
                    className="transition hover:text-black/70"
                  >
                    Unsubscribe
                  </a>
                </div>
              </div>
            </div>
          </footer>
        </div>
        <Toaster />
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: siteName,
              alternateName: siteAlternateNames,
              ...(siteDomain && { url: siteDomain }),
            }),
          }}
        />
      </body>
    </html>
  );
}
