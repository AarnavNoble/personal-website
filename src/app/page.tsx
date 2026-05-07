"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { LINKS, PROJECTS } from "@/lib/data";

const PROJECT_COLORS = [
  { bg: "rgba(59,130,246,0.07)", border: "rgba(59,130,246,0.25)", accent: "#3b82f6" },
  { bg: "rgba(139,92,246,0.07)", border: "rgba(139,92,246,0.25)", accent: "#8b5cf6" },
];

// ─── Globe visual ─────────────────────────────────────────────────────────
const CITIES = [
  { name: "Waterloo",   lat: 43.46,  lng: -80.52 },
  { name: "London",     lat: 51.51,  lng:  -0.13 },
  { name: "Toronto",    lat: 43.65,  lng: -79.38 },
  { name: "Tokyo",      lat: 35.68,  lng: 139.69 },
  { name: "Lisbon",     lat: 38.72,  lng:  -9.14 },
  { name: "Dubai",      lat: 25.20,  lng:  55.27 },
];

const ARCS = [
  [0, 1], // Waterloo → London
  [0, 3], // Waterloo → Tokyo
  [1, 4], // London → Lisbon
  [2, 5], // Toronto → Dubai
];

function project(lat: number, lng: number, R: number, rot: number) {
  const phi = (lat * Math.PI) / 180;
  const lam = (lng * Math.PI) / 180 + rot;
  const x = R * Math.cos(phi) * Math.cos(lam);
  const y = -R * Math.sin(phi);
  const z = R * Math.cos(phi) * Math.sin(lam);
  return { x, y, z };
}

function GlobeCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    let raf = 0;
    let rot = 0.6;

    function resize() {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.scale(dpr, dpr);
    }

    function draw() {
      const W = canvas.offsetWidth;
      const H = canvas.offsetHeight;
      const cx = W / 2, cy = H / 2;
      const R = Math.min(W, H) * 0.4;
      ctx.clearRect(0, 0, W, H);

      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(99,102,241,0.15)";
      ctx.lineWidth = 1;
      ctx.stroke();

      for (let lat = -60; lat <= 60; lat += 30) {
        ctx.beginPath();
        let s = false;
        for (let lng = -180; lng <= 180; lng += 2) {
          const p = project(lat, lng, R, rot);
          if (p.z < 0) { s = false; continue; }
          s ? ctx.lineTo(cx + p.x, cy + p.y) : (ctx.moveTo(cx + p.x, cy + p.y), (s = true));
        }
        ctx.strokeStyle = "rgba(99,102,241,0.1)";
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      for (let lng = 0; lng < 360; lng += 30) {
        ctx.beginPath();
        let s = false;
        for (let lat = -90; lat <= 90; lat += 2) {
          const p = project(lat, lng, R, rot);
          if (p.z < 0) { s = false; continue; }
          s ? ctx.lineTo(cx + p.x, cy + p.y) : (ctx.moveTo(cx + p.x, cy + p.y), (s = true));
        }
        ctx.strokeStyle = "rgba(99,102,241,0.1)";
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      const t = (Date.now() / 3000) % 1;
      for (const [ai, bi] of ARCS) {
        const a = CITIES[ai], b = CITIES[bi];
        ctx.beginPath();
        let s = false;
        for (let step = 0; step <= 60; step++) {
          const f = step / 60;
          const p = project(a.lat + (b.lat - a.lat) * f, a.lng + (b.lng - a.lng) * f, R * 1.02, rot);
          if (p.z < 0) { s = false; continue; }
          s ? ctx.lineTo(cx + p.x, cy + p.y) : (ctx.moveTo(cx + p.x, cy + p.y), (s = true));
        }
        ctx.strokeStyle = "rgba(139,92,246,0.28)";
        ctx.lineWidth = 0.8;
        ctx.stroke();

        const tp = project(a.lat + (b.lat - a.lat) * t, a.lng + (b.lng - a.lng) * t, R * 1.02, rot);
        if (tp.z >= 0) {
          ctx.beginPath();
          ctx.arc(cx + tp.x, cy + tp.y, 2, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(167,139,250,0.9)";
          ctx.fill();
        }
      }

      for (const city of CITIES) {
        const p = project(city.lat, city.lng, R, rot);
        if (p.z < 0) continue;
        ctx.beginPath();
        ctx.arc(cx + p.x, cy + p.y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(139,92,246,0.85)";
        ctx.fill();
        ctx.beginPath();
        ctx.arc(cx + p.x, cy + p.y, 5, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(139,92,246,0.12)";
        ctx.fill();
      }

      rot += 0.0025;
      raf = requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener("resize", resize);
    raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full" style={{ display: "block" }} />;
}

function WaveformCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    let raf = 0, t = 0;

    function resize() {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.scale(dpr, dpr);
    }

    function draw() {
      const W = canvas.offsetWidth, H = canvas.offsetHeight;
      ctx.clearRect(0, 0, W, H);

      // Raw noisy signal — top half
      const mid1 = H * 0.28;
      ctx.beginPath();
      for (let x = 0; x <= W; x += 1.5) {
        const y = mid1
          + Math.sin(x * 0.07 + t * 1.1) * 14
          + Math.sin(x * 0.19 + t * 0.8) * 8
          + Math.sin(x * 0.41 + t * 1.6) * 5
          + (Math.random() - 0.5) * 3;
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.strokeStyle = "rgba(139,92,246,0.28)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Divider
      ctx.beginPath();
      ctx.moveTo(16, H * 0.5);
      ctx.lineTo(W - 16, H * 0.5);
      ctx.strokeStyle = "rgba(139,92,246,0.08)";
      ctx.lineWidth = 0.5;
      ctx.stroke();

      // Clean isolated vocal — bottom half
      const mid2 = H * 0.72;
      ctx.beginPath();
      for (let x = 0; x <= W; x += 1.5) {
        const y = mid2
          + Math.sin(x * 0.038 + t * 0.55) * 16
          + Math.sin(x * 0.078 + t * 0.85) * 6;
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.strokeStyle = "rgba(139,92,246,0.75)";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Labels
      ctx.font = "9px monospace";
      ctx.fillStyle = "rgba(139,92,246,0.35)";
      ctx.fillText("raw audio", 10, mid1 - 18);
      ctx.fillStyle = "rgba(139,92,246,0.6)";
      ctx.fillText("isolated vocal", 10, mid2 - 20);

      t += 0.016;
      raf = requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener("resize", resize);
    raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full" style={{ display: "block" }} />;
}

// ─── 3D tilt card ──────────────────────────────────────────────────────────
function TiltCard({ href, color, children }: {
  href: string;
  color: typeof PROJECT_COLORS[0];
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  function onMove(e: React.MouseEvent) {
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    setTilt({ x, y });
  }

  return (
    <Link
      ref={ref}
      href={href}
      onMouseMove={onMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      className="block p-4 rounded-xl"
      style={{
        background: color.bg,
        border: `1px solid ${color.border}`,
        transform: `perspective(700px) rotateX(${-tilt.y * 9}deg) rotateY(${tilt.x * 9}deg) scale(${tilt.x || tilt.y ? 1.015 : 1})`,
        transition: tilt.x === 0 && tilt.y === 0 ? "transform 0.5s ease, box-shadow 0.5s ease" : "transform 0.08s ease",
        boxShadow: (tilt.x || tilt.y) ? `0 12px 40px rgba(0,0,0,0.35), 0 0 0 1px ${color.border}` : "none",
        willChange: "transform",
      }}
    >
      {children}
    </Link>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────
export default function Home() {
  const [copied, setCopied] = useState(false);

  function copyEmail() {
    navigator.clipboard.writeText(LINKS.email).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement) return;
      if (e.metaKey || e.ctrlKey) return;
      if (e.key === "g") window.open(LINKS.github, "_blank");
      if (e.key === "l") window.open(LINKS.linkedin, "_blank");
      if (e.key === "e") copyEmail();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden">

      {/* Ambient gradient orbs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden" style={{ zIndex: 1 }}>
        <div style={{
          position: "absolute", top: "-80px", left: "-15%",
          width: "55%", height: "420px",
          background: "radial-gradient(ellipse, rgba(99,102,241,0.12) 0%, transparent 70%)",
          filter: "blur(50px)",
        }} />
        <div style={{
          position: "absolute", top: "60px", right: "-10%",
          width: "45%", height: "320px",
          background: "radial-gradient(ellipse, rgba(139,92,246,0.08) 0%, transparent 70%)",
          filter: "blur(50px)",
        }} />
      </div>

      {/* Sticky blur header */}
      <div className="blur-fade" style={{ zIndex: 10 }} />

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-20">
        <div className="max-w-[620px] mx-auto px-6 h-11 flex items-center justify-between">
          <span className="text-[13px]" style={{ color: "var(--g10)" }}>Aarnav Noble</span>
          <div className="flex items-center gap-5">
            <a href={LINKS.github} target="_blank" rel="noopener" className="link-dim text-[13px]">GitHub</a>
            <a href={LINKS.linkedin} target="_blank" rel="noopener" className="link-dim text-[13px]">LinkedIn</a>
          </div>
        </div>
      </nav>

      {/* Main */}
      <main className="flex-1 max-w-[620px] mx-auto px-6 pt-24 pb-20 w-full" style={{ position: "relative", zIndex: 2 }}>

        <h1
          data-animate
          style={{ "--stagger": 0 } as React.CSSProperties}
          className="text-[46px] sm:text-[54px] font-bold tracking-[-0.03em] leading-none mb-5"
        >
          Aarnav Noble
        </h1>

        <div
          data-animate
          style={{ "--stagger": 1 } as React.CSSProperties}
          className="flex items-center gap-2 mb-8"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: "#22c55e" }} />
            <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: "#22c55e" }} />
          </span>
          <span className="text-[11px] font-mono" style={{ color: "var(--g7)" }}>
            Computer Engineering · University of Waterloo
          </span>
        </div>

        <div
          data-animate
          style={{ "--stagger": 2 } as React.CSSProperties}
          className="space-y-3"
        >
          <p className="text-[15px] leading-[1.75]" style={{ color: "var(--g11)" }}>
            Second-year Computer Engineering student at Waterloo, on co-op. I build ML systems
            and the infrastructure that runs them — most recently at{" "}
            <span style={{ color: "var(--g12)" }}>AethexAI</span> (stealth voice AI), and before
            that doing ML research at Environment and Climate Change Canada.
          </p>
          <p className="text-[15px] leading-[1.75]" style={{ color: "var(--g8)" }}>
            I'm drawn to hard problems in retrieval, speech, and distributed systems. Outside of
            that — travelling, photography, film and TV, and following soccer, MMA, and tennis.
          </p>
        </div>

        {/* Project cards with visuals */}
        <div
          data-animate
          style={{ "--stagger": 3 } as React.CSSProperties}
          className="grid grid-cols-2 gap-3 mb-10 mt-10"
        >
          {PROJECTS.map((p, i) => {
            const c = PROJECT_COLORS[i] ?? PROJECT_COLORS[0];
            return (
              <div key={p.slug} className="flex flex-col gap-2">
                <div
                  className="rounded-xl overflow-hidden"
                  style={{ border: "1px solid var(--g3)", background: "var(--g1)", height: 150 }}
                >
                  {i === 0 ? <GlobeCanvas /> : <WaveformCanvas />}
                </div>
                <TiltCard href="/projects" color={c}>
                  <div className="flex items-center gap-1.5 mb-2">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: c.accent }} />
                    <p className="text-[13px] font-semibold" style={{ color: "var(--g12)" }}>{p.name}</p>
                  </div>
                  <p className="text-[11px] leading-relaxed mb-3" style={{ color: "var(--g8)" }}>
                    {p.tagline.split(" — ")[0]}
                  </p>
                  <div className="grid grid-cols-2 gap-1">
                    {p.stack.slice(0, 3).map((t, j) => (
                      <span
                        key={t}
                        className={`text-[10px] font-mono px-1.5 py-0.5 rounded${j === 2 ? " col-span-2" : ""}`}
                        style={{ color: c.accent, background: c.bg, border: `1px solid ${c.border}` }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </TiltCard>
              </div>
            );
          })}
        </div>

        <div
          data-animate
          style={{ "--stagger": 5 } as React.CSSProperties}
          className="flex flex-wrap gap-x-6 gap-y-3 text-[14px]"
        >
          <Link href="/work" className="link font-medium">Work →</Link>
          <Link href="/projects" className="link font-medium">Projects →</Link>
          <span style={{ color: "var(--g6)" }}>·</span>
          <a href={LINKS.github} target="_blank" rel="noopener" className="link-dim">GitHub ↗</a>
          <a href={LINKS.linkedin} target="_blank" rel="noopener" className="link-dim">LinkedIn ↗</a>
          <button onClick={copyEmail} className="link-dim">
            {copied ? "Copied ✓" : "Email"}
          </button>
        </div>
      </main>

      <footer className="max-w-[620px] mx-auto px-6 pb-8 w-full" style={{ position: "relative", zIndex: 2 }}>
        <p className="text-[11px] font-mono" style={{ color: "var(--g6)" }}>g · l · e</p>
      </footer>
    </div>
  );
}
