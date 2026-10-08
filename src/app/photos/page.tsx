"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { LINKS } from "@/lib/data";
import { ALBUMS, CAMERA } from "@/lib/photos";
import { Reveal, Words, ScrollProgress } from "@/components/motion-lib";
import { ShaderField } from "@/components/ShaderField";

export default function Photos() {
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
            <Link href="/work" className="link-dim">Work</Link>
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
              Shot on {CAMERA}
            </p>
            <h1 className="font-display" style={{ fontSize: "clamp(2.5rem, 1.8rem + 3vw, 4rem)", fontWeight: 400, letterSpacing: "-0.03em", lineHeight: 1, color: "var(--g12)" }}>
              <Words text="Photos" />
              <span style={{ color: "var(--accent)" }}>.</span>
            </h1>
          </div>
        </Reveal>

        <div className="grid sm:grid-cols-2 gap-x-6 gap-y-12">
          {ALBUMS.map((album, i) => {
            const cover = album.photos[0];
            return (
              <Reveal key={album.slug} delay={(i % 2) * 0.08}>
                <Link href={`/photos/${album.slug}`} className="album-card">
                  <div className="photo-tile album-cover">
                    <img src={cover.thumb} alt={cover.alt} width={cover.width} height={cover.height} loading={i < 2 ? "eager" : "lazy"} decoding="async" />
                  </div>
                  <div className="mt-4 flex items-baseline justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="font-label text-[10px]" style={{ color: "var(--g6)" }}>{String(i + 1).padStart(2, "0")}</span>
                      <h2 className="album-name text-[22px] sm:text-[26px] font-display tracking-[-0.02em]" style={{ fontWeight: 400 }}>
                        {album.title}
                      </h2>
                    </div>
                    <span className="text-[11px] font-mono shrink-0" style={{ color: "var(--g6)" }}>
                      {album.date && `${album.date} · `}{album.photos.length} {album.photos.length === 1 ? "frame" : "frames"}
                    </span>
                  </div>
                  {album.place && (
                    <p className="mt-1 ml-[calc(1.25rem+0.75rem)] text-[13px]" style={{ color: "var(--g8)" }}>{album.place}</p>
                  )}
                </Link>
              </Reveal>
            );
          })}
        </div>
      </main>

      <footer className="relative z-10 max-w-[1160px] mx-auto px-6 pb-10 w-full">
        <p className="font-label text-[9px]" style={{ color: "var(--g6)" }}>
          © {new Date().getFullYear()} Aarnav Noble
        </p>
      </footer>
    </div>
  );
}
