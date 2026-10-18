import type { Metadata } from "next";
import { EXPERIENCE, EDUCATION, OPEN_SOURCE } from "@/lib/data";
import { Window } from "@/components/dither/Window";
import { anchor } from "@/components/dither/tags";
import { AethexDemo } from "./AethexDemo";
import { ClimateDemo } from "./ClimateDemo";

export const metadata: Metadata = { title: "Experience | Aarnav Noble" };

// Keyed by company so the demos and tags follow the role, not its position.
const ROLE_META: Record<string, { tag: string; domain: string; tags: string[]; Demo?: () => React.JSX.Element }> = {
  AethexAI: {
    tag: "AETHEX.LOG",
    domain: "Voice AI infrastructure",
    tags: ["AWS/EKS", "Kubernetes", "Terraform", "KEDA", "WebRTC", "Python", "LLM evals"],
    Demo: AethexDemo,
  },
  "Environment and Climate Change Canada": {
    tag: "ECCC.LOG",
    domain: "Climate ML",
    tags: ["PyTorch", "GNN", "XGBoost", "Satellite data"],
    Demo: ClimateDemo,
  },
  "Toronto Transit Commission": {
    tag: "TTC.LOG",
    domain: "Fleet systems",
    tags: ["Network boot", "Bash", "Config as code"],
  },
  "UW Orbital": {
    tag: "ORBITAL.LOG",
    domain: "Embedded, aerospace",
    tags: ["C", "FreeRTOS", "STM32", "MATLAB/Simulink", "I2C"],
  },
  "Ontario Chamber of Commerce": {
    tag: "OCC.LOG",
    domain: "Full-stack, Shopify",
    tags: ["Go", "Kubernetes", "GraphQL", "React", "OAuth"],
  },
};

function place(detail: string) {
  return detail.split("·").pop()?.trim() ?? detail;
}

export default function Work() {
  return (
    <main className="wrap page">
      <header className="page-head">
        <h1 className="mega">
          <span>Experience.</span>
          <span className="dim">Where I&rsquo;ve built things.</span>
        </h1>
        <nav className="jump" aria-label="Sections on this page">
          {EXPERIENCE.map((r) => (
            <a key={r.company} href={`#${anchor(r.company)}`}>{r.company}</a>
          ))}
          <a href="#open-source">Open source</a>
          <a href="#education">Education</a>
        </nav>
      </header>

      <ol className="roles">
        {EXPERIENCE.map((r) => {
          const meta = ROLE_META[r.company];
          return (
            <li key={r.company} id={anchor(r.company)} className="role">
              <div className="role-side">
                <p className="row-period">{r.period}</p>
                <h2>{r.company}</h2>
                <p className="role-title">{r.role}</p>
                <p className="role-place">{meta ? `${meta.domain}, ` : ""}{place(r.detail)}</p>
                {meta && (
                  <ul className="chips" aria-label="Tools">
                    {meta.tags.map((t) => <li key={t}>{t}</li>)}
                  </ul>
                )}
              </div>
              <div className="role-main">
                <Window tag={meta?.tag ?? "ROLE.LOG"} title="shipped">
                  <ul className="shipped">
                    {r.bullets.map((b) => <li key={b}>{b}</li>)}
                  </ul>
                </Window>
                {meta?.Demo && <div className="demo"><meta.Demo /></div>}
              </div>
            </li>
          );
        })}
      </ol>

      <section id="open-source" className="sub-section">
        <h2 className="sub-head">Open source</h2>
        <div className="os-grid">
          {OPEN_SOURCE.map((o) => (
            <Window key={o.project} tag={`${o.project.split(" ").pop()!.toUpperCase()}.PRS`}>
              <div className="win-body">
                <p className="os-stats">{o.role} / {o.stats}</p>
                <h3>{o.project}</h3>
                <p className="win-tagline">{o.detail}.</p>
                <div className="term">
                  {o.bullets.map((b) => (
                    <p key={b}><span aria-hidden="true">&gt;</span> {b}</p>
                  ))}
                </div>
                <p className="win-stack">{o.tags.join(" / ")}</p>
              </div>
              <div className="win-foot">
                <a href={o.link} target="_blank" rel="noopener">Pull requests</a>
              </div>
            </Window>
          ))}
        </div>
      </section>

      <section id="education" className="sub-section">
        <h2 className="sub-head">Education</h2>
        <Window tag="WATERLOO.EDU">
          <div className="win-body edu">
            <div>
              <p className="row-period">{EDUCATION.period}</p>
              <h3>{EDUCATION.school}</h3>
              <p className="role-title">{EDUCATION.degree}, {EDUCATION.location}</p>
            </div>
            <ul className="chips" aria-label="Coursework">
              {EDUCATION.courses.map((c) => <li key={c}>{c}</li>)}
            </ul>
          </div>
        </Window>
      </section>
    </main>
  );
}
