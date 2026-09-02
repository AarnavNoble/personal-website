"use client";

import {
  motion,
  useInView,
  useMotionValue,
  useSpring,
  animate,
} from "framer-motion";
import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type CSSProperties,
} from "react";

/* ── Reveal: fade + rise when scrolled into view ─────────── */
export function Reveal({
  children,
  delay = 0,
  y = 22,
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
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ── AnimatedName: per-character entrance ────────────────── */
export function AnimatedName({ text }: { text: string }) {
  const chars = Array.from(text);
  return (
    <motion.h1
      className="font-display font-[600] tracking-[-0.03em] leading-[0.98] text-[13vw] sm:text-[76px] lg:text-[96px]"
      style={{ color: "var(--g12)" }}
      initial="hidden"
      animate="show"
      variants={{ show: { transition: { staggerChildren: 0.03, delayChildren: 0.12 } } }}
      aria-label={text}
    >
      {chars.map((c, i) => (
        <motion.span
          key={i}
          className="inline-block"
          style={{ whiteSpace: c === " " ? "pre" : "normal" }}
          variants={{
            hidden: { y: "0.5em", opacity: 0, filter: "blur(6px)" },
            show: {
              y: 0,
              opacity: 1,
              filter: "blur(0px)",
              transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
            },
          }}
        >
          {c === " " ? " " : c}
        </motion.span>
      ))}
    </motion.h1>
  );
}

/* ── Words: staggered word reveal for a line of copy ─────── */
export function Words({
  text,
  className,
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  const words = text.split(" ");
  return (
    <motion.p
      className={className}
      initial="hidden"
      animate="show"
      variants={{ show: { transition: { staggerChildren: 0.03, delayChildren: delay } } }}
    >
      {words.map((word, i) => (
        <span
          key={i}
          className="inline-block overflow-hidden align-bottom"
          style={{ marginRight: i < words.length - 1 ? "0.28em" : 0 }}
        >
          <motion.span
            className="inline-block"
            variants={{
              hidden: { y: "115%" },
              show: { y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
            }}
          >
            {word}
            {i < words.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </motion.p>
  );
}

/* ── Magnetic: element drifts toward the cursor ──────────── */
export function Magnetic({
  children,
  strength = 0.35,
  className,
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useSpring(useMotionValue(0), { stiffness: 220, damping: 18 });
  const y = useSpring(useMotionValue(0), { stiffness: 220, damping: 18 });

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ x, y, display: "inline-flex" }}
      onMouseMove={(e) => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * strength);
        y.set((e.clientY - (r.top + r.height / 2)) * strength);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

/* ── CountUp: animate a number when it enters view ───────── */
export function CountUp({
  to,
  suffix = "",
  className,
}: {
  to: number;
  suffix?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -40px 0px" });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, to, {
      duration: 1.1,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setVal(v),
    });
    return () => controls.stop();
  }, [inView, to]);

  return (
    <span ref={ref} className={className}>
      {Math.round(val)}
      {suffix}
    </span>
  );
}

/* ── TiltCard: 3D tilt tracking the cursor ───────────────── */
export function TiltCard({
  children,
  className,
  max = 8,
  style,
}: {
  children: ReactNode;
  className?: string;
  max?: number;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const rx = useSpring(useMotionValue(0), { stiffness: 200, damping: 20 });
  const ry = useSpring(useMotionValue(0), { stiffness: 200, damping: 20 });

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ ...style, rotateX: rx, rotateY: ry, transformPerspective: 900 }}
      onMouseMove={(e) => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        ry.set(px * max * 2);
        rx.set(-py * max * 2);
      }}
      onMouseLeave={() => {
        rx.set(0);
        ry.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}
