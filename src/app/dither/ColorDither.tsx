"use client";

import { useEffect, useRef } from "react";
import { threshold } from "./dither";

// Colour ordered dithering: each channel is reduced to LEVELS steps, with the
// Bayer matrix deciding which way each pixel rounds. The photo stays fully
// recognisable but every pixel lands on a small fixed palette.
const LEVELS = 4;

export function ColorDither({ src, alt, cell = 2 }: { src: string; alt: string; cell?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
    const img = new Image();

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
      const d = image.data;
      const steps = LEVELS - 1;
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const t = threshold(x, y);
          const i = (y * w + x) * 4;
          for (let k = 0; k < 3; k++) {
            const v = d[i + k] / 255;
            d[i + k] = (Math.min(steps, Math.floor(v * steps + t)) / steps) * 255;
          }
          d[i + 3] = 255;
        }
      }
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
  }, [src, cell]);

  return <canvas ref={ref} role="img" aria-label={alt} className="dither-photo" />;
}
