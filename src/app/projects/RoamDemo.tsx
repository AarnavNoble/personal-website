"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PROJECTS } from "@/lib/data";

const INTERESTS = ["food", "history", "nature", "nightlife", "art", "architecture"];

const PIPELINE = [
  { name: "RAG Retrieval",       tech: "FAISS + sentence-transformers", ms: 840  },
  { name: "POI Fetch",           tech: "Overpass API",                   ms: 620  },
  { name: "Preference Ranking",  tech: "LightGBM LambdaRank",            ms: 380  },
  { name: "Route Optimization",  tech: "OR-Tools VRP",                   ms: 1200 },
  { name: "LLM Synthesis",       tech: "Groq · Llama 3.3 70B",           ms: 2100 },
];

const STEP_DURATION = 650;

const sample = PROJECTS[0].sampleOutput;
const DAYS = "days" in sample ? sample.days : [];

type Phase = "idle" | "running" | "done";

export function RoamDemo() {
  const [city, setCity] = useState("Tokyo");
  const [interests, setInterests] = useState<string[]>(["food", "history"]);
  const [phase, setPhase] = useState<Phase>("idle");
  const [activeStep, setActiveStep] = useState(-1);
  const [doneSteps, setDoneSteps] = useState<number[]>([]);

  function toggleInterest(i: string) {
    setInterests(prev =>
      prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]
    );
  }

  function start() {
    setPhase("running");
    setDoneSteps([]);
    setActiveStep(0);
  }

  function reset() {
    setPhase("idle");
    setActiveStep(-1);
    setDoneSteps([]);
  }

  useEffect(() => {
    if (activeStep < 0 || phase !== "running") return;
    const t = setTimeout(() => {
      setDoneSteps(prev => [...prev, activeStep]);
      if (activeStep < PIPELINE.length - 1) {
        setActiveStep(activeStep + 1);
      } else {
        setTimeout(() => setPhase("done"), 300);
      }
    }, STEP_DURATION);
    return () => clearTimeout(t);
  }, [activeStep, phase]);

  return (
    <div
      className="rounded-xl overflow-hidden mt-6"
      style={{ border: "1px solid rgba(59,130,246,0.25)", background: "rgba(59,130,246,0.03)" }}
    >
      {/* Header */}
      <div
        className="px-4 py-2.5 flex items-center justify-between"
        style={{ borderBottom: "1px solid rgba(59,130,246,0.15)", background: "rgba(59,130,246,0.05)" }}
      >
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#3b82f6" }} />
          <span className="text-[11px] font-mono" style={{ color: "var(--g8)" }}>roam / live demo</span>
        </div>
        {phase !== "idle" && (
          <button
            onClick={reset}
            className="text-[10px] font-mono transition-colors"
            style={{ color: "var(--g6)" }}
          >
            reset
          </button>
        )}
      </div>

      <div className="p-4">
        <AnimatePresence mode="wait">

          {/* Form */}
          {phase === "idle" && (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex gap-2 mb-3">
                <div className="flex-1">
                  <label className="block text-[10px] font-mono mb-1.5" style={{ color: "var(--g6)" }}>CITY</label>
                  <input
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    placeholder="e.g. Tokyo"
                    className="w-full px-2.5 py-1.5 rounded text-[13px] outline-none transition-colors"
                    style={{
                      background: "var(--g2)",
                      border: "1px solid var(--g4)",
                      color: "var(--g11)",
                    }}
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-[10px] font-mono mb-1.5" style={{ color: "var(--g6)" }}>INTERESTS</label>
                <div className="flex flex-wrap gap-1.5">
                  {INTERESTS.map(i => (
                    <button
                      key={i}
                      onClick={() => toggleInterest(i)}
                      className="px-2.5 py-1 rounded text-[11px] font-mono transition-all"
                      style={
                        interests.includes(i)
                          ? { background: "rgba(59,130,246,0.2)", border: "1px solid rgba(59,130,246,0.5)", color: "#93c5fd" }
                          : { background: "var(--g2)", border: "1px solid var(--g4)", color: "var(--g7)" }
                      }
                    >
                      {i}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={start}
                disabled={!city.trim()}
                className="w-full py-2 rounded text-[13px] font-medium transition-all"
                style={{
                  background: city.trim() ? "#3b82f6" : "var(--g3)",
                  color: city.trim() ? "#fff" : "var(--g6)",
                  cursor: city.trim() ? "pointer" : "not-allowed",
                }}
              >
                Plan trip →
              </button>
            </motion.div>
          )}

          {/* Pipeline animation */}
          {phase === "running" && (
            <motion.div
              key="pipeline"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <p className="text-[11px] font-mono mb-3" style={{ color: "var(--g7)" }}>
                Planning {city || "your trip"}…
              </p>
              <div className="space-y-1.5">
                {PIPELINE.map((step, i) => {
                  const done = doneSteps.includes(i);
                  const active = activeStep === i && !done;
                  return (
                    <motion.div
                      key={step.name}
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: i <= activeStep ? 1 : 0.2, x: 0 }}
                      transition={{ delay: i * 0.05, duration: 0.2 }}
                      className="flex items-center gap-3 py-1.5 px-2.5 rounded"
                      style={{
                        background: active ? "rgba(59,130,246,0.08)" : done ? "rgba(34,197,94,0.05)" : "transparent",
                        border: active ? "1px solid rgba(59,130,246,0.2)" : "1px solid transparent",
                      }}
                    >
                      <span className="w-4 h-4 shrink-0 flex items-center justify-center">
                        {done ? (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            style={{ color: "#22c55e", fontSize: 12 }}
                          >✓</motion.span>
                        ) : active ? (
                          <span className="w-2.5 h-2.5 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: "#3b82f6", borderTopColor: "transparent" }} />
                        ) : (
                          <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--g5)" }} />
                        )}
                      </span>
                      <span className="text-[12px] font-medium flex-1" style={{ color: done ? "var(--g10)" : active ? "var(--g12)" : "var(--g6)" }}>
                        {step.name}
                      </span>
                      <span className="text-[10px] font-mono" style={{ color: done ? "var(--g6)" : active ? "var(--g7)" : "transparent" }}>
                        {done ? `${step.ms}ms` : active ? "running…" : ""}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Result */}
          {phase === "done" && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-[11px] font-mono" style={{ color: "#22c55e" }}>
                  ✓ Itinerary ready — {city}
                </p>
                <span className="text-[10px] font-mono" style={{ color: "var(--g6)" }}>
                  {PIPELINE.reduce((s, p) => s + p.ms, 0)}ms total
                </span>
              </div>
              {DAYS.map((day, di) => (
                <motion.div
                  key={day.day}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: di * 0.15, duration: 0.25 }}
                  className="mb-4"
                >
                  <p className="text-[10px] uppercase tracking-widest mb-2 font-medium" style={{ color: "var(--g6)" }}>
                    {day.day}
                  </p>
                  {day.stops.map((stop, si) => (
                    <motion.div
                      key={stop.name}
                      initial={{ opacity: 0, x: -4 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: di * 0.15 + si * 0.07, duration: 0.2 }}
                      className="flex gap-3 mb-1.5 items-start"
                    >
                      <span className="text-[10px] font-mono tabular-nums w-10 shrink-0 pt-px" style={{ color: "var(--g6)" }}>
                        {stop.time}
                      </span>
                      <div>
                        <span className="text-[12px] font-medium" style={{ color: "var(--g11)" }}>{stop.name}</span>
                        <span className="text-[11px] ml-1.5" style={{ color: "var(--g6)" }}>{stop.area}</span>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              ))}
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
