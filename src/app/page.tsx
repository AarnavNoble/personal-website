"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { LINKS, PROJECTS, EXPERIENCE } from "@/lib/data";

// ─── Data ─────────────────────────────────────────────────────────────────
const NOW = [
  { label: "building", value: "voice AI infrastructure · AethexAI, London" },
  { label: "studying", value: "Computer Engineering · University of Waterloo" },
];

const INTERESTS = ["photography", "film", "soccer", "MMA", "tennis", "travel"];

// ─── Page ─────────────────────────────────────────────────────────────────
export default function Home() {
  const [copied, setCopied] = useState(false);
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);
  const photoRef = useRef<HTMLDivElement>(null);

  function onPhotoMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = photoRef.current;
    if (!el) return;
    const { left, top, width, height } = el.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5;
    const y = (e.clientY - top) / height - 0.5;
    el.style.transform = `perspective(800px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) scale(1.02)`;
  }

  function onPhotoLeave() {
    if (photoRef.current)
      photoRef.current.style.transform = "perspective(800px) rotateY(0deg) rotateX(0deg) scale(1)";
  }

  const PROJECT_ACCENTS = ["#6c8ebf", "#34d399", "#E8A33D", "#ef4444"];

  function copyEmail() {
    navigator.clipboard.writeText(LINKS.email).then(() => {
      setCopied(true); setTimeout(() => setCopied(false), 2000);
    });
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement || e.metaKey || e.ctrlKey) return;
      if (e.key === "g") window.open(LINKS.github, "_blank");
      if (e.key === "l") window.open(LINKS.linkedin, "_blank");
      if (e.key === "e") copyEmail();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen flex flex-col" style={{ position: "relative" }}>

      {/* bg */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden" style={{ zIndex: 1 }}>
        <div style={{
          position: "absolute", top: "-200px", left: "0%", width: "55%", height: "600px",
          background: "radial-gradient(ellipse, rgba(108,142,191,0.06) 0%, transparent 65%)",
          filter: "blur(90px)",
        }} />
      </div>

      <div className="blur-fade" style={{ zIndex: 10 }} />

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-20">
        <div className="max-w-[1200px] mx-auto px-10 h-14 flex items-center justify-between">
          <Link href="/" className="font-display font-[800] text-[14px] tracking-[0.1em]" style={{ color: "var(--accent)" }}>
            AN
          </Link>
          <div className="flex items-center gap-7">
            <Link href="/work"     className="link-dim text-[14px]">Work</Link>
            <Link href="/projects" className="link-dim text-[14px]">Projects</Link>
            <a href={LINKS.github} target="_blank" rel="noopener" className="link-dim text-[14px]">GitHub</a>
            <kbd
              className="hidden sm:flex items-center gap-1 text-[11px] font-mono px-2 py-1 rounded cursor-pointer transition-colors"
              style={{ color: "var(--g6)", background: "var(--g2)", border: "1px solid var(--g4)" }}
              onClick={() => window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true, bubbles: true }))}
            >
              <span>⌘</span><span>K</span>
            </kbd>
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-[1200px] mx-auto px-10 w-full pt-28 pb-28" style={{ position: "relative", zIndex: 2 }}>

        {/* ── Hero: two columns ─────────────────────────────────── */}
        <section className="grid grid-cols-1 lg:grid-cols-[1fr_500px] gap-12 items-center mb-20">

          <div>
            <div data-animate style={{ "--stagger": 0 } as React.CSSProperties} className="flex items-center gap-2 mb-7">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-50" style={{ background: "var(--accent)" }} />
                <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: "var(--accent)" }} />
              </span>
              <span className="text-[12px] font-mono" style={{ color: "var(--g6)" }}>London, UK · on co-op</span>
            </div>

            <h1
              data-animate
              style={{ "--stagger": 1, color: "var(--g12)" } as React.CSSProperties}
              className="font-display font-[700] text-[52px] sm:text-[64px] tracking-[-0.025em] leading-[1.08] mb-6"
            >
              Aarnav Noble
            </h1>

            <p data-animate style={{ "--stagger": 2, color: "var(--g7)" } as React.CSSProperties} className="text-[17px] leading-[1.8] mb-8">
              Computer Engineering at Waterloo. I build things at the
              intersection of ML and systems, currently voice AI infrastructure,
              previously climate research and satellite firmware.
            </p>

            <div data-animate style={{ "--stagger": 3 } as React.CSSProperties} className="flex flex-wrap gap-2 mb-9">
              {INTERESTS.map(i => (
                <span key={i} className="text-[13px] px-3 py-1 rounded-full"
                  style={{ color: "var(--g7)", background: "var(--g2)", border: "1px solid var(--g3)" }}>
                  {i}
                </span>
              ))}
            </div>

            <div data-animate style={{ "--stagger": 4 } as React.CSSProperties} className="flex flex-wrap gap-x-6 gap-y-2 text-[15px]">
              <Link href="/work"     className="link font-medium">Work →</Link>
              <Link href="/projects" className="link font-medium">Projects →</Link>
              <span style={{ color: "var(--g4)" }}>·</span>
              <a href={LINKS.github}   target="_blank" rel="noopener" className="link-dim">GitHub ↗</a>
              <a href={LINKS.linkedin} target="_blank" rel="noopener" className="link-dim">LinkedIn ↗</a>
              <button onClick={copyEmail} className="link-dim">{copied ? "Copied ✓" : "Email"}</button>
            </div>
          </div>

          {/* Photo */}
          <div
            data-animate
            style={{ "--stagger": 2 } as React.CSSProperties}
            className="hidden lg:block"
          >
            <div
              ref={photoRef}
              onMouseMove={onPhotoMove}
              onMouseLeave={onPhotoLeave}
              style={{ transition: "transform 0.15s ease", transformStyle: "preserve-3d", borderRadius: "1rem" }}
            >
              <img
                src="/avatar.jpeg"
                alt="Aarnav Noble"
                className="w-full rounded-2xl object-contain"
                style={{ border: "1px solid var(--g3)", background: "var(--g1)", display: "block" }}
              />
            </div>
          </div>
        </section>

        {/* ── Now card ──────────────────────────────────────────── */}
        <section data-animate style={{ "--stagger": 5 } as React.CSSProperties} className="mb-20">
          <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--g3)" }}>
            <div className="px-5 py-3 flex items-center gap-2.5" style={{ background: "var(--g2)", borderBottom: "1px solid var(--g3)" }}>
              <span className="relative flex h-1.5 w-1.5 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60" style={{ background: "var(--accent)" }} />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5" style={{ background: "var(--accent)" }} />
              </span>
              <span className="text-[12px] font-mono" style={{ color: "var(--g6)" }}>now · May 2026</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2" style={{ background: "var(--g1)" }}>
              {NOW.map((item, i) => (
                <div key={item.label} className="flex items-baseline gap-4 px-5 py-3.5"
                  style={{ borderRight: i % 2 === 0 ? "1px solid var(--g3)" : "none" }}>
                  <span className="text-[10px] font-mono uppercase tracking-wider w-20 shrink-0" style={{ color: "var(--accent)" }}>
                    {item.label}
                  </span>
                  <span className="text-[14px]" style={{ color: "var(--g8)" }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Projects teaser ───────────────────────────────────── */}
        <section data-animate style={{ "--stagger": 6 } as React.CSSProperties} className="mb-20">
          <div className="flex items-baseline justify-between mb-5">
            <p className="text-[11px] font-mono uppercase tracking-[0.12em]" style={{ color: "var(--g5)" }}>Projects</p>
            <Link href="/projects" className="link-dim text-[13px]">All projects →</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {PROJECTS.map((p, i) => {
              const accent = PROJECT_ACCENTS[i];
              const hovered = hoveredProject === i;
              return (
                <Link
                  key={p.slug}
                  href="/projects"
                  className="block rounded-xl overflow-hidden"
                  style={{
                    border: `1px solid ${hovered ? `${accent}50` : "var(--g3)"}`,
                    background: hovered ? `${accent}08` : "var(--g1)",
                    boxShadow: hovered ? `0 0 0 1px ${accent}18, 0 12px 32px rgba(0,0,0,0.25)` : "none",
                    transition: "border-color 0.2s, background 0.2s, box-shadow 0.2s",
                  }}
                  onMouseEnter={() => setHoveredProject(i)}
                  onMouseLeave={() => setHoveredProject(null)}
                >
                  {/* Accent bar */}
                  <div style={{
                    height: 2,
                    background: `linear-gradient(90deg, ${accent}, transparent)`,
                    opacity: hovered ? 1 : 0.3,
                    transition: "opacity 0.2s",
                  }} />

                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <span className="block text-[10px] font-mono mb-1" style={{ color: accent, opacity: hovered ? 1 : 0.6, transition: "opacity 0.2s" }}>0{i + 1}</span>
                        <span className="text-[16px] font-display font-[700] tracking-tight" style={{ color: "var(--g12)" }}>{p.name}</span>
                      </div>
                      <span style={{
                        color: accent,
                        fontSize: 16,
                        opacity: hovered ? 1 : 0,
                        transform: hovered ? "translate(2px, -2px)" : "translate(0, 0)",
                        transition: "opacity 0.2s, transform 0.2s",
                      }}>↗</span>
                    </div>

                    <p className="text-[13px] leading-relaxed mb-4" style={{ color: "var(--g6)" }}>{p.tagline}</p>

                    <div className="flex flex-wrap gap-1.5">
                      {p.stack.slice(0, 4).map(t => (
                        <span key={t} className="text-[10px] font-mono px-1.5 py-0.5 rounded"
                          style={{
                            color: hovered ? accent : "var(--g6)",
                            background: hovered ? `${accent}12` : "var(--g2)",
                            border: `1px solid ${hovered ? `${accent}30` : "var(--g3)"}`,
                            transition: "color 0.2s, background 0.2s, border-color 0.2s",
                          }}>{t}</span>
                      ))}
                      {p.stack.length > 4 && (
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded" style={{ color: "var(--g5)" }}>+{p.stack.length - 4}</span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* ── Background ────────────────────────────────────────── */}
        <section
          data-animate
          style={{ "--stagger": 7, borderTop: "1px solid var(--g3)" } as React.CSSProperties}
          className="pt-12 grid grid-cols-1 sm:grid-cols-3 gap-x-12 gap-y-10"
        >
          <div>
            <p className="text-[11px] font-mono uppercase tracking-[0.12em] mb-5" style={{ color: "var(--g5)" }}>Work</p>
            <div className="space-y-3">
              {EXPERIENCE.map(r => (
                <div key={r.company}>
                  <p className="text-[14px] font-medium" style={{ color: "var(--g10)" }}>{r.company}</p>
                  <p className="text-[12px]" style={{ color: "var(--g6)" }}>{r.role.split(",")[0]} · {r.period.split("–")[0].trim()}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[11px] font-mono uppercase tracking-[0.12em] mb-5" style={{ color: "var(--g5)" }}>Education</p>
            <p className="text-[14px] font-medium mb-1" style={{ color: "var(--g10)" }}>University of Waterloo</p>
            <p className="text-[13px] mb-0.5" style={{ color: "var(--g7)" }}>BASc Computer Engineering</p>
            <p className="text-[12px] font-mono" style={{ color: "var(--g5)" }}>2023 – 2028</p>
          </div>

          <div>
            <p className="text-[11px] font-mono uppercase tracking-[0.12em] mb-5" style={{ color: "var(--g5)" }}>Contact</p>
            <div className="space-y-2 text-[14px]">
              <div><a href={LINKS.github}   target="_blank" rel="noopener" className="link-dim">GitHub ↗</a></div>
              <div><a href={LINKS.linkedin} target="_blank" rel="noopener" className="link-dim">LinkedIn ↗</a></div>
              <div><button onClick={copyEmail} className="link-dim">{copied ? "Copied ✓" : LINKS.email}</button></div>
            </div>
          </div>
        </section>

      </main>

      <footer className="max-w-[1200px] mx-auto px-10 pb-10 w-full" style={{ position: "relative", zIndex: 2 }}>
        <p className="text-[11px] font-mono" style={{ color: "var(--g5)" }}>
          g · l · e · GitHub · LinkedIn · Email
        </p>
      </footer>
    </div>
  );
}
