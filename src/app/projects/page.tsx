import type { Metadata } from "next";
import { PROJECTS } from "@/lib/data";
import { ProjectCover } from "@/components/dither/ProjectCover";
import { Window } from "@/components/dither/Window";
import { FILE_TAGS } from "@/components/dither/tags";
import { RoamDemo } from "./RoamDemo";
import { DothrakiDemo } from "./DothrakiDemo";
import { VestigeDemo } from "./VestigeDemo";
import { EngineDemo } from "./EngineDemo";

export const metadata: Metadata = { title: "Projects | Aarnav Noble" };

const DEMOS: Record<string, () => React.JSX.Element> = {
  vestige: VestigeDemo,
  "llm-engine": EngineDemo,
  roam: RoamDemo,
  "dothraki-asr": DothrakiDemo,
};

export default function Projects() {
  return (
    <main className="wrap page">
      <header className="page-head">
        <h1 className="mega">
          <span>Projects.</span>
          <span className="dim">How each one works.</span>
        </h1>
        <nav className="jump" aria-label="Projects on this page">
          {PROJECTS.map((p) => (
            <a key={p.slug} href={`#${p.slug}`}>{p.name}</a>
          ))}
        </nav>
      </header>

      {PROJECTS.map((p) => {
        const Demo = DEMOS[p.slug];
        return (
          <article key={p.slug} id={p.slug} className="proj">
            <Window tag={FILE_TAGS[p.slug] ?? p.slug.toUpperCase()} className="proj-cover">
              <ProjectCover slug={p.slug} cell={4} />
            </Window>

            <div className="proj-grid">
              <aside className="proj-side">
                <h2>{p.name}</h2>
                <p className="proj-tagline">{p.tagline}</p>
                <p className="proj-links">
                  {p.demo && <a href={p.demo} target="_blank" rel="noopener">{p.github ? "Live demo" : "Site"}</a>}
                  {p.github && <a href={p.github} target="_blank" rel="noopener">Source code</a>}
                </p>
                <ul className="chips" aria-label="Stack">
                  {p.stack.map((t) => <li key={t}>{t}</li>)}
                </ul>
              </aside>

              <div className="proj-main">
                <p className="proj-desc">{p.description}</p>

                {p.highlights && p.highlights.length > 0 && (
                  <div className="term">
                    {p.highlights.map((h) => (
                      <p key={h}><span aria-hidden="true">&gt;</span> {h}</p>
                    ))}
                  </div>
                )}

                <Window tag="PIPELINE.LOG" title="how it works" className="pipeline">
                  <ol>
                    {p.pipeline.map((s) => (
                      <li key={s.step}>
                        <div className="pipe-head">
                          <h3>{s.step}</h3>
                          <span>{s.tech}</span>
                        </div>
                        <p>{s.detail}</p>
                      </li>
                    ))}
                  </ol>
                </Window>

                {Demo && <div className="demo"><Demo /></div>}
              </div>
            </div>
          </article>
        );
      })}
    </main>
  );
}
