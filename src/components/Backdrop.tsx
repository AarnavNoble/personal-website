"use client";

import { useEffect, useRef } from "react";

/**
 * Slow organic colour field behind the hero: three blurred blobs that each
 * breathe on their own timing inside a very slowly rotating frame, with a
 * gentle cursor parallax and a fade as you scroll past the hero.
 * Transforms only — no per-pixel work.
 */
export function Backdrop() {
  const rotor = useRef<HTMLDivElement>(null);
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;

    let raf = 0;
    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;

    const tick = () => {
      cx += (tx - cx) * 0.06;
      cy += (ty - cy) * 0.06;
      if (wrap.current) {
        wrap.current.style.setProperty("--px", cx.toFixed(2) + "px");
        wrap.current.style.setProperty("--py", cy.toFixed(2) + "px");
      }
      raf = requestAnimationFrame(tick);
    };

    const onMove = (e: MouseEvent) => {
      tx = (e.clientX / window.innerWidth - 0.5) * 40;
      ty = (e.clientY / window.innerHeight - 0.5) * 40;
    };

    const onScroll = () => {
      const p = Math.min(1, window.scrollY / (window.innerHeight * 0.9));
      if (wrap.current) wrap.current.style.setProperty("--fade", String(1 - p * 0.75));
    };

    if (!reduce) {
      if (!coarse) window.addEventListener("mousemove", onMove);
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
      raf = requestAnimationFrame(tick);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div
      ref={wrap}
      aria-hidden
      className="pointer-events-none fixed inset-0 overflow-hidden"
      style={{
        zIndex: 0,
        opacity: "var(--fade, 1)",
        transform: "translate3d(var(--px,0), var(--py,0), 0)",
        transition: "opacity 0.2s linear",
      }}
    >
      <div
        ref={rotor}
        className="absolute inset-[-20%]"
        style={{ animation: "spin 140s linear infinite" }}
      >
        <div className="field-blob field-blob-1" />
        <div className="field-blob field-blob-2" />
        <div className="field-blob field-blob-3" />
      </div>
      {/* vignette to keep edges dark */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 80% at 50% 120%, transparent 40%, var(--bg) 88%)",
        }}
      />
    </div>
  );
}
