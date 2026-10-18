import type { Metadata } from "next";
import Link from "next/link";
import { Mona_Sans, Geist_Mono } from "next/font/google";
import { EXPERIENCE, OPEN_SOURCE, PROJECTS, LINKS } from "@/lib/data";
import { ALBUMS, CAMERA } from "@/lib/photos";
import { AsciiField } from "./AsciiField";
import { ColorDither } from "./ColorDither";
import { CopyEmail } from "./CopyEmail";
import { HeroDesk } from "./HeroDesk";
import { Window } from "./Window";
import "./dither.css";

const mona = Mona_Sans({ subsets: ["latin"], variable: "--font-mona", display: "swap" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-gmono", display: "swap" });

export const metadata: Metadata = { title: "Aarnav Noble" };

// The contact section's text field is written from the work itself.
const FIELD_PHRASES = [
  "paged kv cache", "continuous batching", "prefix caching", "53x faster ttft",
  "replay as a test", "30k spans/sec", "zero model calls", "learning to rank",
  "route optimization", "prefill before decode", "kpa panic window", "cuda kernels",
  "gqa attention 1.62x", "clickhouse", "opentelemetry", "sub-500ms voice",
  "interrupt state machine", "kubernetes", "graph neural nets", "waterloo",
];

const SKILLS = [
  "Python", "Go", "C/C++", "CUDA", "TypeScript", "PyTorch", "Kubernetes", "Docker",
  "Terraform", "AWS", "PostgreSQL", "Redis", "ClickHouse", "Prometheus", "OpenTelemetry",
  "FastAPI", "Next.js", "WebRTC", "Linux",
];

const FILE_TAGS: Record<string, string> = {
  vestige: "VESTIGE.GO",
  "llm-engine": "ENGINE.CU",
  roam: "ROAM.PY",
  "dothraki-asr": "DOTHRAKI.IPYNB",
  "flame-forecaster": "FLAME.PY",
};

const INTERESTS = ["photography", "film", "soccer", "MMA", "tennis", "travel"];

const cover = (slug: string) => ALBUMS.find((a) => a.slug === slug)?.photos[0].thumb ?? "";

const PHOTO_COVERS = ["grand-canyon", "toronto-islands", "san-diego", "hollywood"]
  .map((slug) => ALBUMS.find((a) => a.slug === slug))
  .filter((album) => album !== undefined)
  .map((album) => ({ album, photo: album.photos[0] }));

function location(detail: string) {
  return detail.split("·").pop()?.trim() ?? detail;
}

export default function DitherHome() {
  return (
    <div className={`dr ${mona.variable} ${mono.variable}`}>
      <header className="nav wrap">
        <Link href="/dither" className="nav-name">Aarnav Noble</Link>
        <nav aria-label="Sections">
          <a href="#work">Projects</a>
          <a href="#experience">Experience</a>
          <a href="#open-source">Open source</a>
          <a href="#photography">Photos</a>
          <a href={LINKS.resume} target="_blank" rel="noopener">Résumé</a>
        </nav>
      </header>

      <main>
        {/* Hero */}
        <section className="hero">
          <span className="guide g1" aria-hidden="true" />
          <span className="guide g2" aria-hidden="true" />
          <div className="wrap hero-inner">
            <div className="hero-meta">
              <p className="label">
                <span className="sq" aria-hidden="true" />Open to Winter 2027 co&#8209;ops<br />
                Computer Engineering, University of Waterloo
              </p>
            </div>
            <h1 className="mega">
              <span>Aarnav Noble.</span>
              <span className="dim">Software and ML infrastructure.</span>
            </h1>
            <p className="lede">
              I like making things that work, and understanding the ones that don&rsquo;t. I build inference
              servers, agent observability and the infrastructure under them.
            </p>
            <div className="actions">
              <a className="pill pill-fill" href={LINKS.resume} target="_blank" rel="noopener">Résumé</a>
              <a className="pill" href="#work">See projects</a>
            </div>
            <p className="social">
              <a href={LINKS.github} target="_blank" rel="noopener">GitHub</a>
              <a href={LINKS.linkedin} target="_blank" rel="noopener">LinkedIn</a>
              <CopyEmail email={LINKS.email} className="text-btn" />
            </p>
          </div>
          <HeroDesk photo={cover("lions-head")} scan={cover("grand-canyon")} />
        </section>

        {/* Skills */}
        <div className="ticker" aria-label="Skills">
          <div className="ticker-belt">
            {[0, 1].map((dup) => (
              <ul key={dup} aria-hidden={dup === 1 || undefined}>
                {SKILLS.map((s) => <li key={s}>{s}</li>)}
              </ul>
            ))}
          </div>
        </div>

        {/* Selected work */}
        <section className="wrap block" id="work">
          <div className="block-head">
            <h2>Selected work</h2>
            <Link href="/projects">All projects with demos</Link>
          </div>
          <div className="wins">
            {PROJECTS.map((p) => (
              <Window key={p.slug} tag={FILE_TAGS[p.slug] ?? p.slug.toUpperCase()}>
                <div className="win-body">
                  <h3>{p.name}</h3>
                  <p className="win-tagline">{p.tagline}</p>
                  {p.highlights && p.highlights.length > 0 && (
                    <div className="term">
                      {p.highlights.slice(0, 3).map((h) => (
                        <p key={h}><span aria-hidden="true">&gt;</span> {h}</p>
                      ))}
                    </div>
                  )}
                  <p className="win-stack">{p.stack.slice(0, 5).join(" / ")}</p>
                </div>
                <div className="win-foot">
                  <Link href="/projects">Details</Link>
                  {p.demo && <a href={p.demo} target="_blank" rel="noopener">{p.github ? "Demo" : "Site"}</a>}
                  {p.github && <a href={p.github} target="_blank" rel="noopener">Code</a>}
                </div>
              </Window>
            ))}
          </div>
        </section>

        {/* Experience */}
        <section className="wrap block" id="experience">
          <div className="block-head">
            <h2>Experience</h2>
            <Link href="/work">Full history</Link>
          </div>
          <Window tag="EXPERIENCE.LOG" title="work history" className="win-wide">
            <ol className="jobs">
              {EXPERIENCE.map((r) => (
                <li key={r.company} className="job">
                  <p className="job-period">{r.period}</p>
                  <div>
                    <h3>{r.company}</h3>
                    <p className="job-role">{r.role}, {location(r.detail)}</p>
                    <ul className="job-points">
                      {r.bullets.slice(0, 2).map((b) => <li key={b}>{b}</li>)}
                    </ul>
                  </div>
                </li>
              ))}
            </ol>
          </Window>
        </section>

        {/* Open source */}
        <section className="wrap block" id="open-source">
          <div className="block-head">
            <h2>Open source</h2>
          </div>
          <div className="wins wins-even">
            {OPEN_SOURCE.map((o) => (
              <Window key={o.project} tag={`${o.project.split(" ").pop()!.toUpperCase()}.PRS`}>
                <div className="win-body">
                  <p className="os-stats">{o.role} / {o.stats}</p>
                  <h3>{o.project}</h3>
                  <p className="win-tagline">{o.detail}.</p>
                  <div className="term">
                    {o.bullets.slice(0, 3).map((b) => (
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

        {/* Photography */}
        <section className="wrap block" id="photography">
          <div className="block-head">
            <div>
              <h2>Photography</h2>
              <p className="block-sub">Shot on a {CAMERA}. Hover for the original.</p>
            </div>
            <Link href="/photos">All photos</Link>
          </div>
          <ul className="photos">
            {PHOTO_COVERS.map(({ album, photo }) => (
              <li key={photo.id}>
                <Window tag={`${album.slug.toUpperCase().replace(/-/g, "_")}.RAW`}>
                  <Link href={`/photos/${album.slug}`} className="photo" aria-label={`${album.title} photos`}>
                    <ColorDither src={photo.thumb} alt="" cell={2} />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={photo.thumb} alt={photo.alt} loading="lazy" decoding="async" />
                  </Link>
                </Window>
                <p className="photo-title">{album.title}</p>
                <p className="photo-place">{[album.place, album.date].filter(Boolean).join(", ")}</p>
              </li>
            ))}
          </ul>
          <p className="interests">Off the clock: {INTERESTS.join(", ")}.</p>
        </section>

        {/* Contact */}
        <section className="contact" id="contact">
          <AsciiField src={cover("toronto-islands")} phrases={FIELD_PHRASES} />
          <div className="contact-scrim" />
          <div className="wrap contact-inner">
            <h2>Let&rsquo;s build something.</h2>
            <p>Open to co&#8209;op roles and interesting problems. Email is the fastest way to reach me.</p>
            <div className="actions">
              <CopyEmail email={LINKS.email} className="pill pill-fill" />
              <a className="pill" href={LINKS.linkedin} target="_blank" rel="noopener">LinkedIn</a>
              <a className="pill" href={LINKS.github} target="_blank" rel="noopener">GitHub</a>
            </div>
          </div>
        </section>
      </main>

      <footer className="wrap footer">
        <span>© {new Date().getFullYear()} Aarnav Noble</span>
        <span>Waterloo, Ontario</span>
      </footer>
    </div>
  );
}
