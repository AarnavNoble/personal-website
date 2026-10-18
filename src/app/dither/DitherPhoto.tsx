"use client";

import { useEffect, useRef } from "react";
import { paint, readInk } from "./dither";

const LIGHT_RADIUS = 0.35;
const LIGHT_STRENGTH = 0.45;
// How much of each edge fades to paper, so the image has no hard frame.
const EDGE = 0.08;

function smooth(t: number) {
  const c = Math.min(1, Math.max(0, t));
  return c * c * (3 - 2 * c);
}

// A photo rendered as ordered-dither dots. The pointer acts as a light that
// lifts the tone around it, so the pattern reorganises as you move.
export function DitherPhoto({ src, alt, cell = 3 }: { src: string; alt: string; cell?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const scheme = window.matchMedia("(prefers-color-scheme: dark)");
    const img = new Image();
    let luma: Float32Array | null = null;
    let w = 0;
    let h = 0;
    let light: { x: number; y: number } | null = null;
    let ink = readInk(canvas);
    let raf = 0;

    function sample() {
      const rect = canvas.getBoundingClientRect();
      w = Math.max(1, Math.round(rect.width / cell));
      h = Math.max(1, Math.round(rect.height / cell));
      canvas.width = w;
      canvas.height = h;
      const scale = Math.max(w / img.width, h / img.height);
      const dw = img.width * scale;
      const dh = img.height * scale;
      ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh);
      const px = ctx.getImageData(0, 0, w, h).data;
      // Decide from the ink itself rather than the media query, so the mapping
      // always matches the colours actually on screen.
      const inkIsLight = (0.299 * ink[0] + 0.587 * ink[1] + 0.114 * ink[2]) / 255 > 0.5;
      luma = new Float32Array(w * h);
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const i = y * w + x;
          const l = (0.299 * px[i * 4] + 0.587 * px[i * 4 + 1] + 0.114 * px[i * 4 + 2]) / 255;
          // Ink stands for shadow on light paper and for light on dark paper,
          // so the photo never prints as a negative.
          // Capped below 1 so even the brightest sky keeps a dot texture.
          const t = inkIsLight ? Math.min(0.62, (l - 0.5) * 1.05 + 0.38) : (0.5 - l) * 1.25 + 0.4;
          const edge = smooth(Math.min(x / w, 1 - x / w, y / h, 1 - y / h) / EDGE);
          luma[i] = Math.min(1, Math.max(0, t)) * edge;
        }
      }
    }

    function draw() {
      raf = 0;
      if (!luma) return;
      const l = luma;
      const r2 = (LIGHT_RADIUS * w) ** 2;
      const image = ctx.createImageData(w, h);
      paint(
        image.data,
        w,
        h,
        (x, y) => {
          let t = l[y * w + x];
          if (light) {
            const dx = x - light.x;
            const dy = y - light.y;
            t -= LIGHT_STRENGTH * Math.exp(-(dx * dx + dy * dy) / r2);
          }
          return t;
        },
        ink,
      );
      ctx.putImageData(image, 0, 0);
    }

    function schedule() {
      if (!raf) raf = requestAnimationFrame(draw);
    }

    function onMove(e: PointerEvent) {
      const rect = canvas.getBoundingClientRect();
      light = {
        x: ((e.clientX - rect.left) / rect.width) * w,
        y: ((e.clientY - rect.top) / rect.height) * h,
      };
      schedule();
    }

    function onLeave() {
      light = null;
      schedule();
    }

    function onScheme() {
      ink = readInk(canvas);
      if (img.complete) sample();
      schedule();
    }

    const resize = new ResizeObserver(() => {
      if (!img.complete) return;
      sample();
      schedule();
    });

    img.onload = () => {
      sample();
      schedule();
      resize.observe(canvas);
    };
    img.src = src;

    if (!reduced) {
      canvas.addEventListener("pointermove", onMove);
      canvas.addEventListener("pointerleave", onLeave);
    }
    scheme.addEventListener("change", onScheme);
    return () => {
      cancelAnimationFrame(raf);
      resize.disconnect();
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
      scheme.removeEventListener("change", onScheme);
    };
  }, [src, cell]);

  return <canvas ref={ref} role="img" aria-label={alt} className="dither-photo" />;
}
