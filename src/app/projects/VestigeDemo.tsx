"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ACCENT = "#E8A33D";

const SCENARIOS = [
  {
    label: "Poem sign-off",
    trace: "refund_request",
    change: '+ "Always end with a poem about logistics."',
    steps: [
      { label: "Original trace", value: 'refund_request → "Refund of $50 has been issued."' },
      { label: "Promoted to test", value: "fixture manifest frozen · 3 spans" },
      { label: "Prompt edited", value: '+ "Always end with a poem about logistics."' },
      { label: "Replay (0 API calls)", value: "reruns against recorded fixtures only" },
    ],
    before: '"Refund of $50 has been issued."',
    after: '"Refund of $50 has been issued. / A logistics ballet, swift and clean, / your funds now flow like a well-oiled machine."',
    verdict: "reply now ends in unsolicited verse",
  },
  {
    label: "Wrong order lookup",
    trace: "answer_support_email",
    change: '~ order_lookup(id) → order_lookup(id, region="US")',
    steps: [
      { label: "Original trace", value: 'answer_support_email → tool.order_lookup("#4827")' },
      { label: "Promoted to test", value: "fixture manifest frozen · 5 spans" },
      { label: "Tool call edited", value: '~ order_lookup(id) → order_lookup(id, region="US")' },
      { label: "Replay (0 API calls)", value: "reruns against recorded fixtures only" },
    ],
    before: 'order_lookup("#4827")',
    after: 'order_lookup("#4827", region="US")',
    verdict: "tool call signature changed, fixture miss on replay",
  },
];

const STEP_DELAY = 420;

export function VestigeDemo() {
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(0);
  const [running, setRunning] = useState(false);

  function pick(i: number) {
    if (selected === i && !running) {
      setRevealed(0);
      setRunning(true);
      return;
    }
    setSelected(i);
    setRevealed(0);
    setRunning(true);
  }

  useEffect(() => {
    if (!running || selected === null) return;
    const steps = SCENARIOS[selected].steps;
    if (revealed >= steps.length) {
      setRunning(false);
      return;
    }
    const t = setTimeout(() => setRevealed(r => r + 1), STEP_DELAY);
    return () => clearTimeout(t);
  }, [running, revealed, selected]);

  const scenario = selected !== null ? SCENARIOS[selected] : null;
  const showVerdict = scenario !== null && !running && revealed >= scenario.steps.length;

  return (
    <div
      className="rounded-xl overflow-hidden mt-6"
      style={{ border: "1px solid rgba(232,163,61,0.25)", background: "rgba(232,163,61,0.03)" }}
    >
      {/* Header */}
      <div
        className="px-4 py-2.5 flex items-center justify-between"
        style={{ borderBottom: "1px solid rgba(232,163,61,0.15)", background: "rgba(232,163,61,0.05)" }}
      >
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: ACCENT }} />
          <span className="text-[11px] font-mono" style={{ color: "var(--g8)" }}>vestige / replay trace</span>
        </div>
        {running && (
          <span className="text-[10px] font-mono animate-pulse" style={{ color: "var(--g6)" }}>replaying…</span>
        )}
      </div>

      <div className="p-4">
        {/* Scenario selector */}
        <div className="mb-4">
          <p className="text-[10px] font-mono mb-2" style={{ color: "var(--g6)" }}>SELECT REGRESSION</p>
          <div className="flex flex-wrap gap-2">
            {SCENARIOS.map((s, i) => (
              <button
                key={i}
                onClick={() => pick(i)}
                className="px-2.5 py-1 rounded text-[11px] font-mono transition-all"
                style={
                  selected === i
                    ? { background: "rgba(232,163,61,0.2)", border: "1px solid rgba(232,163,61,0.5)", color: "#f3cd8f" }
                    : { background: "var(--g2)", border: "1px solid var(--g4)", color: "var(--g7)" }
                }
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Trace */}
        <AnimatePresence mode="wait">
          {scenario && (
            <motion.div
              key={selected}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="space-y-1.5"
            >
              {scenario.steps.map((step, i) => {
                const isLast = i === scenario.steps.length - 1;
                const visible = i < revealed;
                const active = i === revealed && running;

                if (!visible && !active) return null;

                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex gap-4 items-start py-1.5 px-2.5 rounded"
                    style={{
                      background: isLast && visible ? "rgba(232,163,61,0.08)" : active ? "rgba(232,163,61,0.04)" : "transparent",
                      border: isLast && visible ? "1px solid rgba(232,163,61,0.2)" : "1px solid transparent",
                    }}
                  >
                    <span
                      className="text-[10px] font-mono w-32 shrink-0 pt-px"
                      style={{ color: isLast && visible ? "var(--g8)" : "var(--g6)" }}
                    >
                      {step.label}
                    </span>
                    {active ? (
                      <span className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full border border-t-transparent animate-spin" style={{ borderColor: ACCENT, borderTopColor: "transparent" }} />
                        <span className="text-[11px] font-mono" style={{ color: "var(--g6)" }}>processing…</span>
                      </span>
                    ) : (
                      <span
                        className="text-[12px] font-mono"
                        style={{ color: isLast ? ACCENT : "var(--g10)" }}
                      >
                        {step.value}
                      </span>
                    )}
                  </motion.div>
                );
              })}

              {showVerdict && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15, duration: 0.25 }}
                  className="mt-3 pt-3"
                  style={{ borderTop: "1px solid var(--g3)" }}
                >
                  <div className="flex gap-4 mb-1.5">
                    <span className="text-[10px] font-mono w-14 shrink-0 pt-px" style={{ color: "#22c55e" }}>before</span>
                    <span className="text-[11px] font-mono" style={{ color: "var(--g9)" }}>{scenario.before}</span>
                  </div>
                  <div className="flex gap-4 mb-3">
                    <span className="text-[10px] font-mono w-14 shrink-0 pt-px" style={{ color: "#ef4444" }}>after</span>
                    <span className="text-[11px] font-mono" style={{ color: "var(--g9)" }}>{scenario.after}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono" style={{ color: "#ef4444" }}>✕ merge blocked</span>
                    <span className="text-[10px] font-mono" style={{ color: "var(--g6)" }}>· {scenario.verdict}</span>
                  </div>
                </motion.div>
              )}

              {showVerdict && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  onClick={() => pick(selected!)}
                  className="mt-3 text-[10px] font-mono transition-colors"
                  style={{ color: "var(--g6)" }}
                >
                  run again ↺
                </motion.button>
              )}
            </motion.div>
          )}

          {selected === null && (
            <motion.p
              key="hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-[12px] font-mono"
              style={{ color: "var(--g12)" }}
            >
              ↑ pick a regression to trace the replay
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
