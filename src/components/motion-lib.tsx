"use client";

import { motion } from "framer-motion";
import type { ReactNode, CSSProperties } from "react";

const EASE = [0.16, 1, 0.3, 1] as const;

/* ── FadeUp: entrance on mount (hero, above-the-fold) ────── */
export function FadeUp({
  children,
  delay = 0,
  y = 18,
  className,
  style,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  style?: CSSProperties;
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
  children,
  delay = 0,
  y = 20,
  className,
  style,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  style?: CSSProperties;
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

/* ── LineReveal: clip-path wipe (for big headings) ───────── */
export function LineReveal({
  children,
  delay = 0,
  immediate = false,
  className,
  style,
}: {
  children: ReactNode;
  delay?: number;
  immediate?: boolean;
  className?: string;
  style?: CSSProperties;
}) {
  const hidden = { clipPath: "inset(0 0 108% 0)", y: "0.35em" };
  const shown = { clipPath: "inset(0 0 -8% 0)", y: 0 };
  const anim = { duration: 0.85, delay, ease: EASE };

  return (
    <motion.div
      className={className}
      style={style}
      initial={hidden}
      {...(immediate
        ? { animate: shown }
        : { whileInView: shown, viewport: { once: true, margin: "0px 0px -40px 0px" } })}
      transition={anim}
    >
      {children}
    </motion.div>
  );
}
