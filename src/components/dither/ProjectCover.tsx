"use client";

import { useEffect, useRef } from "react";
import { ditherColor } from "./dither";

// Each project gets a small generated scene drawn from what the project does,
// then colour-dithered like the photos.
type Scene = (ctx: CanvasRenderingContext2D, w: number, h: number) => void;

function rand(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

function glow(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, colour: string) {
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, colour);
  g.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

const SCENES: Record<string, Scene> = {
  // A trace waterfall: nested spans of an agent run, as in a tracing UI.
  vestige(ctx, w, h) {
    glow(ctx, w * 0.2, h * 0.1, w * 0.9, "rgba(20,120,140,0.55)");
    const r = rand(7);
    const rows = 9;
    const rowH = h / (rows + 2);
    let start = w * 0.08;
    for (let i = 0; i < rows; i++) {
      const len = w * (0.25 + r() * 0.5) * (1 - i * 0.05);
      const g = ctx.createLinearGradient(start, 0, start + len, 0);
      g.addColorStop(0, `hsl(${175 + i * 6} 80% ${62 - i * 2}%)`);
      g.addColorStop(1, `hsl(${200 + i * 6} 85% ${48 - i * 2}%)`);
      ctx.fillStyle = g;
      ctx.fillRect(start, rowH * (i + 1), len, rowH * 0.62);
      start += w * (0.02 + r() * 0.05);
    }
  },
  // Paged KV cache: a grid of blocks, warmer where more sequences share them.
  "llm-engine"(ctx, w, h) {
    glow(ctx, w * 0.8, h * 0.2, w, "rgba(120,40,200,0.55)");
    const cols = 16;
    const rows = 9;
    const bw = w / cols;
    const bh = h / rows;
    const r = rand(3);
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const heat = Math.max(0, 1 - Math.hypot(x / cols - 0.62, y / rows - 0.45) * 1.6) + r() * 0.25;
        if (heat < 0.2) continue;
        ctx.fillStyle = `hsl(${290 - heat * 70} 85% ${28 + heat * 40}%)`;
        ctx.fillRect(x * bw + 2, y * bh + 2, bw - 4, bh - 4);
      }
    }
  },
  // A walking route between stops over warm terrain.
  roam(ctx, w, h) {
    const sky = ctx.createLinearGradient(0, 0, 0, h);
    sky.addColorStop(0, "#1d4a3a");
    sky.addColorStop(1, "#c98a2e");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, h);
    glow(ctx, w * 0.75, h * 0.3, w * 0.6, "rgba(255,210,120,0.5)");
    const pts = [
      [0.1, 0.78], [0.26, 0.55], [0.42, 0.66], [0.58, 0.36], [0.76, 0.5], [0.9, 0.22],
    ].map(([x, y]) => [x * w, y * h]);
    ctx.strokeStyle = "#f6f1e3";
    ctx.lineWidth = Math.max(2, w / 90);
    ctx.setLineDash([w / 40, w / 60]);
    ctx.beginPath();
    pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = "#ffffff";
    for (const [x, y] of pts) {
      ctx.beginPath();
      ctx.arc(x, y, w / 45, 0, Math.PI * 2);
      ctx.fill();
    }
  },
  // A speech waveform resolving into phonemes.
  "dothraki-asr"(ctx, w, h) {
    glow(ctx, w * 0.5, h * 0.5, w * 0.7, "rgba(220,90,40,0.6)");
    const r = rand(11);
    const bars = 48;
    const bw = w / bars;
    for (let i = 0; i < bars; i++) {
      const env = Math.sin((i / bars) * Math.PI) ** 0.8;
      const amp = env * (0.2 + r() * 0.8) * h * 0.4;
      ctx.fillStyle = `hsl(${18 + (i / bars) * 30} 90% ${45 + env * 20}%)`;
      ctx.fillRect(i * bw + 1, h / 2 - amp, bw - 2, amp * 2);
    }
  },
  // Burned area spreading across a region, hottest at the core.
  "flame-forecaster"(ctx, w, h) {
    ctx.fillStyle = "#1a1408";
    ctx.fillRect(0, 0, w, h);
    glow(ctx, w * 0.45, h * 0.7, w * 0.75, "rgba(255,80,20,0.85)");
    glow(ctx, w * 0.5, h * 0.75, w * 0.35, "rgba(255,210,60,0.9)");
    glow(ctx, w * 0.8, h * 0.3, w * 0.3, "rgba(255,120,30,0.5)");
  },
};

export function ProjectCover({ slug, cell = 3, levels = 4 }: { slug: string; cell?: number; levels?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
    const scene = SCENES[slug];

    function draw() {
      const rect = canvas.getBoundingClientRect();
      const w = Math.max(1, Math.round(rect.width / cell));
      const h = Math.max(1, Math.round(rect.height / cell));
      canvas.width = w;
      canvas.height = h;
      ctx.fillStyle = "#0d0d0d";
      ctx.fillRect(0, 0, w, h);
      scene?.(ctx, w, h);
      const image = ctx.getImageData(0, 0, w, h);
      ditherColor(image, levels);
      ctx.putImageData(image, 0, 0);
    }

    draw();
    const resize = new ResizeObserver(draw);
    resize.observe(canvas);
    return () => resize.disconnect();
  }, [slug, cell, levels]);

  return <canvas ref={ref} aria-hidden="true" className="dither-photo cover" />;
}
