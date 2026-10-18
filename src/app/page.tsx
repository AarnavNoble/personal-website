import Link from "next/link";
import { EXPERIENCE, OPEN_SOURCE, PROJECTS, LINKS } from "@/lib/data";
import { ALBUMS, CAMERA } from "@/lib/photos";
import { AsciiField } from "@/components/dither/AsciiField";
import { ColorDither } from "@/components/dither/ColorDither";
import { CopyEmail } from "@/components/dither/CopyEmail";
import { HeroDesk } from "@/components/dither/HeroDesk";
import { ProjectCover } from "@/components/dither/ProjectCover";
import { Window } from "@/components/dither/Window";
import { FILE_TAGS, albumTag, anchor, cover } from "@/components/dither/tags";

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

const PHOTO_COVERS = ["grand-canyon", "toronto-islands", "san-diego", "hollywood"]
  .map((slug) => ALBUMS.find((a) => a.slug === slug))
  .filter((album) => album !== undefined)
  .map((album) => ({ album, photo: album.photos[0] }));

function SectionHead({ title, href, label }: { title: string; href: string; label: string }) {
  return (
    <div className="block-head">
      <h2>{title}</h2>
      <Link href={href}>{label}</Link>
    </div>
  );
}

export default function Home() {
  return (
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
          <p className="lede">I like making things that work, and understanding the ones that don&rsquo;t.</p>
          <div className="actions">
            <a className="pill pill-fill" href={LINKS.resume} target="_blank" rel="noopener">Résumé</a>
            <Link className="pill" href="/projects">See projects</Link>
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

      {/* Projects */}
      <section className="wrap block">
        <SectionHead title="Projects" href="/projects" label="All projects" />
        <ul className="cards">
          {PROJECTS.map((p) => (
            <li key={p.slug}>
              <Window tag={FILE_TAGS[p.slug] ?? p.slug.toUpperCase()}>
                <Link href={`/projects#${p.slug}`} className="card">
                  <div className="card-cover"><ProjectCover slug={p.slug} /></div>
                  <div className="card-text">
                    <h3>{p.name}</h3>
                    <p>{p.short}</p>
                  </div>
                </Link>
              </Window>
            </li>
          ))}
        </ul>
      </section>

      {/* Experience */}
      <section className="wrap block">
        <SectionHead title="Experience" href="/work" label="Full history" />
        <Window tag="EXPERIENCE.LOG" className="win-wide">
          <ol className="rows">
            {EXPERIENCE.map((r) => (
              <li key={r.company}>
                <Link href={`/work#${anchor(r.company)}`} className="row">
                  <span className="row-period">{r.period}</span>
                  <span className="row-name">{r.company}</span>
                  <span className="row-role">{r.role}</span>
                </Link>
              </li>
            ))}
          </ol>
        </Window>
      </section>

      {/* Open source */}
      <section className="wrap block">
        <SectionHead title="Open source" href="/work#open-source" label="Contributions" />
        <ul className="os-grid">
          {OPEN_SOURCE.map((o) => (
            <li key={o.project}>
              <Window tag={`${o.project.split(" ").pop()!.toUpperCase()}.PRS`}>
                <a href={o.link} target="_blank" rel="noopener" className="os">
                  <span className="os-stats">{o.stats}</span>
                  <h3>{o.project}</h3>
                  <p>{o.role}. {o.detail}.</p>
                </a>
              </Window>
            </li>
          ))}
        </ul>
      </section>

      {/* Photography */}
      <section className="wrap block">
        <div className="block-head">
          <div>
            <h2>Photography</h2>
            <p className="block-sub">Shot on a {CAMERA}. Hover for the original.</p>
          </div>
          <Link href="/photos">All albums</Link>
        </div>
        <ul className="photos">
          {PHOTO_COVERS.map(({ album, photo }) => (
            <li key={photo.id}>
              <Window tag={albumTag(album.slug)}>
                <Link href={`/photos/${album.slug}`} className="photo" aria-label={`${album.title} photos`}>
                  <ColorDither src={photo.thumb} alt="" />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={photo.thumb} alt={photo.alt} loading="lazy" decoding="async" />
                </Link>
              </Window>
              <p className="photo-title">{album.title}</p>
              <p className="photo-place">{[album.place, album.date].filter(Boolean).join(", ")}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* Contact */}
      <section className="contact">
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
  );
}
