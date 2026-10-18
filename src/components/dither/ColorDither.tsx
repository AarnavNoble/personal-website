"use client";

import { useEffect, useRef } from "react";
import { ditherColor } from "./dither";

type Props = {
  src: string;
  alt: string;
  /** Size of one dither cell in CSS pixels. */
  cell?: number;
  /** Steps per colour channel. */
  levels?: number;
};

// A photo cover-fitted into its box and colour-dithered at `cell` resolution.
export function ColorDither({ src, alt, cell = 2, levels = 4 }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
    const img = new Image();
    img.decoding = "async";

    function draw() {
      const rect = canvas.getBoundingClientRect();
      const w = Math.max(1, Math.round(rect.width / cell));
      const h = Math.max(1, Math.round(rect.height / cell));
      canvas.width = w;
      canvas.height = h;
      const scale = Math.max(w / img.width, h / img.height);
      const dw = img.width * scale;
      const dh = img.height * scale;
      ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh);
      const image = ctx.getImageData(0, 0, w, h);
      ditherColor(image, levels);
      ctx.putImageData(image, 0, 0);
    }

    const resize = new ResizeObserver(() => {
      if (img.complete && img.naturalWidth) draw();
    });
    img.onload = () => {
      draw();
      resize.observe(canvas);
    };
    img.src = src;
    return () => resize.disconnect();
  }, [src, cell, levels]);

  return (
    <canvas
      ref={ref}
      role={alt ? "img" : undefined}
      aria-label={alt || undefined}
      aria-hidden={alt ? undefined : true}
      className="dither-photo"
    />
  );
}
