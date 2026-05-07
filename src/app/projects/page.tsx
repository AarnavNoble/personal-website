"use client";

import Link from "next/link";
import { PROJECTS, LINKS } from "@/lib/data";
import { RoamDemo } from "./RoamDemo";
import { DothrakiDemo } from "./DothrakiDemo";

const PROJECT_ACCENTS = ["#3b82f6", "#8b5cf6"];
const PROJECT_DEMOS = [RoamDemo, DothrakiDemo];

function Pipeline({ steps }: { steps: typeof PROJECTS[0]["pipeline"] }) {
  return (
    <div className="my-5 rounded-lg overflow-hidden" style={{ border: "1px solid var(--g4)" }}>
      <div
        className="px-3 py-1.5 flex items-center"
        style={{ background: "var(--g2)", borderBottom: "1px solid var(--g4)" }}
      >
        <span className="text-[10px] uppercase tracking-widest font-medium" style={{ color: "var(--g6)" }}>
          Pipeline
        </span>
      </div>
      {steps.map((s, i) => (
        <div
          key={s.step}
          className="flex items-center gap-3 px-3 py-2"
          style={{ borderBottom: i < steps.length - 1 ? "1px solid var(--g3)" : "none" }}
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
        <div className="max-w-[620px] mx-auto px-6 h-11 flex items-center justify-between">
          <Link href="/" className="link-dim text-[13px]">← Aarnav Noble</Link>
          <div className="flex items-center gap-5">
            <Link href="/work" className="link-dim text-[13px]">Work</Link>
            <a href={LINKS.github} target="_blank" rel="noopener" className="link-dim text-[13px]">GitHub</a>
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-[620px] mx-auto px-6 pt-24 pb-20 w-full">
        <h1
          data-animate
          style={{ "--stagger": 0 } as React.CSSProperties}
          className="text-[13px] font-medium uppercase tracking-widest mb-14"
        >
          <span style={{ color: "var(--g8)" }}>Projects</span>
        </h1>

        <div>
          {PROJECTS.map((project, i) => {
            const accent = PROJECT_ACCENTS[i] ?? PROJECT_ACCENTS[0];
            return (
            <div
              key={project.slug}
              data-animate
              style={{ "--stagger": i + 1 } as React.CSSProperties}
            >
              <div
                className="w-8 h-0.5 rounded-full mb-4"
                style={{ background: accent }}
              />
              <div className="flex items-baseline justify-between gap-4 mb-1">
                <h2 className="text-[18px] font-semibold tracking-tight" style={{ color: "var(--g12)" }}>
                  {project.name}
                </h2>
                <div className="flex items-center gap-3 shrink-0">
                  {project.demo && (
                    <a href={project.demo} target="_blank" rel="noopener" className="link-dim text-[12px]">
                      Demo ↗
                    </a>
                  )}
                  <a href={project.github} target="_blank" rel="noopener" className="link-dim text-[12px]">
                    GitHub ↗
                  </a>
                </div>
              </div>

              <p className="text-[12px] mb-4" style={{ color: "var(--g8)" }}>
                {project.tagline}
              </p>

              <Pipeline steps={project.pipeline} />

              {(() => { const Demo = PROJECT_DEMOS[i]; return Demo ? <Demo /> : null; })()}

              <div className="flex flex-wrap gap-1.5 mt-4">
                {project.stack.map((t) => (
                  <span
                    key={t}
                    className="text-[11px] font-mono px-2 py-0.5 rounded"
                    style={{ color: "var(--g7)", background: "var(--g2)", border: "1px solid var(--g4)" }}
                  >
                    {t}
                  </span>
                ))}
              </div>

              {i < PROJECTS.length - 1 && (
                <div className="my-14" style={{ borderBottom: "1px solid var(--g3)" }} />
              )}
            </div>
            );
          })}
        </div>
      </main>

      <footer className="max-w-[620px] mx-auto px-6 pb-8 w-full">
        <p className="text-[11px]" style={{ color: "var(--g6)" }}>© {new Date().getFullYear()} Aarnav Noble</p>
      </footer>
    </div>
  );
}
