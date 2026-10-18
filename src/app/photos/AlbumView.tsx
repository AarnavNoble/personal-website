"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { CAMERA, type Album } from "@/lib/photos";
import { Window } from "@/components/dither/Window";

function frameTag(id: string) {
  return `${id.split("/").pop()}.RAW`;
}

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
    <div role="dialog" aria-modal="true" aria-label={photo.alt} className="lightbox" onClick={onClose}>
      <div className="lightbox-bar">
        <span>{frameTag(photo.id)} / {index + 1} of {album.photos.length}</span>
        <button type="button" onClick={onClose}>Close</button>
      </div>
      <div className="lightbox-stage">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={photo.id}
          src={photo.full}
          alt={photo.alt}
          width={photo.width}
          height={photo.height}
          onClick={(e) => e.stopPropagation()}
        />
        <button type="button" aria-label="Previous photo" className="lightbox-step prev" onClick={(e) => { e.stopPropagation(); onStep(-1); }}>
          Prev
        </button>
        <button type="button" aria-label="Next photo" className="lightbox-step next" onClick={(e) => { e.stopPropagation(); onStep(1); }}>
          Next
        </button>
      </div>
      <div className="lightbox-bar">
        <span>{CAMERA}</span>
        <span>{photo.settings}</span>
      </div>
    </div>
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
    <main className="wrap page">
      <header className="page-head">
        <p className="jump"><Link href="/photos">All albums</Link></p>
        <h1 className="mega album-title">
          <span>{album.title}.</span>
          <span className="dim">{[album.place, album.date].filter(Boolean).join(", ") || `Shot on a ${CAMERA}`}.</span>
        </h1>
        <p className="page-sub">{count} {count === 1 ? "frame" : "frames"} on a {CAMERA}. Click any frame for the full photo.</p>
      </header>

      <ul className="frames">
        {album.photos.map((photo, j) => (
          <li key={photo.id}>
            <Window tag={frameTag(photo.id)}>
              <button
                type="button"
                className="photo frame plain"
                style={{ aspectRatio: `${photo.width} / ${photo.height}` }}
                onClick={() => setOpen(j)}
                aria-label={`Open ${photo.alt}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photo.thumb} alt={photo.alt} loading="lazy" decoding="async" />
              </button>
            </Window>
            {photo.settings && <p className="frame-settings">{photo.settings}</p>}
          </li>
        ))}
      </ul>

      <nav className="album-nav" aria-label="Other albums">
        <Link href={`/photos/${prev.slug}`}>Previous: {prev.title}</Link>
        <Link href={`/photos/${next.slug}`}>Next: {next.title}</Link>
      </nav>

      {open !== null && <Lightbox album={album} index={open} onClose={close} onStep={step} />}
    </main>
  );
}
