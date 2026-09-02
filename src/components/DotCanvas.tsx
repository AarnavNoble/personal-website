"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const GAP = 22;
const BASE_R = 0.85;
const MAX_R = 1.4;
const REACH = 90;

export function DotCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/") return;
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    let mx = -2000, my = -2000;
    let raf = 0;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cols = Math.ceil(canvas.width / GAP) + 1;
      const rows = Math.ceil(canvas.height / GAP) + 1;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = c * GAP;
          const y = r * GAP;
          const d = Math.hypot(x - mx, y - my);
          const t = Math.max(0, 1 - d / REACH);
          const radius = BASE_R + t * (MAX_R - BASE_R);
          const alpha = 0.11 + t * 0.22;
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(200,215,240,${alpha})`;
          ctx.fill();
        }
      }
      raf = requestAnimationFrame(draw);
    }

    const onMove = (e: MouseEvent) => { mx = e.clientX; my = e.clientY; };
    const onLeave = () => { mx = -2000; my = -2000; };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, [pathname]);

  if (pathname === "/") return null;

  return (
    <canvas
      ref={ref}
      className="pointer-events-none fixed inset-0"
      style={{ zIndex: 0 }}
    />
  );
}
