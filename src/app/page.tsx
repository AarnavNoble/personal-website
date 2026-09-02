"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { LINKS, PROJECTS, EXPERIENCE } from "@/lib/data";
import { MinimalBackground } from "@/components/MinimalBackground";
import { Cursor } from "@/components/Cursor";
import {
  Reveal,
  AnimatedName,
  Words,
  Magnetic,
  CountUp,
  TiltCard,
} from "@/components/motion-lib";

const SKILLS = [
  "Python", "Go", "TypeScript", "C / C++", "React", "Next.js", "FastAPI",
  "PyTorch", "Kubernetes", "Docker", "Terraform", "AWS", "PostgreSQL",
  "ClickHouse", "GraphQL", "WebRTC", "OpenTelemetry", "Linux",
];

const STATS = [
  { n: 4, suffix: "", label: "internships shipped" },
  { n: 3, suffix: "", label: "systems built from scratch" },
  { n: 2028, suffix: "", label: "class of" },
];

const NOW = [
  { label: "studying", value: "Computer Engineering · University of Waterloo" },
  { label: "open to", value: "SWE / ML-infra co-op · Winter 2027" },
];

const INTERESTS = ["photography", "film", "soccer", "MMA", "tennis", "travel"];
const ACCENTS = ["#6c8ebf", "#b98bd8", "#34d399", "#e8a33d"];

export default function Home() {
  const [copied, setCopied] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const photoY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const heroFade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

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
      <MinimalBackground />
      <Cursor />

      {/* Nav */}
      <motion.nav
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-40"
      >
        <div
          className="max-w-[1180px] mx-auto my-3 px-5 h-12 flex items-center justify-between rounded-full"
          style={{ background: "rgba(13,13,13,0.55)", border: "1px solid var(--g3)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
        >
          <Link href="/" className="font-display font-[600] text-[14px] tracking-[0.14em]" style={{ color: "var(--g12)" }}>
            AN
          </Link>
          <div className="flex items-center gap-6 text-[13px]">
            <Link href="/work" className="link-dim">Work</Link>
            <Link href="/projects" className="link-dim">Projects</Link>
            <a href={LINKS.resume} target="_blank" rel="noopener" className="link-dim hidden sm:inline">Résumé</a>
            <a href={LINKS.github} target="_blank" rel="noopener" className="link-dim hidden sm:inline">GitHub</a>
            <kbd
              className="hidden sm:flex items-center gap-1 text-[11px] font-mono px-2 py-1 rounded cursor-pointer"
              style={{ color: "var(--g7)", background: "var(--g2)", border: "1px solid var(--g4)" }}
              onClick={() => window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true, bubbles: true }))}
            >
              ⌘K
            </kbd>
          </div>
        </div>
      </motion.nav>

      {/* Hero */}
      <motion.section
        ref={heroRef}
        style={{ opacity: heroFade }}
        className="relative z-10 max-w-[1180px] mx-auto px-6 min-h-[100svh] flex flex-col justify-center pt-24 pb-16"
      >
        <div className="grid lg:grid-cols-[1fr_auto] gap-10 items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="inline-flex items-center gap-2 mb-8 px-3 py-1.5 rounded-full text-[12px] font-mono"
              style={{ color: "var(--g8)", background: "var(--g2)", border: "1px solid var(--g3)" }}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60" style={{ background: "var(--accent)" }} />
                <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: "var(--accent)" }} />
              </span>
              Waterloo, ON · back on campus
            </motion.div>

            <AnimatedName text="Aarnav Noble" />

            <Words
              text="I like making things that work, and understanding the ones that don't."
              delay={0.6}
              className="mt-6 max-w-[34ch] text-[16px] sm:text-[19px] leading-[1.6] [color:var(--g9)]"
            />

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.15, duration: 0.6 }}
              className="mt-10 flex flex-wrap items-center gap-3"
            >
              <Magnetic>
                <a
                  href={LINKS.resume}
                  target="_blank"
                  rel="noopener"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-[14px] font-medium"
                  style={{ background: "var(--accent)", color: "#0a0a0a" }}
                >
                  Résumé ↗
                </a>
              </Magnetic>
              <Magnetic>
                <Link
                  href="/projects"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-[14px] font-medium"
                  style={{ border: "1px solid var(--g4)", color: "var(--g11)" }}
                >
                  See projects →
                </Link>
              </Magnetic>
              <div className="flex items-center gap-4 text-[13px] ml-1">
                <a href={LINKS.github} target="_blank" rel="noopener" className="link-dim">GitHub</a>
                <a href={LINKS.linkedin} target="_blank" rel="noopener" className="link-dim">LinkedIn</a>
                <button onClick={copyEmail} className="link-dim">{copied ? "Copied ✓" : "Email"}</button>
              </div>
            </motion.div>
          </div>

          {/* Photo */}
          <motion.div
            style={{ y: photoY }}
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="hidden lg:block w-[300px]"
          >
            <TiltCard max={10} className="rounded-2xl overflow-hidden" style={{ border: "1px solid var(--g3)", boxShadow: "0 30px 80px -20px rgba(0,0,0,0.7)" }}>
              <img src="/avatar.jpeg" alt="Aarnav Noble" className="w-full block" style={{ background: "var(--g1)" }} />
            </TiltCard>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-[10px] font-mono tracking-[0.2em] uppercase" style={{ color: "var(--g6)" }}>scroll</span>
          <span className="relative block w-[18px] h-[28px] rounded-full" style={{ border: "1px solid var(--g5)" }}>
            <span className="scrollcue-dot absolute left-1/2 top-1.5 -translate-x-1/2 w-1 h-1 rounded-full" style={{ background: "var(--g8)" }} />
          </span>
        </motion.div>
      </motion.section>

      {/* Skills marquee */}
      <div className="relative z-10 py-6 marquee-mask" style={{ borderTop: "1px solid var(--g2)", borderBottom: "1px solid var(--g2)" }}>
        <div className="marquee-track">
          {[0, 1].map((dup) => (
            <div key={dup} className="flex shrink-0" aria-hidden={dup === 1}>
              {SKILLS.map((s) => (
                <span key={s} className="px-6 text-[14px] font-mono whitespace-nowrap" style={{ color: "var(--g7)" }}>
                  {s}<span className="ml-6" style={{ color: "var(--g4)" }}>/</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <section className="relative z-10 max-w-[1180px] mx-auto px-6 py-24">
        <div className="grid grid-cols-3 gap-6">
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08}>
              <div className="text-center sm:text-left">
                <div className="font-display font-[600] text-[44px] sm:text-[60px] leading-none tracking-[-0.02em]" style={{ color: "var(--g12)" }}>
                  <CountUp to={s.n} suffix={s.suffix} />
                </div>
                <div className="mt-2 text-[12px] sm:text-[13px] font-mono" style={{ color: "var(--g7)" }}>
                  {s.label}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Selected work */}
      <section className="relative z-10 max-w-[1180px] mx-auto px-6 pb-24">
        <Reveal>
          <div className="flex items-end justify-between mb-8">
            <h2 className="font-display font-[600] text-[26px] sm:text-[34px] tracking-[-0.02em]" style={{ color: "var(--g12)" }}>
              Selected work<span style={{ color: "var(--accent)" }}>.</span>
            </h2>
            <Link href="/projects" className="link-dim text-[13px] mb-2">All projects →</Link>
          </div>
        </Reveal>

        <div className="grid sm:grid-cols-2 gap-5">
          {PROJECTS.map((p, i) => {
            const accent = ACCENTS[i % ACCENTS.length];
            return (
              <Reveal key={p.slug} delay={(i % 2) * 0.08} className="h-full">
                <Link href="/projects" data-cursor className="block h-full">
                  <TiltCard
                    max={5}
                    className="group relative h-full rounded-2xl p-6 transition-colors"
                    style={{ background: "var(--g1)", border: "1px solid var(--g3)" }}
                  >
                    <div
                      className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ boxShadow: `inset 0 0 0 1px ${accent}55, 0 22px 60px -24px ${accent}66` }}
                    />
                    <div className="relative flex items-start justify-between">
                      <div>
                        <span className="block text-[10px] font-mono mb-1" style={{ color: accent }}>0{i + 1}</span>
                        <span className="font-display font-[700] text-[19px] tracking-tight" style={{ color: "var(--g12)" }}>{p.name}</span>
                      </div>
                      <span className="text-[15px] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" style={{ color: accent }}>↗</span>
                    </div>
                    <p className="relative mt-3 text-[13px] leading-relaxed" style={{ color: "var(--g7)" }}>
                      {p.tagline}
                    </p>
                    <div className="relative mt-4 flex flex-wrap gap-1.5">
                      {p.stack.slice(0, 4).map((t) => (
                        <span key={t} className="text-[10px] font-mono px-1.5 py-0.5 rounded" style={{ color: "var(--g6)", background: "var(--g2)", border: "1px solid var(--g3)" }}>{t}</span>
                      ))}
                      {p.stack.length > 4 && (
                        <span className="text-[10px] font-mono px-1.5 py-0.5" style={{ color: "var(--g5)" }}>+{p.stack.length - 4}</span>
                      )}
                    </div>
                  </TiltCard>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* Now + snapshot */}
      <section className="relative z-10 max-w-[1180px] mx-auto px-6 pb-24 grid lg:grid-cols-[1fr_1fr] gap-6">
        <Reveal>
          <div className="rounded-2xl overflow-hidden h-full" style={{ border: "1px solid var(--g3)" }}>
            <div className="px-5 py-3 flex items-center gap-2.5" style={{ background: "var(--g2)", borderBottom: "1px solid var(--g3)" }}>
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60" style={{ background: "var(--accent)" }} />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5" style={{ background: "var(--accent)" }} />
              </span>
              <span className="text-[12px] font-mono" style={{ color: "var(--g6)" }}>now · Sep 2026</span>
            </div>
            <div style={{ background: "var(--g1)" }}>
              {NOW.map((item) => (
                <div key={item.label} className="flex items-baseline gap-4 px-5 py-3.5" style={{ borderTop: "1px solid var(--g2)" }}>
                  <span className="text-[10px] font-mono uppercase tracking-wider w-16 shrink-0" style={{ color: "var(--accent)" }}>{item.label}</span>
                  <span className="text-[14px]" style={{ color: "var(--g9)" }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="rounded-2xl p-5 h-full" style={{ border: "1px solid var(--g3)", background: "var(--g1)" }}>
            <p className="text-[11px] font-mono uppercase tracking-[0.12em] mb-4" style={{ color: "var(--g5)" }}>Recently</p>
            <div className="space-y-3">
              {EXPERIENCE.slice(0, 3).map((r) => (
                <div key={r.company} className="flex items-baseline justify-between gap-3">
                  <span className="text-[14px]" style={{ color: "var(--g10)" }}>{r.company}</span>
                  <span className="text-[11px] font-mono shrink-0" style={{ color: "var(--g6)" }}>{r.period.split("–")[0].trim()}</span>
                </div>
              ))}
            </div>
            <div className="mt-5 pt-4 flex flex-wrap gap-1.5" style={{ borderTop: "1px solid var(--g3)" }}>
              {INTERESTS.map((t) => (
                <span key={t} className="text-[11px] px-2.5 py-1 rounded-full" style={{ color: "var(--g7)", background: "var(--g2)", border: "1px solid var(--g3)" }}>{t}</span>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      {/* Contact */}
      <section className="relative z-10 max-w-[1180px] mx-auto px-6 pb-28">
        <Reveal>
          <div className="rounded-3xl p-10 sm:p-16 text-center" style={{ border: "1px solid var(--g3)", background: "var(--g1)" }}>
            <h2 className="font-display font-[600] text-[28px] sm:text-[44px] tracking-[-0.02em]" style={{ color: "var(--g12)" }}>
              Let&rsquo;s build something.
            </h2>
            <p className="mt-4 text-[15px]" style={{ color: "var(--g7)" }}>
              Open to co-op roles and interesting problems. The fastest way to reach me:
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Magnetic>
                <button
                  onClick={copyEmail}
                  data-cursor
                  className="px-5 py-2.5 rounded-full text-[14px] font-medium"
                  style={{ background: "var(--accent)", color: "#0a0a0a" }}
                >
                  {copied ? "Copied ✓" : LINKS.email}
                </button>
              </Magnetic>
              <Magnetic>
                <a href={LINKS.linkedin} target="_blank" rel="noopener" className="px-5 py-2.5 rounded-full text-[14px] font-medium" style={{ border: "1px solid var(--g4)", color: "var(--g11)" }}>
                  LinkedIn ↗
                </a>
              </Magnetic>
              <Magnetic>
                <a href={LINKS.github} target="_blank" rel="noopener" className="px-5 py-2.5 rounded-full text-[14px] font-medium" style={{ border: "1px solid var(--g4)", color: "var(--g11)" }}>
                  GitHub ↗
                </a>
              </Magnetic>
            </div>
          </div>
        </Reveal>
      </section>

      <footer className="relative z-10 max-w-[1180px] mx-auto px-6 pb-10">
        <p className="text-[11px] font-mono" style={{ color: "var(--g5)" }}>
          © {new Date().getFullYear()} Aarnav Noble · press g · l · r · e
        </p>
      </footer>
    </div>
  );
}
