"use client";

import Link from "next/link";
import { PROJECTS, LINKS } from "@/lib/data";
import { RoamDemo } from "./RoamDemo";
import { DothrakiDemo } from "./DothrakiDemo";
import { VestigeDemo } from "./VestigeDemo";

const PROJECT_ACCENTS = ["#6c8ebf", "#34d399", "#E8A33D", "#ef4444"];
const PROJECT_DEMOS = [RoamDemo, DothrakiDemo, VestigeDemo, undefined];

function Pipeline({ steps, accent }: { steps: typeof PROJECTS[0]["pipeline"]; accent: string }) {
  return (
    <div className="my-5 rounded-xl overflow-hidden" style={{ border: "1px solid var(--g3)" }}>
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
    <div className="min-h-screen flex flex-col">
      <div className="blur-fade" />

      <nav className="fixed top-0 left-0 right-0 z-20">
        <div className="max-w-[1060px] mx-auto px-8 h-12 flex items-center justify-between">
          <Link href="/" className="link-dim text-[13px]">← Aarnav Noble</Link>
          <div className="flex items-center gap-5">
            <Link href="/work" className="link-dim text-[13px]">Work</Link>
            <a href={LINKS.resume} target="_blank" rel="noopener" className="link-dim text-[13px]">Résumé</a>
            <a href={LINKS.github} target="_blank" rel="noopener" className="link-dim text-[13px]">GitHub</a>
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-[1060px] mx-auto px-8 pt-24 pb-20 w-full">

        <div
          data-animate
          style={{ "--stagger": 0 } as React.CSSProperties}
          className="mb-14"
        >
          <p className="text-[10px] uppercase tracking-[0.14em] font-mono mb-2" style={{ color: "var(--g5)" }}>
            Selected work
          </p>
          <h1 className="font-display text-[36px] sm:text-[44px] font-[800] leading-tight tracking-[-0.02em]" style={{ color: "var(--g12)" }}>
            Projects<span style={{ color: "var(--accent)" }}>.</span>
          </h1>
        </div>

        <div>
          {PROJECTS.map((project, i) => {
            const accent = PROJECT_ACCENTS[i] ?? PROJECT_ACCENTS[0];
            const Demo = PROJECT_DEMOS[i];
            return (
              <div
                key={project.slug}
                data-animate
                style={{ "--stagger": i + 1 } as React.CSSProperties}
              >
                {/* Project header */}
                <div className="flex items-baseline justify-between gap-4 mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-0.5 rounded-full" style={{ background: accent }} />
                    <h2 className="text-[22px] font-display font-[700] tracking-tight" style={{ color: "var(--g12)" }}>
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
            );
          })}
        </div>
      </main>

      <footer className="max-w-[1060px] mx-auto px-8 pb-8 w-full">
        <p className="text-[11px] font-mono" style={{ color: "var(--g5)" }}>
          © {new Date().getFullYear()} Aarnav Noble
        </p>
      </footer>
    </div>
  );
}
