"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { EXPERIENCE, EDUCATION, LINKS } from "@/lib/data";
import { Reveal, Words, ScrollProgress } from "@/components/motion-lib";
import { ShaderField } from "@/components/ShaderField";
import { AethexDemo } from "./AethexDemo";
import { ClimateDemo } from "./ClimateDemo";

const ROLE_DEMOS = [AethexDemo, ClimateDemo];

const ROLE_META = [
  {
    domain: "Voice AI · Infrastructure",
    tags: ["AWS/EKS", "Kubernetes", "Terraform", "WebRTC", "Python"],
    color: "#6c8ebf",
  },
  {
    domain: "Climate ML",
    tags: ["PyTorch", "GNN", "XGBoost", "Satellite data"],
    color: "#34d399",
  },
  {
    domain: "Systems · DevOps",
    tags: ["PXE boot", "Bash", "DSM", "IT systems"],
    color: "#9ca3af",
  },
  {
    domain: "Embedded · Aerospace",
    tags: ["C", "FreeRTOS", "STM32", "MATLAB/Simulink", "I2C"],
    color: "#a78bfa",
  },
  {
    domain: "Full-stack · Shopify",
    tags: ["Go", "Kubernetes", "GraphQL", "React", "OAuth"],
    color: "#e879a8",
  },
];

function Log({ items, color }: { items: string[]; color: string }) {
  return (
    <div className="my-4 rounded-lg overflow-hidden flex-1" style={{ border: "1px solid var(--g3)" }}>
      <div className="px-3.5 py-2 flex items-center gap-2" style={{ background: "var(--g2)", borderBottom: "1px solid var(--g3)" }}>
        <div className="w-1 h-1 rounded-full" style={{ background: color }} />
        <span className="text-[10px] uppercase tracking-[0.12em] font-mono font-medium" style={{ color: "var(--g6)" }}>
          Shipped
        </span>
      </div>
      {items.map((item, i) => (
        <div
          key={i}
          className="flex items-start gap-3 px-3.5 py-2.5"
          style={{
            borderBottom: i < items.length - 1 ? "1px solid var(--g3)" : "none",
            background: "var(--g1)",
          }}
        >
          <span className="text-[10px] font-mono w-5 shrink-0 tabular-nums pt-px" style={{ color: "var(--g5)" }}>
            {String(i + 1).padStart(2, "0")}
          </span>
          <span className="text-[12.5px] leading-[1.6]" style={{ color: "var(--g8)" }}>
            {item}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function Work() {
  const [hovered, setHovered] = useState<number | null>(null);

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
            <Link href="/projects" className="link-dim">Projects</Link>
            <a href={LINKS.resume} target="_blank" rel="noopener" className="link-dim hidden sm:inline">Résumé</a>
            <a href={LINKS.github} target="_blank" rel="noopener" className="link-dim hidden sm:inline">GitHub</a>
          </div>
        </div>
      </motion.nav>

      <main className="relative z-10 max-w-[1160px] mx-auto px-6 pt-28 pb-24 w-full">

        <Reveal>
          <div className="mb-14">
            <p className="font-label text-[10px] mb-3" style={{ color: "var(--g6)" }}>
              Experience
            </p>
            <h1
              className="font-display"
              style={{ fontSize: "clamp(2.5rem, 1.8rem + 3vw, 4rem)", fontWeight: 400, letterSpacing: "-0.03em", lineHeight: 1, color: "var(--g12)" }}
            >
              <Words text="Work" />
              <span style={{ color: "var(--accent)" }}>.</span>
            </h1>
          </div>
        </Reveal>

        {/* Cards */}
        <div className="flex flex-col gap-6 mb-20">
          {EXPERIENCE.map((role, i) => {
            const meta = ROLE_META[i];
            const isHovered = hovered === i;
            return (
              <Reveal key={role.company} delay={i * 0.05}>
                <div
                  style={{
                    border: `1px solid ${isHovered ? `${meta.color}45` : "var(--g3)"}`,
                    background: isHovered ? `${meta.color}07` : "var(--g1)",
                    boxShadow: isHovered ? `0 0 0 1px ${meta.color}15, 0 12px 32px rgba(0,0,0,0.2)` : "none",
                    transition: "border-color 0.2s, background 0.2s, box-shadow 0.2s",
                  }}
                  className="rounded-2xl overflow-hidden flex flex-col"
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

                  <div className="p-6 sm:p-7 flex flex-col flex-1">
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
                    <h2 className="font-display font-[700] text-[24px] sm:text-[26px] tracking-[-0.015em] mb-0.5" style={{ color: "var(--g12)" }}>
                      {role.company}
                    </h2>
                    <p className="text-[13px] mb-5" style={{ color: "var(--g9)" }}>
                      {role.role.split(",")[0]} · {role.detail.split("·")[0].trim()}
                    </p>

                    <Log items={role.bullets} color={meta.color} />

                    {(() => { const Demo = ROLE_DEMOS[i]; return Demo ? <Demo /> : null; })()}

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
              </Reveal>
            );
          })}
        </div>

        {/* Education */}
        <Reveal>
          <div className="pt-12" style={{ borderTop: "1px solid var(--g3)" }}>
            <p className="font-label text-[10px] mb-6" style={{ color: "var(--g6)" }}>
              Education
            </p>

            <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid var(--g3)", background: "var(--g1)" }}>
              <div style={{ height: 2, background: "linear-gradient(90deg, var(--g5), transparent)", opacity: 0.5 }} />
              <div className="p-6 sm:p-7">
                <div className="flex items-start justify-between gap-4 mb-1">
                  <h2 className="font-display font-[700] text-[22px] tracking-tight" style={{ color: "var(--g12)" }}>
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
        </Reveal>

      </main>

      <footer className="relative z-10 max-w-[1160px] mx-auto px-6 pb-10 w-full">
        <p className="font-label text-[9px]" style={{ color: "var(--g6)" }}>
          © {new Date().getFullYear()} Aarnav Noble
        </p>
      </footer>
    </div>
  );
}
