"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ACCENT = "#6c8ebf";
const SPEAK_MS = 4200;
const STEP_DELAY = 420;

const PHASES = [
  { label: "Barge-in detected",  value: "VAD picks up user speech over live TTS output" },
  { label: "TTS halted",         value: "agent audio output cut, < 80ms from detection" },
  { label: "Buffer flushed",     value: "pending output frames dropped, no trailing audio" },
  { label: "ASR context reset",  value: "transcript window realigned to the interruption point" },
  { label: "New turn routed",    value: "user speech transcribed and handed to the LLM" },
];

type Phase = "idle" | "speaking" | "interrupting" | "done";

export function AethexDemo() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [revealed, setRevealed] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // auto-loop: idle -> speaking -> (if uninterrupted) idle
  useEffect(() => {
    if (phase === "idle") {
      timerRef.current = setTimeout(() => setPhase("speaking"), 900);
    } else if (phase === "speaking") {
      timerRef.current = setTimeout(() => setPhase("idle"), SPEAK_MS);
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [phase]);

  // interrupt trace
  useEffect(() => {
    if (phase !== "interrupting") return;
    if (revealed >= PHASES.length) {
      const t = setTimeout(() => setPhase("done"), 500);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setRevealed(r => r + 1), STEP_DELAY);
    return () => clearTimeout(t);
  }, [phase, revealed]);

  function interrupt() {
    if (phase !== "speaking") return;
    if (timerRef.current) clearTimeout(timerRef.current);
    setRevealed(0);
    setPhase("interrupting");
  }

  function reset() {
    setRevealed(0);
    setPhase("idle");
  }

  const speaking = phase === "speaking";
  const tracing = phase === "interrupting" || phase === "done";

  return (
    <div
      className="rounded-xl overflow-hidden mt-4"
      style={{ border: "1px solid rgba(108,142,191,0.25)", background: "rgba(108,142,191,0.03)" }}
    >
      <div
        className="px-4 py-2.5 flex items-center justify-between"
        style={{ borderBottom: "1px solid rgba(108,142,191,0.15)", background: "rgba(108,142,191,0.05)" }}
      >
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: ACCENT }} />
          <span className="text-[11px] font-mono" style={{ color: "var(--g8)" }}>voice pipeline / interrupt-handling trace</span>
        </div>
        <span className="text-[10px] font-mono" style={{ color: tracing ? ACCENT : "var(--g6)" }}>
          {phase === "idle" && "listening…"}
          {phase === "speaking" && "agent speaking…"}
          {phase === "interrupting" && "user interrupted"}
          {phase === "done" && "turn handed off ✓"}
        </span>
      </div>

      <div className="p-4">
        {/* Live call state */}
        <div className="flex items-center justify-between mb-4 px-3 py-2.5 rounded-lg" style={{ background: "var(--g2)", border: "1px solid var(--g3)" }}>
          <div className="flex items-center gap-2.5">
            <span className="text-[11px] font-mono" style={{ color: "var(--g7)" }}>agent</span>
            <div className="flex items-end gap-[2px] h-4">
              {Array.from({ length: 14 }).map((_, i) => (
                <motion.span
                  key={i}
                  className="w-[2px] rounded-full"
                  style={{ background: speaking ? ACCENT : "var(--g4)" }}
                  animate={speaking ? { height: [3, 6 + ((i * 37) % 13), 3] } : { height: 3 }}
                  transition={speaking ? { duration: 0.5 + (i % 5) * 0.08, repeat: Infinity, ease: "easeInOut" } : { duration: 0.2 }}
                />
              ))}
            </div>
          </div>

          <button
            onClick={interrupt}
            disabled={!speaking}
            className="px-3 py-1.5 rounded-md text-[11px] font-mono transition-all"
            style={
              speaking
                ? { background: "rgba(239,68,68,0.14)", border: "1px solid rgba(239,68,68,0.4)", color: "#fca5a5", cursor: "pointer" }
                : { background: "var(--g3)", border: "1px solid var(--g4)", color: "var(--g6)", cursor: "not-allowed" }
            }
          >
            {speaking ? "⏺ interrupt agent" : "waiting for agent to speak…"}
          </button>
        </div>

        {/* Trace */}
        <AnimatePresence mode="wait">
          {tracing ? (
            <motion.div
              key="trace"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="space-y-1.5"
            >
              {PHASES.map((step, i) => {
                const isLast = i === PHASES.length - 1;
                const visible = i < revealed;
                const active = i === revealed && phase === "interrupting";
                if (!visible && !active) return null;

                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex gap-4 items-start py-1.5 px-2.5 rounded"
                    style={{
                      background: isLast && visible ? "rgba(108,142,191,0.08)" : active ? "rgba(108,142,191,0.04)" : "transparent",
                      border: isLast && visible ? "1px solid rgba(108,142,191,0.2)" : "1px solid transparent",
                    }}
                  >
                    <span className="text-[10px] font-mono w-32 shrink-0 pt-px" style={{ color: isLast && visible ? "var(--g8)" : "var(--g6)" }}>
                      {step.label}
                    </span>
                    {active ? (
                      <span className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full border border-t-transparent animate-spin" style={{ borderColor: ACCENT, borderTopColor: "transparent" }} />
                        <span className="text-[11px] font-mono" style={{ color: "var(--g6)" }}>processing…</span>
                      </span>
                    ) : (
                      <span className="text-[12px] font-mono" style={{ color: isLast ? ACCENT : "var(--g10)" }}>
                        {step.value}
                      </span>
                    )}
                  </motion.div>
                );
              })}

              {phase === "done" && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  onClick={reset}
                  className="mt-2 text-[10px] font-mono transition-colors"
                  style={{ color: "var(--g6)" }}
                >
                  run again ↺
                </motion.button>
              )}
            </motion.div>
          ) : (
            <motion.p
              key="hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-[12px] font-mono"
              style={{ color: "var(--g6)" }}
            >
              ↑ wait for the agent to start speaking, then interrupt it mid-sentence
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
