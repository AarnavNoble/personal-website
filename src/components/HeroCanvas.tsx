"use client";

import { useEffect, useRef } from "react";

/**
 * Interactive constellation field. Particles drift, link to nearby neighbours,
 * and react to the cursor (gentle repulsion + brighter links near the pointer).
 * Sits fixed behind all content. Cheap: one canvas, capped particle count,
 * pauses when the tab is hidden, static fallback for reduced-motion.
 */
export function HeroCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = window.matchMedia("(max-width: 640px)").matches;

    let w = 0;
    let h = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const COUNT = mobile ? 34 : 92;
    const LINK = mobile ? 108 : 140;
    const MOUSE = 190;

    type P = { x: number; y: number; vx: number; vy: number };
    let pts: P[] = [];

    const mouse = { x: -9999, y: -9999 };
    let raf = 0;
    let running = true;

    function seed() {
      pts = Array.from({ length: COUNT }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.28,
        vy: (Math.random() - 0.5) * 0.28,
      }));
    }

    function resize() {
      w = window.innerWidth;
      h = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas!.width = w * dpr;
      canvas!.height = h * dpr;
      canvas!.style.width = w + "px";
      canvas!.style.height = h + "px";
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    }

    function step() {
      ctx!.clearRect(0, 0, w, h);

      for (const p of pts) {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < -20) p.x = w + 20;
        if (p.x > w + 20) p.x = -20;
        if (p.y < -20) p.y = h + 20;
        if (p.y > h + 20) p.y = -20;

        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const md = Math.hypot(dx, dy);
        if (md < MOUSE) {
          const f = (1 - md / MOUSE) * 0.9;
          p.x += (dx / (md || 1)) * f;
          p.y += (dy / (md || 1)) * f;
        }
      }

      for (let i = 0; i < pts.length; i++) {
        const a = pts[i];
        for (let j = i + 1; j < pts.length; j++) {
          const b = pts[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < LINK) {
            const near =
              Math.min(
                Math.hypot(a.x - mouse.x, a.y - mouse.y),
                Math.hypot(b.x - mouse.x, b.y - mouse.y),
              ) < MOUSE;
            const base = (1 - d / LINK) * 0.16;
            ctx!.strokeStyle = near
              ? `rgba(150,180,225,${base + 0.22})`
              : `rgba(150,170,205,${base})`;
            ctx!.lineWidth = 1;
            ctx!.beginPath();
            ctx!.moveTo(a.x, a.y);
            ctx!.lineTo(b.x, b.y);
            ctx!.stroke();
          }
        }
      }

      for (const p of pts) {
        const md = Math.hypot(p.x - mouse.x, p.y - mouse.y);
        const hot = md < MOUSE;
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, hot ? 1.9 : 1.3, 0, Math.PI * 2);
        ctx!.fillStyle = hot
          ? "rgba(190,210,240,0.85)"
          : "rgba(170,190,220,0.5)";
        ctx!.fill();
      }

      if (running) raf = requestAnimationFrame(step);
    }

    function onMove(e: MouseEvent) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    }
    function onLeave() {
      mouse.x = -9999;
      mouse.y = -9999;
    }
    function onVisibility() {
      running = !document.hidden;
      if (running) raf = requestAnimationFrame(step);
      else cancelAnimationFrame(raf);
    }

    resize();

    if (reduced) {
      // one static frame
      step();
      running = false;
      cancelAnimationFrame(raf);
    } else {
      raf = requestAnimationFrame(step);
      window.addEventListener("mousemove", onMove);
      document.addEventListener("mouseleave", onLeave);
      document.addEventListener("visibilitychange", onVisibility);
    }
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0"
      style={{ zIndex: 0 }}
    />
  );
}
