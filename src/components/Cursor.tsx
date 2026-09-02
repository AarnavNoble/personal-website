"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/**
 * Soft trailing ring that replaces the pointer on fine-pointer devices and
 * swells over interactive elements. Stays invisible on touch / reduced-motion.
 */
export function Cursor() {
  const [active, setActive] = useState(false);
  const [hidden, setHidden] = useState(true);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.6 });

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;

    document.documentElement.classList.add("cursor-none");

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setHidden(false);
      const el = e.target as HTMLElement;
      setActive(!!el.closest("a, button, [data-cursor]"));
    };
    const leave = () => setHidden(true);

    window.addEventListener("mousemove", move);
    document.addEventListener("mouseleave", leave);
    return () => {
      document.documentElement.classList.remove("cursor-none");
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseleave", leave);
    };
  }, [x, y]);

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[60] rounded-full border"
      style={{
        x: sx,
        y: sy,
        translateX: "-50%",
        translateY: "-50%",
        borderColor: "rgba(255,255,255,0.75)",
        mixBlendMode: "difference",
      }}
      animate={{
        width: active ? 46 : 20,
        height: active ? 46 : 20,
        opacity: hidden ? 0 : 1,
        backgroundColor: active ? "rgba(255,255,255,0.16)" : "rgba(255,255,255,0)",
      }}
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
    />
  );
}
