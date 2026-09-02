"use client";

import { useEffect, useRef } from "react";

/**
 * Quiet backdrop: a faint dot grid, a brighter dot grid revealed only under a
 * soft spotlight that follows the cursor, and one slow monochrome glow.
 * Pure CSS + a throttled pointer handler — no canvas, no per-frame work.
 */
export function MinimalBackground() {
  const spot = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    let ticking = false;
    let px = window.innerWidth / 2;
    let py = window.innerHeight * 0.4;

    const apply = () => {
      ticking = false;
      const el = spot.current;
      if (!el) return;
      el.style.setProperty("--mx", `${px}px`);
      el.style.setProperty("--my", `${py}px`);
    };

    const onMove = (e: MouseEvent) => {
      px = e.clientX;
      py = e.clientY;
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(apply);
      }
    };

    apply();
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <>
      <div className="glow" aria-hidden />
      <div className="dotgrid-base" aria-hidden />
      <div ref={spot} className="dotgrid" aria-hidden />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0"
        style={{
          zIndex: 0,
          background:
            "radial-gradient(1200px circle at 50% -10%, rgba(255,255,255,0.03), transparent 60%)",
        }}
      />
    </>
  );
}
