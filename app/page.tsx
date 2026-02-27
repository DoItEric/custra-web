// import EmailForm from "@/components/EmailForm";
import dynamic from "next/dynamic";
import Reveal from "@/components/Reveal";

export default function Home() {
  const date = process.env.NEXT_PUBLIC_LAUNCH_DATE || "2026-03-31";
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME ?? "CUSTRA | Auto Screenshot Tool";
  const EmailForm = dynamic(() => import("@/components/EmailForm"), {
    ssr: false,
  });
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <section className="grid gap-10 lg:grid-cols-12 lg:items-start">
        {/* Hero */}
        <div className="space-y-6 lg:col-span-7 lg:pt-4">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-black/5 bg-white/70 px-3 py-1 text-xs font-medium text-black/60">
            <span className="h-1.5 w-1.5 rounded-full bg-[#1F6FEB]" />
            Local-first. Designed for meetings & classes.
          </div>

          <h1 className="text-4xl font-semibold tracking-tight text-black/90 sm:text-5xl">
            Stop screenshotting mid-meeting.
            <br />
            Let {siteName} capture the key frames.
          </h1>

          <p className="max-w-2xl text-base leading-relaxed text-black/60 sm:text-lg">
            Select a region inside Zoom / Teams / Tencent Meeting / live streams
            (slides, subtitles, chat). {siteName} samples every second, automatically stores changes — with
            an optional loop capture as a safety net.
          </p>

          {/* <div className="grid gap-3 sm:grid-cols-3">
            {[
              { k: "1s", v: "Sampling cadence" },
              { k: "Change", v: "Save only when it matters" },
              { k: "Local", v: "No upload by default" },
            ].map((it) => (
              <div
                key={it.k}
                className="rounded-2xl border border-black/5 bg-white/70 p-4 shadow-sm"
              >
                <div className="text-xl font-semibold tracking-tight text-black/90">
                  {it.k}
                </div>
                <div className="mt-1 text-sm text-black/55">{it.v}</div>
              </div>
            ))}
          </div> */}

          <div className="flex flex-wrap items-center gap-2 text-sm text-black/55">
            {[
              "Zoom",
              "Teams",
              "Tencent Meeting",
              "Online courses",
              "Live streams",
              "Web Browser",
              "Local video player",
            ].map((t) => (
              <span
                key={t}
                className="rounded-full border border-black/5 bg-white/60 px-3 py-1"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Waitlist card */}
        <div className="lg:col-span-5">
          <div className="rounded-3xl border border-black/5 bg-white/80 p-6 shadow-sm backdrop-blur sm:p-8">
            <EmailForm date={date} title="Join the CUSTRA waitlist" />
          </div>
        </div>
      </section>

      {/* Sections */}
      <div className="mt-16 space-y-10">
        <Reveal className="overflow-hidden rounded-2xl">
          <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
            <iframe
              className="absolute top-0 left-0 h-full w-full"
              src="https://www.youtube.com/embed/XAHfbhWdeqw?si=A6oQ_PYtHhDfaIdU&autoplay=1"
              title="CUSTRA Demo Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              referrerPolicy="strict-origin-when-cross-origin" // 防止iframe被嵌入其他网站时，泄露隐私
              allowFullScreen
              loading="lazy"
            />
          </div>
        </Reveal>

        <Reveal className="rounded-3xl border border-black/5 bg-gradient-to-b from-white to-[#F4F9FF] p-8 shadow-sm sm:p-10">
          <h2 className="text-2xl font-semibold tracking-tight text-black/90">
            No more busy taking screenshots
          </h2>
          <p className="mt-3 max-w-3xl leading-relaxed text-black/60">
            In meetings and courses, the pain isn’t “lack of content” — it’s
            missing the moment. When you stop to screenshot, you stop to listen.{" "}
            {siteName} captures the key frames so you can stay engaged.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {[
              {
                title: "Fewer junk screenshots",
                desc: "Save only the important changes.",
              },
              {
                title: "Faster review",
                desc: "A timeline of images is easier to skim than a long recording.",
              },
              {
                title: "Audio sync",
                desc: "Record audio while capturing the important moments.",
              },
              {
                title: "Local privacy",
                desc: "No account, no upload, your files stay yours.",
              },
            ].map((c) => (
              <div
                key={c.title}
                className="rounded-2xl border border-black/5 bg-white/75 p-5"
              >
                <div className="text-sm font-semibold text-black/90">
                  {c.title}
                </div>
                <div className="mt-2 text-sm leading-relaxed text-black/60">
                  {c.desc}
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal className="rounded-3xl border border-black/5 bg-white/80 p-8 shadow-sm sm:p-10">
          <div className="inline-flex w-fit items-center gap-2 rounded-full bg-black/[0.03] px-3 py-1 text-xs font-medium text-black/60">
            Before vs after
          </div>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-black/90">
            What changes with {siteName}
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-black/60">
            Side‑by‑side, the difference is simple: fewer interruptions while
            listening, and cleaner outputs when you review.
          </p>

          <div className="mt-6 grid gap-0 overflow-hidden rounded-2xl border border-black/5 bg-white/80 sm:grid-cols-2">
            <div className="border-b border-black/5 p-5 sm:border-b-0 sm:border-r">
              <div className="text-xs font-medium text-black/50">
                Without {siteName}
              </div>
              <ul className="mt-3 space-y-2 text-sm text-black/65">
                <li>❌ Pause to screenshot</li>
                <li>❌ Miss a sentence / a step</li>
                <li>❌ Hundreds of unsorted images</li>
                <li>❌ Hard to find “that slide” later</li>
              </ul>
            </div>
            <div className="p-5">
              <div className="text-xs font-medium text-black/50">
                With {siteName}
              </div>
              <ul className="mt-3 space-y-2 text-sm text-black/65">
                <li>✅ Select once, keep listening</li>
                <li>✅ Only key changes saved</li>
                <li>✅ Clean, time‑stamped output folder</li>
                <li>✅ Easier to align with your notes</li>
              </ul>
            </div>
          </div>
        </Reveal>
        
        <Reveal className="rounded-3xl border border-black/5 bg-white/70 p-8 shadow-sm sm:p-10">
          <h2 className="text-2xl font-semibold tracking-tight text-black/90">
            No upload, No Saas
          </h2>
          <p className="mt-3 max-w-3xl leading-relaxed text-black/60">
            {siteName} runs locally and saves outputs to your computer. No
            account required. No upload. Your files stay in your
            control.No subscription, one-time purchase.
          </p>
        </Reveal>

        <Reveal className="rounded-3xl border border-black/5 bg-white/70 p-8 shadow-sm sm:p-10">
          <h2 className="text-2xl font-semibold tracking-tight text-black/90">
            Who it’s for
          </h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Students",
                desc: "Capture key slide pages and worked examples from online courses.",
              },
              {
                title: "Professionals",
                desc: "Save the important moments from reviews, trainings, and demos.",
              },
              {
                title: "Creators",
                desc: "Collect key frames from live sessions for editing and notes.",
              },
              {
                title: "TAs & instructors",
                desc: "Quickly locate “that slide” when answering questions later.",
              },
              {
                title: "Researchers",
                desc: "Organize screenshots into a clean timeline for analysis.",
              },
              {
                title: "Remote teams",
                desc: "Keep a lightweight visual record without heavy screen recordings.",
              },
            ].map((c) => (
              <div
                key={c.title}
                className="rounded-2xl border border-black/5 bg-white/80 p-6"
              >
                <div className="text-base font-semibold text-black/90">
                  {c.title}
                </div>
                <div className="mt-2 text-sm leading-relaxed text-black/60">
                  {c.desc}
                </div>
              </div>
            ))}
          </div>
        </Reveal>
        <Reveal className="rounded-3xl border border-black/5 bg-white/70 p-8 shadow-sm sm:p-10">
          <h2 className="text-2xl font-semibold tracking-tight text-black/90">
            Feature highlights
          </h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Minimal workflow",
                desc: "Start → select region → stop. Results are ready in a folder.",
              },
              {
                title: "Change-trigger saving",
                desc: "Better signal-to-noise than manual screenshots or raw screen recording.",
              },
              {
                title: "Optional loop fallback",
                desc: "Save every N seconds if you want a safety net for subtle changes.",
              },
              {
                title: "Timestamped outputs",
                desc: "Easy to align with your notes and recall the moment later.",
              },
              {
                title: "Local-first privacy",
                desc: "No account required. Outputs stay on your computer by default.",
              },
              {
                title: "Windows system audio",
                desc: "Optional audio capture to replay the important parts.",
              },
            ].map((c) => (
              <div
                key={c.title}
                className="rounded-2xl border border-black/5 bg-white/80 p-6"
              >
                <div className="text-base font-semibold text-black/90">
                  {c.title}
                </div>
                <div className="mt-2 text-sm leading-relaxed text-black/60">
                  {c.desc}
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal className="rounded-3xl border border-black/5 bg-white/70 p-8 shadow-sm sm:p-10">
          <h2 className="text-2xl font-semibold tracking-tight text-black/90">
            🙋 FAQ
          </h2>
          <p className="mt-2 text-sm text-black/55">
            Common questions about {siteName}.
          </p>
          <dl className="mt-6 space-y-5">
            {[
              {
                q: "💻 Does it support macOS and Linux?",
                a: "The current demo is Windows-only. We may add macOS and Linux support later.",
              },
              {
                q: "🎬 Is this screen recording?",
                a: "No. It samples every second and saves key change frames as PNGs. You can also turn on loop capture as a fallback.",
              },
              {
                q: "❓ Why not just record the screen?",
                a: "For most meetings and classes you only need the key slides and switches, not a long video. Key frames are easier to search and better for notes.",
              },
              {
                q: "📁 Where are files saved?",
                a: "Locally: output/<task>/images/*.png. If you enable audio (Windows), you get output/<task>/audio/audio.wav.",
              },
              {
                q: "☁️ Does it upload to the cloud?",
                a: "No. It runs and saves everything on your machine.",
              },
            ].map((faq) => (
              <div
                key={faq.q}
                className="rounded-2xl border border-black/5 bg-white/80 px-5 py-4"
              >
                <dt className="text-sm font-semibold text-black/90">{faq.q}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-black/60">
                  {faq.a}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <Reveal className="rounded-3xl border border-black/5 bg-gradient-to-b from-white to-[#F4F9FF] p-8 shadow-sm sm:p-10">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7">
              <h2 className="text-2xl font-semibold tracking-tight text-black/90">
                Ready to stop missing key slides?
              </h2>
              <p className="mt-3 max-w-2xl leading-relaxed text-black/60">
                Join the waitlist to get early access and help shape the beta.
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-2 text-xs text-black/50">
                <span className="rounded-full border border-black/5 bg-white/70 px-3 py-1">
                  No spam
                </span>
                <span className="rounded-full border border-black/5 bg-white/70 px-3 py-1">
                  Unsubscribe anytime
                </span>
                <span className="rounded-full border border-black/5 bg-white/70 px-3 py-1">
                  Local-first by default
                </span>
              </div>
            </div>
            <div className="lg:col-span-5">
              <div className="rounded-2xl border border-black/5 bg-white/80 p-6">
                <EmailForm date={date} title="Get beta access" />
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
