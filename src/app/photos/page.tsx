import type { Metadata } from "next";
import Link from "next/link";
import { ALBUMS, CAMERA } from "@/lib/photos";
import { Window } from "@/components/dither/Window";
import { albumTag } from "@/components/dither/tags";

export const metadata: Metadata = { title: "Photos | Aarnav Noble" };

export default function Photos() {
  return (
    <main className="wrap page">
      <header className="page-head">
        <h1 className="mega">
          <span>Photos.</span>
          <span className="dim">Shot on a {CAMERA}.</span>
        </h1>
        <p className="page-sub">Open an album for every shot.</p>
      </header>

      <ul className="albums">
        {ALBUMS.map((album) => {
          const cover = album.photos[0];
          const count = album.photos.length;
          return (
            <li key={album.slug}>
              <Window tag={albumTag(album.slug)}>
                <Link href={`/photos/${album.slug}`} className="photo plain" aria-label={`${album.title}, ${count} photos`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={cover.thumb} alt={cover.alt} loading="lazy" decoding="async" />
                </Link>
              </Window>
              <div className="album-meta">
                <p className="photo-title">{album.title}</p>
                <p className="row-period">{count} {count === 1 ? "frame" : "frames"}</p>
              </div>
              <p className="photo-place">{[album.place, album.date].filter(Boolean).join(", ")}</p>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
