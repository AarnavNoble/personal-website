"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const ACCENT = "#34d399";
const COLS = 12;
const ROWS = 5;
const TOTAL = COLS * ROWS;

// indices of the sparse, traditionally-monitored stations
const STATION_IDX = [4, 9, 14, 22, 31, 38, 44, 51];

function shuffledCoverage(seed: number) {
  const arr = Array.from({ length: TOTAL }, (_, i) => i).filter(i => !STATION_IDX.includes(i));
  for (let i = arr.length - 1; i > 0; i--) {
    seed = (seed * 9301 + 49297) % 233280;
    const j = Math.floor((seed / 233280) * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const COVERAGE_ORDER = shuffledCoverage(42).slice(0, Math.round(TOTAL * 0.78));

export function ClimateDemo() {
  const [running, setRunning] = useState(false);
  const [revealed, setRevealed] = useState(0);

  function run() {
    if (running) return;
    setRevealed(0);
    setRunning(true);
    let i = 0;
    const id = setInterval(() => {
      i += 3;
      setRevealed(Math.min(i, COVERAGE_ORDER.length));
      if (i >= COVERAGE_ORDER.length) {
        clearInterval(id);
        setRunning(false);
      }
    }, 35);
  }

  function reset() {
    setRevealed(0);
    setRunning(false);
  }

  const gnnCells = new Set(COVERAGE_ORDER.slice(0, revealed));
  const coveredCount = STATION_IDX.length + gnnCells.size;

  return (
    <div
      className="rounded-xl overflow-hidden mt-4"
      style={{ border: "1px solid rgba(52,211,153,0.25)", background: "rgba(52,211,153,0.03)" }}
    >
      <div
        className="px-4 py-2.5 flex items-center justify-between"
        style={{ borderBottom: "1px solid rgba(52,211,153,0.15)", background: "rgba(52,211,153,0.05)" }}
      >
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: ACCENT }} />
          <span className="text-[11px] font-mono" style={{ color: "var(--g8)" }}>lake erie / basin-wide GNN coverage</span>
        </div>
        <span className="text-[10px] font-mono" style={{ color: revealed > 0 ? ACCENT : "var(--g6)" }}>
          {coveredCount} / {TOTAL} cells predicted
        </span>
      </div>

      <div className="p-4">
        <div
          className="grid gap-[3px] mb-4"
          style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: TOTAL }).map((_, i) => {
            const isStation = STATION_IDX.includes(i);
            const isGnn = gnnCells.has(i);
            return (
              <motion.div
                key={i}
                className="aspect-square rounded-[2px]"
                animate={{
                  background: isStation ? ACCENT : isGnn ? "rgba(52,211,153,0.35)" : "var(--g3)",
                }}
                transition={{ duration: 0.25 }}
              />
            );
          })}
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-[10px] font-mono" style={{ color: "var(--g6)" }}>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-[2px]" style={{ background: ACCENT }} />monitoring station</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-[2px]" style={{ background: "rgba(52,211,153,0.35)" }} />GNN-predicted</span>
          </div>

          {revealed >= COVERAGE_ORDER.length ? (
            <button onClick={reset} className="text-[10px] font-mono" style={{ color: "var(--g6)" }}>reset ↺</button>
          ) : (
            <button
              onClick={run}
              disabled={running}
              className="px-3 py-1.5 rounded-md text-[11px] font-mono transition-all"
              style={{ background: "rgba(52,211,153,0.14)", border: "1px solid rgba(52,211,153,0.4)", color: "#6ee7b7", cursor: running ? "default" : "pointer" }}
            >
              {running ? "propagating…" : "run GNN forecast"}
            </button>
          )}
        </div>

        {revealed >= COVERAGE_ORDER.length && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[12px] font-mono mt-3"
            style={{ color: ACCENT }}
          >
            {STATION_IDX.length} physical stations → {coveredCount} predicted cells · ~5× coverage
          </motion.p>
        )}
      </div>
    </div>
  );
}
