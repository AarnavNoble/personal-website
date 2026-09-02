"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { LINKS, PROJECTS, EXPERIENCE } from "@/lib/data";
import { FadeUp, Reveal } from "@/components/motion-lib";

const SKILLS = [
  "Python", "Go", "TypeScript", "C / C++", "React", "Next.js", "FastAPI",
  "PyTorch", "Kubernetes", "Docker", "Terraform", "AWS", "PostgreSQL",
  "ClickHouse", "GraphQL", "WebRTC", "OpenTelemetry", "Linux",
];

const STATS = [
  { n: "04", label: "internships shipped" },
  { n: "03", label: "systems built from scratch" },
  { n: "2028", label: "class of" },
];

const NOW = [
  { label: "studying", value: "Computer Engineering · University of Waterloo" },
  { label: "open to", value: "SWE / ML-infra co-op · Winter 2027" },
];

const INTERESTS = ["photography", "film", "soccer", "MMA", "tennis", "travel"];

export default function Home() {
  const [copied, setCopied] = useState(false);

  function copyEmail() {
    navigator.clipboard.writeText(LINKS.email).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement || e.metaKey || e.ctrlKey) return;
      if (e.key === "g") window.open(LINKS.github, "_blank");
      if (e.key === "l") window.open(LINKS.linkedin, "_blank");
      if (e.key === "r") window.open(LINKS.resume, "_blank");
      if (e.key === "e") copyEmail();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="grain relative min-h-screen overflow-x-clip">
      <div className="herobloom-far" aria-hidden />

      {/* Nav */}
      <motion.nav
        initial={{ y: -16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-40"
      >
        <div className="max-w-[1160px] mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="font-label text-[13px]" style={{ color: "var(--g12)", letterSpacing: "0.22em" }}>
            AN
          </Link>
          <div className="flex items-center gap-7 text-[13px]">
            <Link href="/work" className="link-dim">Work</Link>
            <Link href="/projects" className="link-dim">Projects</Link>
            <a href={LINKS.resume} target="_blank" rel="noopener" className="link-dim hidden sm:inline">Résumé</a>
            <a href={LINKS.github} target="_blank" rel="noopener" className="link-dim hidden sm:inline">GitHub</a>
            <kbd
              className="hidden sm:flex items-center text-[11px] font-mono px-2 py-1 rounded cursor-pointer"
              style={{ color: "var(--g7)", background: "var(--g2)", border: "1px solid var(--g4)" }}
              onClick={() => window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true, bubbles: true }))}
            >
              ⌘K
            </kbd>
          </div>
        </div>
      </motion.nav>

      {/* Hero */}
      <section className="relative z-10 max-w-[1160px] mx-auto px-6 min-h-[100svh] flex flex-col justify-center pt-24 pb-20">
        <div className="herobloom" aria-hidden />

        <div className="relative">
          <FadeUp delay={0.05}>
            <span
              className="font-label inline-flex items-center gap-2.5 text-[11px]"
              style={{ color: "var(--g8)" }}
            >
              <span className="inline-block h-[6px] w-[6px] rounded-full" style={{ background: "var(--accent)" }} />
              Waterloo, ON — back on campus
            </span>
          </FadeUp>

          <FadeUp delay={0.12}>
            <h1
              className="font-display mt-6"
              style={{
                fontSize: "var(--fs-hero)",
                fontWeight: 400,
                letterSpacing: "-0.05em",
                lineHeight: 0.92,
                color: "var(--g12)",
              }}
            >
              Aarnav
              <br />
              Noble
            </h1>
          </FadeUp>

          <FadeUp delay={0.24}>
            <p
              className="mt-8 max-w-[42ch] text-[17px] sm:text-[19px]"
              style={{ color: "var(--g9)", lineHeight: 1.6, fontWeight: 400 }}
            >
              I like making things that work, and understanding the ones that don&rsquo;t.
            </p>
          </FadeUp>

          <FadeUp delay={0.34}>
            <div className="mt-10 flex flex-wrap items-center gap-x-3 gap-y-3">
              <a
                href={LINKS.resume}
                target="_blank"
                rel="noopener"
                className="btn-fill"
              >
                Résumé ↗
              </a>
              <Link href="/projects" className="btn-ghost">
                See projects →
              </Link>
              <span className="mx-1 hidden sm:inline" style={{ color: "var(--g5)" }}>·</span>
              <a href={LINKS.github} target="_blank" rel="noopener" className="link-dim text-[13px]">GitHub</a>
              <a href={LINKS.linkedin} target="_blank" rel="noopener" className="link-dim text-[13px]">LinkedIn</a>
              <button onClick={copyEmail} className="link-dim text-[13px]">{copied ? "Copied ✓" : "Email"}</button>
            </div>
          </FadeUp>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.8 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="font-label text-[9px]" style={{ color: "var(--g6)" }}>scroll</span>
          <span className="relative block w-[17px] h-[26px] rounded-full" style={{ border: "1px solid var(--g5)" }}>
            <span className="scrollcue-dot absolute left-1/2 top-1.5 -translate-x-1/2 w-1 h-1 rounded-full" style={{ background: "var(--g7)" }} />
          </span>
        </motion.div>
      </section>

      {/* Skills marquee */}
      <div className="relative z-10 py-5 marquee-mask" style={{ borderTop: "1px solid var(--g2)", borderBottom: "1px solid var(--g2)" }}>
        <div className="marquee-track">
          {[0, 1].map((dup) => (
            <div key={dup} className="flex shrink-0" aria-hidden={dup === 1}>
              {SKILLS.map((s) => (
                <span key={s} className="px-6 text-[13px] font-mono whitespace-nowrap" style={{ color: "var(--g7)" }}>
                  {s}
                  <span className="ml-6" style={{ color: "var(--g4)" }}>/</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <section className="relative z-10 max-w-[1160px] mx-auto px-6 py-24">
        <div className="grid grid-cols-3 gap-6">
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08}>
              <div>
                <div
                  className="font-serif leading-none"
                  style={{ fontSize: "clamp(2.75rem, 1.9rem + 3.4vw, 4.75rem)", color: "var(--g12)", fontWeight: 400 }}
                >
                  {s.n}
                </div>
                <div className="font-label mt-3 text-[10px]" style={{ color: "var(--g7)" }}>
                  {s.label}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Selected work */}
      <section className="relative z-10 max-w-[1160px] mx-auto px-6 pb-24">
        <Reveal>
          <div className="flex items-end justify-between mb-9">
            <h2
              className="font-display"
              style={{ fontSize: "clamp(1.75rem, 1.3rem + 1.8vw, 2.5rem)", fontWeight: 400, letterSpacing: "-0.03em", color: "var(--g12)" }}
            >
              Selected work
            </h2>
            <Link href="/projects" className="link-dim text-[13px] mb-1.5">All projects →</Link>
          </div>
        </Reveal>

        <div className="grid sm:grid-cols-2 gap-px" style={{ background: "var(--g3)", border: "1px solid var(--g3)", borderRadius: 16, overflow: "hidden" }}>
          {PROJECTS.map((p, i) => (
            <Reveal key={p.slug} delay={(i % 2) * 0.07}>
              <Link href="/projects" className="proj-card group block h-full p-7">
                <div className="flex items-start justify-between">
                  <span className="font-label text-[10px]" style={{ color: "var(--g6)" }}>0{i + 1}</span>
                  <span className="text-[14px] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" style={{ color: "var(--g8)" }}>↗</span>
                </div>
                <h3 className="font-display mt-5 text-[20px]" style={{ fontWeight: 400, letterSpacing: "-0.02em", color: "var(--g12)" }}>
                  {p.name}
                </h3>
                <p className="mt-2.5 text-[13px]" style={{ color: "var(--g8)", lineHeight: 1.65 }}>
                  {p.tagline}
                </p>
                <div className="mt-5 flex flex-wrap gap-1.5">
                  {p.stack.slice(0, 4).map((t) => (
                    <span key={t} className="text-[10px] font-mono px-1.5 py-0.5 rounded" style={{ color: "var(--g7)", border: "1px solid var(--g4)" }}>{t}</span>
                  ))}
                  {p.stack.length > 4 && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5" style={{ color: "var(--g6)" }}>+{p.stack.length - 4}</span>
                  )}
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Now + snapshot */}
      <section className="relative z-10 max-w-[1160px] mx-auto px-6 pb-24 grid lg:grid-cols-2 gap-5">
        <Reveal>
          <div className="rounded-2xl h-full overflow-hidden" style={{ border: "1px solid var(--g3)", background: "var(--g1)" }}>
            <div className="px-6 py-3.5 flex items-center gap-2.5" style={{ borderBottom: "1px solid var(--g3)" }}>
              <span className="inline-block h-[6px] w-[6px] rounded-full" style={{ background: "var(--accent)" }} />
              <span className="font-label text-[10px]" style={{ color: "var(--g7)" }}>now — Sep 2026</span>
            </div>
            {NOW.map((item) => (
              <div key={item.label} className="flex items-baseline gap-5 px-6 py-4" style={{ borderTop: "1px solid var(--g2)" }}>
                <span className="font-label text-[9px] w-14 shrink-0" style={{ color: "var(--accent)" }}>{item.label}</span>
                <span className="text-[14px]" style={{ color: "var(--g10)" }}>{item.value}</span>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="rounded-2xl p-6 h-full" style={{ border: "1px solid var(--g3)", background: "var(--g1)" }}>
            <p className="font-label text-[10px] mb-5" style={{ color: "var(--g6)" }}>recently</p>
            <div className="space-y-3.5">
              {EXPERIENCE.slice(0, 3).map((r) => (
                <div key={r.company} className="flex items-baseline justify-between gap-3">
                  <span className="text-[14px]" style={{ color: "var(--g11)" }}>{r.company}</span>
                  <span className="text-[11px] font-mono shrink-0" style={{ color: "var(--g6)" }}>{r.period.split("–")[0].trim()}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 flex flex-wrap gap-1.5" style={{ borderTop: "1px solid var(--g3)" }}>
              {INTERESTS.map((t) => (
                <span key={t} className="text-[11px] px-2.5 py-1 rounded-full" style={{ color: "var(--g8)", border: "1px solid var(--g4)" }}>{t}</span>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      {/* Contact */}
      <section className="relative z-10 max-w-[1160px] mx-auto px-6 pb-28">
        <Reveal>
          <div className="rounded-3xl p-10 sm:p-16 text-center" style={{ border: "1px solid var(--g3)", background: "var(--g1)" }}>
            <h2
              className="font-display"
              style={{ fontSize: "clamp(1.9rem, 1.3rem + 2.6vw, 3.25rem)", fontWeight: 400, letterSpacing: "-0.03em", color: "var(--g12)" }}
            >
              Let&rsquo;s build something.
            </h2>
            <p className="mt-4 text-[15px]" style={{ color: "var(--g8)" }}>
              Open to co-op roles and interesting problems. Fastest way to reach me:
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <button onClick={copyEmail} className="btn-fill">{copied ? "Copied ✓" : LINKS.email}</button>
              <a href={LINKS.linkedin} target="_blank" rel="noopener" className="btn-ghost">LinkedIn ↗</a>
              <a href={LINKS.github} target="_blank" rel="noopener" className="btn-ghost">GitHub ↗</a>
            </div>
          </div>
        </Reveal>
      </section>

      <footer className="relative z-10 max-w-[1160px] mx-auto px-6 pb-10">
        <p className="font-label text-[9px]" style={{ color: "var(--g6)" }}>
          © {new Date().getFullYear()} Aarnav Noble — press g · l · r · e
        </p>
      </footer>
    </div>
  );
}
