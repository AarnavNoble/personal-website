import { notFound } from "next/navigation";
import { ALBUMS } from "@/lib/photos";
import { AlbumView } from "../AlbumView";

export const dynamicParams = false;

export function generateStaticParams() {
  return ALBUMS.map((album) => ({ slug: album.slug }));
}

export default async function AlbumPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const i = ALBUMS.findIndex((album) => album.slug === slug);
  if (i === -1) notFound();

  return (
    <AlbumView
      album={ALBUMS[i]}
      prev={ALBUMS[(i - 1 + ALBUMS.length) % ALBUMS.length]}
      next={ALBUMS[(i + 1) % ALBUMS.length]}
    />
  );
}
