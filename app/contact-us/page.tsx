import type { Metadata } from "next";
import Link from "next/link";
import { Mail, Youtube, MessageSquareText, User } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Contact EricXia about CUSTRA.",
};

export default function ContactUsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
        <div className="space-y-4">
          <h1 className="text-3xl font-semibold tracking-tight text-black/90 sm:text-4xl">
            Contact Us
          </h1>
          <p className="max-w-xl text-black/60">
            Want to collaborate, give feedback, or ask about the beta? Reach out
            anytime.
          </p>

          <div className="mt-6 grid gap-3">
            <div className="rounded-2xl border border-black/5 bg-white/70 p-6 shadow-sm">
              <div className="flex items-start justify-between gap-6">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 text-sm font-medium text-black/60">
                    <User className="h-4 w-4" />
                    Name
                  </div>
                  <div className="mt-2 text-lg font-semibold text-black/90">
                    EricXia
                  </div>
                  <div className="mt-1 text-sm text-black/50">
                    Building CUSTRA — local-first capture for meetings & classes.
                  </div>
                </div>
                <div className="rounded-xl border border-black/5 bg-white/70 px-3 py-2 text-xs font-medium text-black/50">
                  Response: 24–48h
                </div>
              </div>
            </div>

            <a
              className="group flex items-center justify-between gap-4 rounded-2xl border border-black/5 bg-white/70 p-5 shadow-sm transition hover:bg-white"
              href="mailto:eric.beright@gmail.com"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF2FF] text-[#1F6FEB]">
                  <Mail className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-black/90">
                    Email
                  </div>
                  <div className="text-sm text-black/60">
                    eric.beright@gmail.com
                  </div>
                </div>
              </div>
              <div className="text-sm font-medium text-[#1F6FEB]">Open →</div>
            </a>

            <a
              className="group flex items-center justify-between gap-4 rounded-2xl border border-black/5 bg-white/70 p-5 shadow-sm transition hover:bg-white"
              href="https://www.youtube.com/@EricThinks"
              target="_blank"
              rel="noreferrer"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF2FF] text-[#1F6FEB]">
                  <Youtube className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-black/90">
                    YouTube
                  </div>
                  <div className="text-sm text-black/60">@EricThinks</div>
                </div>
              </div>
              <div className="text-sm font-medium text-[#1F6FEB]">Watch →</div>
            </a>

            <a
              className="group flex items-center justify-between gap-4 rounded-2xl border border-black/5 bg-white/70 p-5 shadow-sm transition hover:bg-white"
              href="https://discord.gg/BJQgVR2H"
              target="_blank"
              rel="noreferrer"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF2FF] text-[#1F6FEB]">
                  <MessageSquareText className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-black/90">
                    Discord
                  </div>
                  <div className="text-sm text-black/60">
                    Join the community
                  </div>
                </div>
              </div>
              <div className="text-sm font-medium text-[#1F6FEB]">Join →</div>
            </a>

          </div>

          <div className="text-sm text-black/50">
            Prefer to start from the main page?{" "}
            <Link className="text-[#1F6FEB] hover:underline" href="/">
              Go Home
            </Link>
          </div>
        </div>

        <div className="rounded-3xl border border-black/5 bg-gradient-to-b from-white to-[#F4F9FF] p-8 shadow-sm">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-black/5 bg-white/70 px-3 py-1 text-xs font-medium text-black/60">
            <span className="h-1.5 w-1.5 rounded-full bg-[#1F6FEB]" />
            Fastest way to help
          </div>
          <h2 className="mt-4 text-2xl font-semibold tracking-tight text-black/90">
            Share your use case
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-black/60">
            If you include your meeting/class scenario (slides, subtitles, chat,
            or shared screen), I can prioritize the right capture workflow for
            you.
          </p>

          <div className="mt-6 space-y-3">
            <Link
              className="block rounded-2xl border border-black/5 bg-white/70 px-5 py-4 text-black/70 transition hover:bg-white"
              href="/"
            >
              <div className="text-sm font-semibold text-black/90">
                Join the waitlist
              </div>
              <div className="mt-1 text-sm text-black/55">
                Get the beta download link first →
              </div>
            </Link>
            <Link
              className="block rounded-2xl border border-black/5 bg-white/70 px-5 py-4 text-black/70 transition hover:bg-white"
              href="/blogs"
            >
              <div className="text-sm font-semibold text-black/90">Blogs</div>
              <div className="mt-1 text-sm text-black/55">
                Read updates and notes →
              </div>
            </Link>
          </div>

          <div className="mt-6 rounded-2xl border border-black/5 bg-white/70 p-5 text-sm text-black/55">
            Tip: mention your OS (Windows/macOS), and whether you need system
            audio capture.
          </div>
        </div>
      </div>
    </div>
  );
}

