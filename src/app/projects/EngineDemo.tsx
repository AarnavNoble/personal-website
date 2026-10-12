"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ACCENT = "#a78bfa";

// Numbers are from the repo's docs/results.md (Qwen2.5-0.5B). Each experiment names the
// hardware it was measured on; ratios are only comparable within one machine.
const EXPERIMENTS = [
  {
    label: "Continuous batching",
    steps: [
      { label: "Workload", value: "32 concurrent requests · prompts of 128/512/1024 tokens · outputs around 128" },
      { label: "Static batching", value: "564 tokens/s · TTFT p50 3,993 ms" },
      { label: "Continuous batching", value: "771 tokens/s · TTFT p50 75 ms" },
      { label: "Cost", value: "inter-token p50 23.1 ms → 39.1 ms, every resident sequence advances each step" },
    ],
    before: "static: first token waits behind the longest generation in flight",
    after: "continuous: sequences leave and join the batch every step",
    verdict: "53x faster TTFT · 1.37x throughput",
    hardware: "CUDA backend, NVIDIA A40",
  },
  {
    label: "Paged KV cache",
    steps: [
      { label: "Workload", value: "256 requests · 65,536 KV slots · 4,096 blocks of 16" },
      { label: "Contiguous", value: "54.8% slot utilization · 45.2% wasted" },
      { label: "Paged", value: "99.0% slot utilization · 1.0% wasted" },
      { label: "Why", value: "a prompt allocates ceil(n/16) blocks, not its worst case" },
    ],
    before: "contiguous: reserve prompt + output cap up front",
    after: "paged: block tables grow one 16-token block at a time",
    verdict: "99.0% vs 54.8% slot utilization",
    hardware: "allocator property, hardware independent",
  },
  {
    label: "Prefix caching",
    steps: [
      { label: "Workload", value: "32 requests sharing a 512-token system prompt" },
      { label: "Cache off", value: "TTFT p50 1,627 ms · wall clock 44.0 s" },
      { label: "Cache on", value: "TTFT p50 113 ms · wall clock 7.8 s" },
      { label: "Hit ratio", value: "95.8% of blocks served from the cache" },
    ],
    before: "every request prefills the same system prompt again",
    after: "shared blocks are reused by refcount, only the tail is prefilled",
    verdict: "14.4x faster TTFT",
    hardware: "CUDA backend, NVIDIA A40",
  },
  {
    label: "GQA attention kernel",
    steps: [
      { label: "Profile", value: "attention is 87.5% of a decode step · 31.56 of 36.09 ms" },
      { label: "First attempt", value: "one block per (token, KV head): 1.33x slower · 64 blocks on a card with 84 SMs" },
      { label: "Fix", value: "512 threads per block: attention 31.56 ms → 19.43 ms per step" },
      { label: "End to end", value: "771 → 980 tokens/s" },
    ],
    before: "every query head re-reads the K/V its group shares, seven times over",
    after: "K/V is read once per group, with wider blocks to keep the card busy",
    verdict: "1.62x faster attention kernel · 1.27x throughput",
    hardware: "CUDA backend, NVIDIA A40",
  },
  {
    label: "Chunked prefill",
    steps: [
      { label: "Workload", value: "4 streams decoding · 2,048-token prompt arrives mid-flight" },
      { label: "CPU, unchunked", value: "worst inter-token gap 23,203 ms" },
      { label: "CPU, chunk size 128", value: "worst inter-token gap 1,969 ms" },
      { label: "A40", value: "48 ms → 37 ms · the prefill is too fast to leave a stall worth removing" },
    ],
    before: "one forward pass for the whole prompt stalls every stream",
    after: "prefill is split into chunks that share steps with decode",
    verdict: "11.8x shorter worst stall on CPU · 1.3x on an A40",
    hardware: "CPU backend and CUDA backend",
  },
];

const STEP_DELAY = 420;

export function EngineDemo() {
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(0);

  const experiment = selected !== null ? EXPERIMENTS[selected] : null;
  const running = experiment !== null && revealed < experiment.steps.length;

  function pick(i: number) {
    setSelected(i);
    setRevealed(0);
  }

  useEffect(() => {
    if (!running) return;
    const t = setTimeout(() => setRevealed(r => r + 1), STEP_DELAY);
    return () => clearTimeout(t);
  }, [running, revealed]);

  const showVerdict = experiment !== null && !running;

  return (
    <div
      className="rounded-xl overflow-hidden mt-6"
      style={{ border: "1px solid rgba(167,139,250,0.25)", background: "rgba(167,139,250,0.03)" }}
    >
      {/* Header */}
      <div
        className="px-4 py-2.5 flex items-center justify-between"
        style={{ borderBottom: "1px solid rgba(167,139,250,0.15)", background: "rgba(167,139,250,0.05)" }}
      >
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: ACCENT }} />
          <span className="text-[11px] font-mono" style={{ color: "var(--g8)" }}>engine / benchmarks</span>
        </div>
        {running && (
          <span className="text-[10px] font-mono animate-pulse" style={{ color: "var(--g6)" }}>measuring…</span>
        )}
      </div>

      <div className="p-4">
        {/* Experiment selector */}
        <div className="mb-4">
          <p className="text-[10px] font-mono mb-2" style={{ color: "var(--g6)" }}>SELECT EXPERIMENT</p>
          <div className="flex flex-wrap gap-2">
            {EXPERIMENTS.map((e, i) => (
              <button
                key={i}
                onClick={() => pick(i)}
                className="px-2.5 py-1 rounded text-[11px] font-mono transition-all"
                style={
                  selected === i
                    ? { background: "rgba(167,139,250,0.2)", border: "1px solid rgba(167,139,250,0.5)", color: "#d4c6fd" }
                    : { background: "var(--g2)", border: "1px solid var(--g4)", color: "var(--g7)" }
                }
              >
                {e.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        <AnimatePresence mode="wait">
          {experiment && (
            <motion.div
              key={selected}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="space-y-1.5"
            >
              {experiment.steps.map((step, i) => {
                const isLast = i === experiment.steps.length - 1;
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
                      background: isLast && visible ? "rgba(167,139,250,0.08)" : active ? "rgba(167,139,250,0.04)" : "transparent",
                      border: isLast && visible ? "1px solid rgba(167,139,250,0.2)" : "1px solid transparent",
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
                    <span className="text-[10px] font-mono w-14 shrink-0 pt-px" style={{ color: "#ef4444" }}>before</span>
                    <span className="text-[11px] font-mono" style={{ color: "var(--g9)" }}>{experiment.before}</span>
                  </div>
                  <div className="flex gap-4 mb-3">
                    <span className="text-[10px] font-mono w-14 shrink-0 pt-px" style={{ color: "#22c55e" }}>after</span>
                    <span className="text-[11px] font-mono" style={{ color: "var(--g9)" }}>{experiment.after}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-mono" style={{ color: "#22c55e" }}>✓ {experiment.verdict}</span>
                    <span className="text-[10px] font-mono" style={{ color: "var(--g6)" }}>· {experiment.hardware}</span>
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
              ↑ pick an experiment to see what it measured
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
