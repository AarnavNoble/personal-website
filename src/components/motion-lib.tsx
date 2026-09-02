"use client";

import {
  motion,
  useInView,
  useScroll,
  useSpring,
  animate,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import type { ReactNode, CSSProperties } from "react";

const EASE = [0.16, 1, 0.3, 1] as const;

/* ── FadeUp: entrance on mount ───────────────────────────── */
export function FadeUp({
  children, delay = 0, y = 18, className, style,
}: {
  children: ReactNode; delay?: number; y?: number; className?: string; style?: CSSProperties;
}) {
  return (
    <motion.div
      className={className}
      style={style}
      initial={{ opacity: 0, y }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/* ── Reveal: entrance when scrolled into view ────────────── */
export function Reveal({
  children, delay = 0, y = 20, className, style,
}: {
  children: ReactNode; delay?: number; y?: number; className?: string; style?: CSSProperties;
}) {
  return (
    <motion.div
      className={className}
      style={style}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -60px 0px" }}
      transition={{ duration: 0.7, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/* ── CharReveal: per-character blur + rise (hero) ────────── */
export function CharReveal({
  text, delay = 0, className, style,
}: {
  text: string; delay?: number; className?: string; style?: CSSProperties;
}) {
  const chars = Array.from(text);
  return (
    <motion.span
      className={className}
      style={{ display: "block", ...style }}
      initial="hidden"
      animate="show"
      variants={{ show: { transition: { staggerChildren: 0.045, delayChildren: delay } } }}
      aria-label={text}
    >
      {chars.map((c, i) => (
        <motion.span
          key={i}
          aria-hidden
          className="inline-block"
          variants={{
            hidden: { y: "0.62em", opacity: 0, filter: "blur(10px)" },
            show: { y: 0, opacity: 1, filter: "blur(0px)", transition: { duration: 0.7, ease: EASE } },
          }}
        >
          {c === " " ? " " : c}
        </motion.span>
      ))}
    </motion.span>
  );
}

/* ── Words: word-by-word rise, on scroll ─────────────────── */
export function Words({
  text, delay = 0, className, style,
}: {
  text: string; delay?: number; className?: string; style?: CSSProperties;
}) {
  const words = text.split(" ");
  return (
    <motion.span
      className={className}
      style={{ display: "inline-block", ...style }}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -40px 0px" }}
      variants={{ show: { transition: { staggerChildren: 0.055, delayChildren: delay } } }}
    >
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom" style={{ marginRight: i < words.length - 1 ? "0.28em" : 0 }}>
          <motion.span
            className="inline-block"
            variants={{
              hidden: { y: "115%" },
              show: { y: 0, transition: { duration: 0.6, ease: EASE } },
            }}
          >
            {w}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}

/* ── LineReveal: clip-path wipe ──────────────────────────── */
export function LineReveal({
  children, delay = 0, immediate = false, className, style,
}: {
  children: ReactNode; delay?: number; immediate?: boolean; className?: string; style?: CSSProperties;
}) {
  const hidden = { clipPath: "inset(0 0 108% 0)", y: "0.35em" };
  const shown = { clipPath: "inset(0 0 -8% 0)", y: 0 };
  return (
    <motion.div
      className={className}
      style={style}
      initial={hidden}
      {...(immediate
        ? { animate: shown }
        : { whileInView: shown, viewport: { once: true, margin: "0px 0px -40px 0px" } })}
      transition={{ duration: 0.85, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/* ── CountUp: roll a number when it enters view ──────────── */
export function CountUp({
  to, pad = 0, className, style,
}: {
  to: number; pad?: number; className?: string; style?: CSSProperties;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -40px 0px" });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, to, {
      duration: 1.3,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setVal(v),
    });
    return () => controls.stop();
  }, [inView, to]);

  const shown = String(Math.round(val)).padStart(pad, "0");
  return (
    <span ref={ref} className={className} style={style}>
      {shown}
    </span>
  );
}

/* ── Scramble: decode-in effect for short labels ─────────── */
const GLYPHS = "01·/<>[]#";
export function Scramble({
  text, className, style,
}: {
  text: string; className?: string; style?: CSSProperties;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [out, setOut] = useState(text);

  useEffect(() => {
    if (!inView) return;
    let frame = 0;
    const total = 16;
    const id = setInterval(() => {
      frame++;
      const locked = Math.floor((frame / total) * text.length);
      setOut(
        text
          .split("")
          .map((ch, i) => (i < locked ? ch : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]))
          .join(""),
      );
      if (frame >= total) {
        clearInterval(id);
        setOut(text);
      }
    }, 32);
    return () => clearInterval(id);
  }, [inView, text]);

  return (
    <span ref={ref} className={className} style={style}>
      {out}
    </span>
  );
}

/* ── ScrollProgress: thin bar pinned to the top ─────────── */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });
  return (
    <motion.div
      aria-hidden
      className="fixed top-0 left-0 right-0 z-50 h-[2px] origin-left"
      style={{ scaleX, background: "var(--accent)" }}
    />
  );
}
