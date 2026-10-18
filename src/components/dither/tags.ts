import { ALBUMS } from "@/lib/photos";

// File-name tags shown above each window.
export const FILE_TAGS: Record<string, string> = {
  vestige: "VESTIGE.GO",
  "llm-engine": "ENGINE.CU",
  roam: "ROAM.PY",
  "dothraki-asr": "DOTHRAKI.IPYNB",
  "flame-forecaster": "FLAME.PY",
};

export function albumTag(slug: string) {
  return `${slug.toUpperCase().replace(/-/g, "_")}.RAW`;
}

export function cover(slug: string) {
  return ALBUMS.find((a) => a.slug === slug)?.photos[0].thumb ?? "";
}

export function anchor(name: string) {
  return name.toLowerCase().replace(/\W+/g, "-");
}
