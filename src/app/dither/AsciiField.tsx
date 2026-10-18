"use client";

import { useEffect, useRef } from "react";
import { threshold } from "./dither";

const FONT_SIZE = 12;
const LINE = 1.65;
const GLYPHS = "#%&$*+=:0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const FRAME_MS = 90;
const POINTER_RADIUS = 9; // in cells
// Where the photo is drawn, as fractions of the field.
const REGION = { x: 0.5, y: 0.04, w: 0.5, h: 0.92 };

type Props = { src: string; phrases: string[] };

// A full-bleed field of faint monospace text. A photo is ordered-dithered into
// it: cells the photo lights up are drawn bright, and a few of those glitch to
// random glyphs each frame. Cells near the pointer scramble and brighten.
export function AsciiField({ src, phrases }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const stream = phrases.join("  ·  ").toUpperCase() + "  ·  ";
    const img = new Image();
    let cols = 0;
    let rows = 0;
    let cw = 0;
    let ch = 0;
    let light: Float32Array = new Float32Array(0);
    let pointer: { c: number; r: number } | null = null;
    let timer = 0;
    let visible = true;
    let font = "";

    function layout() {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      font = `400 ${FONT_SIZE}px ${getComputedStyle(canvas).fontFamily}`;
      ctx.font = font;
      cw = ctx.measureText("M").width;
      ch = FONT_SIZE * LINE;
      cols = Math.ceil(rect.width / cw);
      rows = Math.ceil(rect.height / ch);
      sample();
    }

    // Brightness of the photo at each cell inside REGION, faded at its edges.
    function sample() {
      light = new Float32Array(cols * rows);
      if (!img.complete || !img.naturalWidth) return;
      const rc0 = Math.floor(cols * REGION.x);
      const rr0 = Math.floor(rows * REGION.y);
      const rcw = Math.max(1, Math.floor(cols * REGION.w));
      const rrh = Math.max(1, Math.floor(rows * REGION.h));
      const off = document.createElement("canvas");
      // Cells are taller than wide, so sample at the cell aspect.
      off.width = rcw;
      off.height = rrh;
      const octx = off.getContext("2d", { willReadFrequently: true })!;
      const target = (rcw * cw) / (rrh * ch);
      const srcAspect = img.width / img.height;
      let sw = img.width;
      let sh = img.height;
      if (srcAspect > target) sw = img.height * target;
      else sh = img.width / target;
      octx.drawImage(img, (img.width - sw) / 2, (img.height - sh) / 2, sw, sh, 0, 0, rcw, rrh);
      const px = octx.getImageData(0, 0, rcw, rrh).data;
      for (let r = 0; r < rrh; r++) {
        for (let c = 0; c < rcw; c++) {
          const i = (r * rcw + c) * 4;
          const l = (0.299 * px[i] + 0.587 * px[i + 1] + 0.114 * px[i + 2]) / 255;
          const u = c / rcw;
          const v = r / rrh;
          const edge = Math.min(u, 1 - u, v, 1 - v) / 0.18;
          const fade = Math.min(1, edge) ** 1.5;
          light[(rr0 + r) * cols + rc0 + c] = Math.min(1, Math.max(0, (l - 0.28) * 1.7)) * fade;
        }
      }
    }

    function draw() {
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);
      ctx.font = font;
      ctx.textBaseline = "top";
      // Bucket cells by brightness so fillStyle changes a handful of times per frame.
      const levels: [number, number, string][][] = [[], [], [], []];
      const alpha = [0.08, 0.38, 0.66, 0.96];
      const len = stream.length;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          let glyph = stream[(r * 23 + c) % len];
          const v = light[r * cols + c];
          let level = 0;
          if (v > threshold(c, r)) {
            level = v > 0.66 ? 3 : v > 0.36 ? 2 : 1;
            // The image must read as a solid shape, so its cells never stay blank.
            if (glyph === " " || glyph === "·") glyph = GLYPHS[(c * 7 + r * 13) % GLYPHS.length];
            if (!reduced && Math.random() < 0.035) glyph = GLYPHS[(Math.random() * GLYPHS.length) | 0];
          }
          if (glyph === " " && !pointer) continue;
          if (pointer) {
            const d = Math.hypot((c - pointer.c) * (cw / ch), r - pointer.r);
            if (d < POINTER_RADIUS) {
              const k = 1 - d / POINTER_RADIUS;
              level = Math.max(level, k > 0.6 ? 3 : k > 0.3 ? 2 : 1);
              if (Math.random() < k * 0.5) glyph = GLYPHS[(Math.random() * GLYPHS.length) | 0];
            }
          }
          if (glyph === " ") continue;
          levels[level].push([c * cw, r * ch, glyph]);
        }
      }
      for (let l = 0; l < levels.length; l++) {
        ctx.fillStyle = `rgba(237,237,237,${alpha[l]})`;
        for (const [x, y, g] of levels[l]) ctx.fillText(g, x, y);
      }
    }

    function loop() {
      draw();
      if (!reduced && visible) timer = window.setTimeout(loop, FRAME_MS);
    }

    function onMove(e: PointerEvent) {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      pointer = x >= 0 && y >= 0 && x <= rect.width && y <= rect.height ? { c: x / cw, r: y / ch } : null;
    }

    const io = new IntersectionObserver(([entry]) => {
      const was = visible;
      visible = entry.isIntersecting;
      if (visible && !was) loop();
    });

    const resize = new ResizeObserver(() => {
      layout();
      draw();
    });

    let cancelled = false;
    document.fonts.ready.then(() => {
      if (cancelled) return;
      layout();
      img.onload = () => {
        sample();
        draw();
      };
      img.src = src;
      resize.observe(canvas);
      io.observe(canvas);
      loop();
    });

    if (!reduced) window.addEventListener("pointermove", onMove);
    return () => {
      cancelled = true;
      clearTimeout(timer);
      resize.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
    };
  }, [src, phrases]);

  return <canvas ref={ref} aria-hidden="true" className="ascii" />;
}
