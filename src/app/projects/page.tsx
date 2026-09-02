"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { PROJECTS, LINKS } from "@/lib/data";
import { Reveal, Words, ScrollProgress } from "@/components/motion-lib";
import { ShaderField } from "@/components/ShaderField";
import { RoamDemo } from "./RoamDemo";
import { DothrakiDemo } from "./DothrakiDemo";
import { VestigeDemo } from "./VestigeDemo";

const PROJECT_ACCENTS = ["#6c8ebf", "#34d399", "#E8A33D", "#ef4444"];
// Order must track PROJECTS in src/lib/data.ts: vestige, roam, dothraki-asr, flame-forecaster
const PROJECT_DEMOS = [VestigeDemo, RoamDemo, DothrakiDemo, undefined];

function Pipeline({ steps, accent }: { steps: typeof PROJECTS[0]["pipeline"]; accent: string }) {
  return (
    <div className="my-5 rounded-2xl overflow-hidden" style={{ border: "1px solid var(--g3)" }}>
      <div
        className="px-4 py-2 flex items-center gap-2"
        style={{ background: "var(--g2)", borderBottom: "1px solid var(--g3)" }}
      >
        <div className="w-1 h-1 rounded-full" style={{ background: accent }} />
        <span className="text-[10px] uppercase tracking-[0.12em] font-mono font-medium" style={{ color: "var(--g6)" }}>
          Pipeline
        </span>
      </div>
      {steps.map((s, i) => (
        <div
          key={s.step}
          className="flex items-center gap-4 px-4 py-2.5"
          style={{
            borderBottom: i < steps.length - 1 ? "1px solid var(--g3)" : "none",
            background: "var(--g1)",
          }}
        >
          <span className="text-[10px] font-mono w-5 shrink-0 tabular-nums" style={{ color: "var(--g5)" }}>
            {String(i + 1).padStart(2, "0")}
          </span>
          <span className="text-[12px] font-medium w-36 shrink-0" style={{ color: "var(--g10)" }}>
            {s.step}
          </span>
          <span
            className="text-[10px] font-mono px-1.5 py-0.5 rounded"
            style={{ color: "var(--g7)", background: "var(--g3)", border: "1px solid var(--g4)" }}
          >
            {s.tech}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function Projects() {
  return (
    <div className="grain relative min-h-screen overflow-x-clip">
      <ScrollProgress />
      <ShaderField />

      {/* Nav */}
      <motion.nav
        initial={{ y: -16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-40"
      >
        <div
          className="max-w-[1160px] mx-auto mt-3 px-4 h-11 rounded-full flex items-center justify-between"
          style={{ background: "rgba(10,12,10,0.42)", border: "1px solid var(--g3)", backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)" }}
        >
          <Link href="/" className="link-dim text-[13px] pl-2">← Aarnav Noble</Link>
          <div className="flex items-center gap-6 text-[13px] pr-1">
            <Link href="/work" className="link-dim">Work</Link>
            <a href={LINKS.resume} target="_blank" rel="noopener" className="link-dim hidden sm:inline">Résumé</a>
            <a href={LINKS.github} target="_blank" rel="noopener" className="link-dim hidden sm:inline">GitHub</a>
          </div>
        </div>
      </motion.nav>

      <main className="relative z-10 max-w-[1160px] mx-auto px-6 pt-28 pb-24 w-full">

        <Reveal>
          <div className="mb-16">
            <p className="font-label text-[10px] mb-3" style={{ color: "var(--g6)" }}>
              Selected work
            </p>
            <h1
              className="font-display"
              style={{ fontSize: "clamp(2.5rem, 1.8rem + 3vw, 4rem)", fontWeight: 400, letterSpacing: "-0.03em", lineHeight: 1, color: "var(--g12)" }}
            >
              <Words text="Projects" />
              <span style={{ color: "var(--accent)" }}>.</span>
            </h1>
          </div>
        </Reveal>

        <div>
          {PROJECTS.map((project, i) => {
            const accent = PROJECT_ACCENTS[i] ?? PROJECT_ACCENTS[0];
            const Demo = PROJECT_DEMOS[i];
            return (
              <Reveal key={project.slug} delay={i * 0.05}>
                <div>
                  {/* Project header */}
                  <div className="flex items-baseline justify-between gap-4 mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-0.5 rounded-full" style={{ background: accent }} />
                      <h2 className="text-[24px] sm:text-[28px] font-display tracking-[-0.02em]" style={{ fontWeight: 400, color: "var(--g12)" }}>
                        {project.name}
                      </h2>
                    </div>
                    <div className="flex items-center gap-4 shrink-0">
                      {project.demo && (
                        <a href={project.demo} target="_blank" rel="noopener" className="link-dim text-[12px]">
                          {project.github ? "Demo ↗" : "Site ↗"}
                        </a>
                      )}
                      {project.github && (
                        <a href={project.github} target="_blank" rel="noopener" className="link-dim text-[12px]">
                          GitHub ↗
                        </a>
                      )}
                    </div>
                  </div>

                  <p className="text-[13px] leading-relaxed mb-1 ml-9" style={{ color: "var(--g7)" }}>
                    {project.tagline}
                  </p>

                  <div className="ml-9">
                    <Pipeline steps={project.pipeline} accent={accent} />

                    {Demo && <Demo />}

                    <div className="flex flex-wrap gap-1.5 mt-4">
                      {project.stack.map(t => (
                        <span
                          key={t}
                          className="text-[11px] font-mono px-2 py-0.5 rounded"
                          style={{ color: "var(--g7)", background: "var(--g2)", border: "1px solid var(--g3)" }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {i < PROJECTS.length - 1 && (
                    <div className="my-16" style={{ borderBottom: "1px solid var(--g3)" }} />
                  )}
                </div>
              </Reveal>
            );
          })}
        </div>
      </main>

      <footer className="relative z-10 max-w-[1160px] mx-auto px-6 pb-10 w-full">
        <p className="font-label text-[9px]" style={{ color: "var(--g6)" }}>
          © {new Date().getFullYear()} Aarnav Noble
        </p>
      </footer>
    </div>
  );
}
