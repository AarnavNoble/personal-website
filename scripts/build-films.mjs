#!/usr/bin/env node
// Regenerates src/lib/films.ts (and poster files in public/films) from a
// Letterboxd data export: letterboxd.com → Settings → Data → Export your data.
//
//   TMDB_TOKEN=... node scripts/build-films.mjs [export-folder-or-zip]
//
// Default input: the newest letterboxd-* folder or zip in ~/Downloads.
// Posters come from TMDB (free API key or read-access token at
// themoviedb.org/settings/api). Without TMDB_TOKEN the strip still builds and
// shows title cards in place of posters.

import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { homedir, tmpdir } from "node:os";
import { basename, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "public", "films");
const DATA = join(ROOT, "src", "lib", "films.ts");
const FAVOURITE = 9; // half-stars: the strip shows 4½★ and 5★ films
const TOKEN = process.env.TMDB_TOKEN ?? "";

function findExport() {
  if (process.argv[2]) return process.argv[2];
  const dl = join(homedir(), "Downloads");
  const hits = readdirSync(dl)
    .filter((f) => f.startsWith("letterboxd-"))
    .map((f) => join(dl, f))
    .sort((a, b) => statSync(b).mtimeMs - statSync(a).mtimeMs);
  return hits[0] ?? null;
}

let src = findExport();
let tmp = null;
if (src && src.endsWith(".zip")) {
  tmp = mkdtempSync(join(tmpdir(), "letterboxd-"));
  execFileSync("unzip", ["-q", src, "-d", tmp]);
  src = tmp;
}
console.log(src ? `Reading ${src}` : "No letterboxd-* export in ~/Downloads; refreshing posters for the films already in src/lib/films.ts.");

// Minimal RFC 4180 parser: quoted fields may hold commas, quotes and newlines.
function parseCsv(text) {
  const rows = [];
  let row = [], field = "", quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') quoted = false;
      else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ",") { row.push(field); field = ""; }
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field); rows.push(row); row = []; field = "";
    } else field += c;
  }
  if (field || row.length) { row.push(field); rows.push(row); }
  const [head, ...body] = rows.filter((r) => r.some(Boolean));
  return body.map((r) => Object.fromEntries(head.map((h, i) => [h.trim(), r[i] ?? ""])));
}

const read = (name) => (src && existsSync(join(src, name)) ? parseCsv(readFileSync(join(src, name), "utf8")) : []);
const ratings = read("ratings.csv");
const diary = read("diary.csv");
const watched = read("watched.csv");
if (src && !ratings.length) throw new Error(`No ratings.csv in ${src}`);

// Diary rows link to diary entries, not films, so join on title + year.
const key = (r) => `${r.Name}\u0000${r.Year}`;
const watchedOn = new Map();
for (const d of diary) {
  const date = d["Watched Date"] || d.Date;
  if (date > (watchedOn.get(key(d)) ?? "")) watchedOn.set(key(d), date);
}

// Ratings are 0.5–5 in half steps; store them as half-stars (1–10).
const rated = ratings
  .map((r) => ({
    title: r.Name,
    year: Number(r.Year) || null,
    rating: Math.round(Number(r.Rating) * 2),
    date: watchedOn.get(key(r)) || r.Date,
    uri: r["Letterboxd URI"],
  }))
  .filter((f) => f.rating > 0);

const histogram = Array.from({ length: 10 }, (_, i) => rated.filter((f) => f.rating === i + 1).length);
const stats = !rated.length ? null : {
  watched: Math.max(watched.length, rated.length),
  rated: rated.length,
  average: Math.round((rated.reduce((s, f) => s + f.rating, 0) / rated.length / 2) * 100) / 100,
  histogram,
};

// Without an export, keep the current strip and only fill in posters.
const current = () => {
  const text = readFileSync(DATA, "utf8");
  return JSON.parse(text.slice(text.indexOf("= [", text.indexOf("export const FILMS")) + 2).replace(/;\s*$/, ""));
};
const strip = rated.length
  ? rated.filter((f) => f.rating >= FAVOURITE).sort((a, b) => b.rating - a.rating || b.date.localeCompare(a.date))
  : current().map((f) => ({ ...f, poster: null }));

async function tmdbPoster(title, year) {
  const bearer = TOKEN.startsWith("ey");
  const q = new URLSearchParams({ query: title, include_adult: "false" });
  if (year) q.set("year", String(year));
  if (!bearer) q.set("api_key", TOKEN);
  const res = await fetch(`https://api.themoviedb.org/3/search/movie?${q}`, {
    headers: bearer ? { Authorization: `Bearer ${TOKEN}` } : {},
  });
  if (!res.ok) throw new Error(`TMDB ${res.status} for ${title}`);
  const { results } = await res.json();
  return results?.find((m) => m.poster_path)?.poster_path ?? null;
}

mkdirSync(OUT, { recursive: true });
const keep = new Set();
const films = [];
for (const f of strip) {
  const id = (f.uri && basename(f.uri)) || f.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const file = join(OUT, `${id}.webp`);
  let poster = existsSync(file) ? `/films/${id}.webp` : null;
  if (!poster && TOKEN) {
    try {
      const path = await tmdbPoster(f.title, f.year);
      if (path) {
        const res = await fetch(`https://image.tmdb.org/t/p/w342${path}`);
        const jpg = join(tmpdir(), `${id}.jpg`);
        writeFileSync(jpg, Buffer.from(await res.arrayBuffer()));
        execFileSync("cwebp", ["-quiet", "-q", "82", jpg, "-o", file]);
        rmSync(jpg);
        poster = `/films/${id}.webp`;
      }
    } catch (err) {
      console.warn(`  no poster for ${f.title}: ${err.message}`);
    }
  }
  if (poster) keep.add(file);
  films.push({ ...f, poster });
  console.log(`  ${poster ? "■" : "□"} ${f.title} (${f.year}) ${"★".repeat(f.rating >> 1)}${f.rating & 1 ? "½" : ""}`);
}

for (const f of readdirSync(OUT)) if (!keep.has(join(OUT, f))) rmSync(join(OUT, f));
if (tmp) rmSync(tmp, { recursive: true });

writeFileSync(
  DATA,
  `// Generated by scripts/build-films.mjs from a Letterboxd export. Do not edit by hand.

export const LETTERBOXD = "https://letterboxd.com/aarnavnoble/";

export type Film = {
  title: string;
  year: number | null;
  /** Half-stars, 1–10. */
  rating: number;
  /** ISO date watched (or rated). */
  date: string | null;
  uri: string | null;
  poster: string | null;
};

export type FilmStats = { watched: number; rated: number; average: number; histogram: number[] };

export const FILM_STATS: FilmStats | null = ${JSON.stringify(stats)};

export const FILMS: Film[] = ${JSON.stringify(films, null, 2)};
`,
);
console.log(`Wrote ${films.length} films, ${keep.size} posters.${stats ? ` ${stats.rated} rated, avg ${stats.average}.` : ""}`);
