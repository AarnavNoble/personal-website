"use client";

import Link from "next/link";
import { useState } from "react";
import { EXPERIENCE, EDUCATION, LINKS } from "@/lib/data";

const ROLE_META = [
  {
    domain: "Voice AI · Infrastructure",
    highlight: "Built 100+ API endpoints and Kubernetes infrastructure running 500+ pods in production.",
    tags: ["AWS/EKS", "Kubernetes", "Terraform", "WebRTC", "Python"],
    color: "#6c8ebf",
  },
  {
    domain: "Climate ML",
    highlight: "5× spatial coverage improvement on Lake Erie forecasting using a basin-wide GNN.",
    tags: ["PyTorch", "GNN", "XGBoost", "Satellite data"],
    color: "#34d399",
  },
  {
    domain: "Systems · DevOps",
    highlight: "Automated OS deployment for 2,000+ devices, cutting imaging time by 50%.",
    tags: ["PXE boot", "Bash", "DSM", "IT systems"],
    color: "#9ca3af",
  },
  {
    domain: "Embedded · Aerospace",
    highlight: "Satellite thermal controller and I2C temperature sensor driver under FreeRTOS.",
    tags: ["C", "FreeRTOS", "STM32", "MATLAB/Simulink", "I2C"],
    color: "#a78bfa",
  },
];

export default function Work() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="blur-fade" />

      <nav className="fixed top-0 left-0 right-0 z-20">
        <div className="max-w-[1060px] mx-auto px-8 h-12 flex items-center justify-between">
          <Link href="/" className="link-dim text-[13px]">← Aarnav Noble</Link>
          <div className="flex items-center gap-5">
            <Link href="/projects" className="link-dim text-[13px]">Projects</Link>
            <a href={LINKS.github} target="_blank" rel="noopener" className="link-dim text-[13px]">GitHub</a>
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-[1060px] mx-auto px-8 pt-24 pb-20 w-full">

        <div data-animate style={{ "--stagger": 0 } as React.CSSProperties} className="mb-12">
          <p className="text-[10px] uppercase tracking-[0.14em] font-mono mb-2" style={{ color: "var(--g5)" }}>
            Experience
          </p>
          <h1 className="font-display text-[36px] sm:text-[44px] font-[800] leading-tight tracking-[-0.02em]" style={{ color: "var(--g12)" }}>
            Work<span style={{ color: "var(--accent)" }}>.</span>
          </h1>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-16">
          {EXPERIENCE.map((role, i) => {
            const meta = ROLE_META[i];
            const isHovered = hovered === i;
            return (
              <div
                key={role.company}
                data-animate
                style={{
                  "--stagger": i + 1,
                  border: `1px solid ${isHovered ? `${meta.color}45` : "var(--g3)"}`,
                  background: isHovered ? `${meta.color}07` : "var(--g1)",
                  boxShadow: isHovered ? `0 0 0 1px ${meta.color}15, 0 12px 32px rgba(0,0,0,0.2)` : "none",
                  transition: "border-color 0.2s, background 0.2s, box-shadow 0.2s",
                } as React.CSSProperties}
                className="rounded-xl overflow-hidden flex flex-col"
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
              >
                {/* Accent bar */}
                <div style={{
                  height: 2,
                  background: `linear-gradient(90deg, ${meta.color}, transparent)`,
                  opacity: isHovered ? 1 : 0.35,
                  transition: "opacity 0.2s",
                }} />

                <div className="p-5 flex flex-col flex-1">
                  {/* Domain + period */}
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <span className="text-[10px] font-mono uppercase tracking-[0.1em]"
                      style={{ color: meta.color, opacity: isHovered ? 1 : 0.7, transition: "opacity 0.2s" }}>
                      {meta.domain}
                    </span>
                    <span className="text-[10px] font-mono tabular-nums shrink-0" style={{ color: "var(--g5)" }}>
                      {role.period}
                    </span>
                  </div>

                  {/* Company */}
                  <h2 className="font-display font-[700] text-[22px] tracking-[-0.015em] mb-0.5" style={{ color: "var(--g12)" }}>
                    {role.company}
                  </h2>
                  <p className="text-[12px] mb-5" style={{ color: "var(--g6)" }}>
                    {role.role.split(",")[0]} · {role.detail.split("·")[0].trim()}
                  </p>

                  {/* Highlight */}
                  <p className="text-[14px] leading-[1.65] flex-1 mb-5" style={{ color: "var(--g8)" }}>
                    {meta.highlight}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {meta.tags.map(t => (
                      <span key={t} className="text-[10px] font-mono px-1.5 py-0.5 rounded"
                        style={{
                          color: isHovered ? meta.color : "var(--g6)",
                          background: isHovered ? `${meta.color}12` : "var(--g2)",
                          border: `1px solid ${isHovered ? `${meta.color}30` : "var(--g3)"}`,
                          transition: "color 0.2s, background 0.2s, border-color 0.2s",
                        }}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Education */}
        <div
          data-animate
          style={{ "--stagger": EXPERIENCE.length + 1, borderTop: "1px solid var(--g3)" } as React.CSSProperties}
          className="pt-10"
        >
          <p className="text-[10px] uppercase tracking-[0.14em] font-mono mb-6" style={{ color: "var(--g5)" }}>
            Education
          </p>

          <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--g3)", background: "var(--g1)" }}>
            <div style={{ height: 2, background: "linear-gradient(90deg, var(--g5), transparent)", opacity: 0.5 }} />
            <div className="p-5">
              <div className="flex items-start justify-between gap-4 mb-1">
                <h2 className="font-display font-[700] text-[20px] tracking-tight" style={{ color: "var(--g12)" }}>
                  {EDUCATION.school}
                </h2>
                <span className="text-[10px] font-mono shrink-0 tabular-nums" style={{ color: "var(--g5)" }}>
                  {EDUCATION.period}
                </span>
              </div>
              <p className="text-[13px] mb-5" style={{ color: "var(--g6)" }}>
                {EDUCATION.degree} · {EDUCATION.location}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {EDUCATION.courses.map(c => (
                  <span key={c} className="text-[11px] font-mono px-2 py-0.5 rounded"
                    style={{ color: "var(--g7)", background: "var(--g2)", border: "1px solid var(--g3)" }}>
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>
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
