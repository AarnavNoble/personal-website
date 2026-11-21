"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ACCENT = "#60a5fa";

// A walkthrough of how one answer gets its citations checked. The mechanics are the repo's;
// the off-by-page and shortened-id cases are ones its eval runs and test questions turned up.
const CASES = [
  {
    label: "Cited answer",
    steps: [
      { label: "Question", value: "what is Toronto Hydro proposing, and why?" },
      { label: "search", value: "full-text + vector, top 50 each, fused by RRF (k=60); re-filed copies collapsed" },
      { label: "Hits", value: "chunks tagged case · exhibit · tab · schedule · page" },
      { label: "fetch_page", value: "agent reads the full pages behind the best hits" },
      { label: "Answer", value: "every claim carries a [cite:doc_id:page] token copied from a tool result" },
      { label: "Citation check", value: "each cited page is one the agent fetched" },
    ],
    ok: true,
    verdict: "verified · source panel opens the page with the passage highlighted",
  },
  {
    label: "Shortened document id",
    steps: [
      { label: "Question", value: "compare capital growth: Toronto Hydro vs Hydro One" },
      { label: "search", value: "hybrid search across both cases" },
      { label: "fetch_page", value: "pages from both cases read" },
      { label: "Answer", value: "one token carries a shortened document id" },
      { label: "Citation check", value: "that id points at a document that does not exist" },
    ],
    ok: false,
    verdict: "flagged in the UI · 1 of 62 citations in the cross-case answers",
  },
  {
    label: "Off-by-page figure",
    steps: [
      { label: "Answer", value: "claim cites Toronto Hydro's capital expenditure plan, p. 92" },
      { label: "Citation check", value: "passes: the agent did retrieve p. 92" },
      { label: "Figure check", value: "none of the claim's figures appear on p. 92" },
      { label: "Neighbours", value: "scan two pages either side: figures found on p. 94" },
    ],
    ok: false,
    verdict: "panel says the figures are on p. 94, not p. 92",
  },
];

const STEP_DELAY = 420;

export function OebDemo() {
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(0);

  const item = selected !== null ? CASES[selected] : null;
  const running = item !== null && revealed < item.steps.length;

  function pick(i: number) {
    setSelected(i);
    setRevealed(0);
  }

  useEffect(() => {
    if (!running) return;
    const t = setTimeout(() => setRevealed(r => r + 1), STEP_DELAY);
    return () => clearTimeout(t);
  }, [running, revealed]);

  const showVerdict = item !== null && !running;

  return (
    <div
      className="rounded-xl overflow-hidden mt-6"
      style={{ border: "1px solid rgba(96,165,250,0.25)", background: "rgba(96,165,250,0.03)" }}
    >
      <div
        className="px-4 py-2.5 flex items-center justify-between"
        style={{ borderBottom: "1px solid rgba(96,165,250,0.15)", background: "rgba(96,165,250,0.05)" }}
      >
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: ACCENT }} />
          <span className="text-[11px] font-mono" style={{ color: "var(--g8)" }}>oeb / citation check</span>
        </div>
        {running && (
          <span className="text-[10px] font-mono animate-pulse" style={{ color: "var(--g6)" }}>checking…</span>
        )}
      </div>

      <div className="p-4">
        <div className="mb-4">
          <p className="text-[10px] font-mono mb-2" style={{ color: "var(--g6)" }}>SELECT ANSWER</p>
          <div className="flex flex-wrap gap-2">
            {CASES.map((c, i) => (
              <button
                key={i}
                onClick={() => pick(i)}
                className="px-2.5 py-1 rounded text-[11px] font-mono transition-all"
                style={
                  selected === i
                    ? { background: "rgba(96,165,250,0.2)", border: "1px solid rgba(96,165,250,0.5)", color: "#bfdbfe" }
                    : { background: "var(--g2)", border: "1px solid var(--g4)", color: "var(--g7)" }
                }
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {item && (
            <motion.div
              key={selected}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="space-y-1.5"
            >
              {item.steps.map((step, i) => {
                const isLast = i === item.steps.length - 1;
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
                      background: isLast && visible ? "rgba(96,165,250,0.08)" : active ? "rgba(96,165,250,0.04)" : "transparent",
                      border: isLast && visible ? "1px solid rgba(96,165,250,0.2)" : "1px solid transparent",
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
                        <span className="text-[11px] font-mono" style={{ color: "var(--g6)" }}>running…</span>
                      </span>
                    ) : (
                      <span className="text-[12px] font-mono" style={{ color: isLast ? ACCENT : "var(--g10)" }}>
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
                  className="mt-3 pt-3 flex flex-wrap items-center gap-2"
                  style={{ borderTop: "1px solid var(--g3)" }}
                >
                  <span className="text-[11px] font-mono" style={{ color: item.ok ? "#22c55e" : "#ef4444" }}>
                    {item.ok ? "✓ citations verified" : "✕ citation flagged"}
                  </span>
                  <span className="text-[10px] font-mono" style={{ color: "var(--g6)" }}>· {item.verdict}</span>
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
              ↑ pick an answer to follow its citations
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
