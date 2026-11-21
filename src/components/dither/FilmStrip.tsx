"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import type { Film, FilmStats } from "@/lib/films";
import { ColorDither } from "./ColorDither";
import { ditherColor } from "./dither";
import "./film-strip.css";

const stars = (half: number) => "★".repeat(half >> 1) + (half & 1 ? "½" : "");

function stubDate(iso: string | null) {
  if (!iso) return null;
  const d = new Date(`${iso}T00:00:00`);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }).toUpperCase();
}

// Stands in for a missing poster: the title set large on a gradient, then
// dithered to two tones like everything else on the site.
function TitleCard({ title, year }: { title: string; year: number | null }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
    const cell = 2;

    function draw() {
      const rect = canvas.getBoundingClientRect();
      const w = Math.max(1, Math.round(rect.width / cell));
      const h = Math.max(1, Math.round(rect.height / cell));
      canvas.width = w;
      canvas.height = h;
      const g = ctx.createLinearGradient(0, 0, w * 0.4, h);
      g.addColorStop(0, "#5a5a5a");
      g.addColorStop(1, "#0d0d0d");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      const family = getComputedStyle(document.body).fontFamily;
      const pad = Math.round(w * 0.1);
      // Shrink until the longest word fits on a line.
      ctx.font = `600 100px ${family}`;
      const widest = Math.max(...title.toUpperCase().split(" ").map((word) => ctx.measureText(word).width));
      const size = Math.floor(Math.min(w / 5.2, ((w - pad * 2) / widest) * 100));
      ctx.font = `600 ${size}px ${family}`;
      ctx.fillStyle = "#f2f2f2";
      ctx.textBaseline = "top";
      const lines: string[] = [];
      let line = "";
      for (const word of title.toUpperCase().split(" ")) {
        const next = line ? `${line} ${word}` : word;
        if (ctx.measureText(next).width > w - pad * 2 && line) {
          lines.push(line);
          line = word;
        } else line = next;
      }
      lines.push(line);
      lines.forEach((l, i) => ctx.fillText(l, pad, h - pad - (lines.length - i) * size * 1.05 - size * 0.9));
      if (year) {
        ctx.font = `500 ${Math.round(size * 0.55)}px ${family}`;
        ctx.fillStyle = "#9a9a9a";
        ctx.fillText(String(year), pad, h - pad - size * 0.6);
      }
      const image = ctx.getImageData(0, 0, w, h);
      ditherColor(image, 2);
      ctx.putImageData(image, 0, 0);
    }

    const resize = new ResizeObserver(draw);
    resize.observe(canvas);
    return () => resize.disconnect();
  }, [title, year]);

  return <canvas ref={ref} aria-hidden="true" className="dither-photo" />;
}

function Frame({ film, n, href, hidden }: { film: Film; n: number; href: string; hidden: boolean }) {
  const label = `${film.title}${film.year ? ` (${film.year})` : ""}, rated ${film.rating / 2} out of 5`;
  const date = stubDate(film.date);
  return (
    <li className="reel-cell">
      <a
        className="reel-frame"
        href={href}
        target="_blank"
        rel="noopener"
        aria-label={hidden ? undefined : label}
        tabIndex={hidden ? -1 : undefined}
      >
        <span className="reel-pic">
          {film.poster ? (
            <>
              <ColorDither src={film.poster} alt="" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={film.poster} alt="" loading="lazy" decoding="async" />
            </>
          ) : (
            <TitleCard title={film.title} year={film.year} />
          )}
          <span className="stub" aria-hidden="true">
            <span className="stub-admit">Admit one · No. {String(n).padStart(3, "0")}</span>
            <span className="stub-title">{film.title}</span>
            <span className="stub-row">
              <span>{film.year}</span>
              <span className="stub-stars">{stars(film.rating)}</span>
            </span>
            {date && <span className="stub-date">{date}</span>}
          </span>
        </span>
      </a>
      <span className="reel-edge" aria-hidden="true">
        <span>▸{n}</span>
        <span>{n}A</span>
      </span>
    </li>
  );
}

// Enough frames that one run is wider than any screen, so the loop never shows a gap.
const MIN_FRAMES = 16;

export function FilmStrip({ films, profile }: { films: Film[]; profile: string }) {
  const loops = Math.max(1, Math.ceil(MIN_FRAMES / Math.max(films.length, 1)));
  const run = Array.from({ length: loops }, (_, loop) => films.map((film, i) => ({ film, i, loop }))).flat();
  return (
    <div className="reel" aria-label="Favourite films" style={{ "--reel-duration": `${run.length * 4}s` } as CSSProperties}>
      <div className="reel-belt">
        {[0, 1].map((dup) => (
          <ol key={dup} className="reel-run" aria-hidden={dup === 1 || undefined}>
            {run.map(({ film: f, i, loop }) => (
              <Frame
                key={`${loop}-${f.title}-${f.year}`}
                film={f}
                n={loop * films.length + i + 1}
                href={f.uri ?? profile}
                hidden={dup === 1 || loop > 0}
              />
            ))}
          </ol>
        ))}
      </div>
    </div>
  );
}

// Half-star rating distribution, drawn as dithered bars.
export function RatingHistogram({ stats }: { stats: FilmStats }) {
  const max = Math.max(...stats.histogram, 1);
  return (
    <figure className="hist" aria-label={`Rating distribution across ${stats.rated} films`}>
      <ol>
        {stats.histogram.map((count, i) => (
          <li key={i} title={`${stars(i + 1)}: ${count}`}>
            <span className="hist-bar" style={{ height: `${(count / max) * 100}%` }} />
            <span className="hist-label">{i % 2 === 1 ? (i + 1) / 2 : ""}</span>
          </li>
        ))}
      </ol>
    </figure>
  );
}
