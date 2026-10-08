"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LINKS } from "@/lib/data";
import { CAMERA, type Album } from "@/lib/photos";
import { Reveal, Words, ScrollProgress } from "@/components/motion-lib";
import { ShaderField } from "@/components/ShaderField";

function Lightbox({ album, index, onClose, onStep }: { album: Album; index: number; onClose: () => void; onStep: (delta: number) => void }) {
  const photo = album.photos[index];

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.metaKey || e.ctrlKey) return;
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onStep(1);
      if (e.key === "ArrowLeft") onStep(-1);
    }
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose, onStep]);

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={photo.alt}
      className="fixed inset-0 z-50 flex flex-col"
      style={{ background: "rgba(5,7,6,0.94)", backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
    >
      <div className="flex items-center justify-between px-5 sm:px-8 h-14 shrink-0">
        <span className="font-label text-[10px]" style={{ color: "var(--g8)" }}>
          {album.title} — {String(index + 1).padStart(2, "0")} / {String(album.photos.length).padStart(2, "0")}
        </span>
        <button className="link-dim text-[13px]" onClick={onClose}>Close</button>
      </div>

      <div className="relative flex-1 min-h-0 flex items-center justify-center px-4 sm:px-16">
        <motion.img
          key={photo.id}
          src={photo.full}
          alt={photo.alt}
          width={photo.width}
          height={photo.height}
          className="max-h-full max-w-full w-auto h-auto object-contain rounded-[3px]"
          initial={{ opacity: 0, scale: 0.985 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => e.stopPropagation()}
        />
        <button
          aria-label="Previous photo"
          className="lightbox-step left-1 sm:left-4"
          onClick={(e) => { e.stopPropagation(); onStep(-1); }}
        >
          ←
        </button>
        <button
          aria-label="Next photo"
          className="lightbox-step right-1 sm:right-4"
          onClick={(e) => { e.stopPropagation(); onStep(1); }}
        >
          →
        </button>
      </div>

      <div className="flex items-center justify-center gap-4 px-5 h-14 shrink-0 text-[11px] font-mono" style={{ color: "var(--g7)" }}>
        <span>{CAMERA}</span>
        {photo.settings && <span style={{ color: "var(--g5)" }}>/</span>}
        {photo.settings && <span>{photo.settings}</span>}
      </div>
    </motion.div>
  );
}

export function AlbumView({ album, prev, next }: { album: Album; prev: Album; next: Album }) {
  const [open, setOpen] = useState<number | null>(null);
  const count = album.photos.length;

  const close = useCallback(() => setOpen(null), []);
  const step = useCallback(
    (delta: number) => setOpen((i) => (i === null ? i : (i + delta + count) % count)),
    [count],
  );

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
          <Link href="/photos" className="link-dim text-[13px] pl-2">← All albums</Link>
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
          <div className="mb-14 flex items-end justify-between gap-6">
            <div>
              <p className="font-label text-[10px] mb-3" style={{ color: "var(--g6)" }}>
                {[album.place, album.date].filter(Boolean).join(" · ") || `Shot on ${CAMERA}`}
              </p>
              <h1 className="font-display" style={{ fontSize: "clamp(2.5rem, 1.8rem + 3vw, 4rem)", fontWeight: 400, letterSpacing: "-0.03em", lineHeight: 1, color: "var(--g12)" }}>
                <Words text={album.title} />
                <span style={{ color: "var(--accent)" }}>.</span>
              </h1>
            </div>
            <span className="text-[11px] font-mono shrink-0 mb-2" style={{ color: "var(--g6)" }}>
              {count} {count === 1 ? "frame" : "frames"}
            </span>
          </div>
        </Reveal>

        <div className="photo-grid">
          {album.photos.map((photo, j) => (
            <Reveal key={photo.id} delay={(j % 3) * 0.06} className="photo-cell">
              <button className="photo-tile" onClick={() => setOpen(j)} aria-label={`Open ${photo.alt}`}>
                <img src={photo.thumb} alt={photo.alt} width={photo.width} height={photo.height} loading="lazy" decoding="async" />
                {photo.settings && <span className="photo-meta font-mono">{photo.settings}</span>}
              </button>
            </Reveal>
          ))}
        </div>

        <div className="mt-16 pt-6 flex items-baseline justify-between gap-4 text-[13px]" style={{ borderTop: "1px solid var(--g3)" }}>
          <Link href={`/photos/${prev.slug}`} className="link-dim">← {prev.title}</Link>
          <Link href={`/photos/${next.slug}`} className="link-dim">{next.title} →</Link>
        </div>
      </main>

      <footer className="relative z-10 max-w-[1160px] mx-auto px-6 pb-10 w-full">
        <p className="font-label text-[9px]" style={{ color: "var(--g6)" }}>
          © {new Date().getFullYear()} Aarnav Noble
        </p>
      </footer>

      <AnimatePresence>
        {open !== null && <Lightbox album={album} index={open} onClose={close} onStep={step} />}
      </AnimatePresence>
    </div>
  );
}
