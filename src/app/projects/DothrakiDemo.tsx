"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ACCENT = "#8b5cf6";

const PHRASES = [
  {
    label: "Hash yer dothrae chek?",
    steps: [
      { label: "Scene audio",     value: "raw GoT scene — dialogue + score + SFX" },
      { label: "After Demucs",    value: "isolated vocal stem" },
      { label: "Whisper output",  value: '"hash ya dot rat check"' },
      { label: "IPA",             value: "/hæʃ jɑː dɒt ɹæt tʃɛk/" },
      { label: "Dothraki match",  value: "hash · yer · dothrae · chek" },
      { label: "Translation",     value: '"Are you riding well?"' },
    ],
  },
  {
    label: "M'athchomaroon",
    steps: [
      { label: "Scene audio",     value: "raw GoT scene — ambient score" },
      { label: "After Demucs",    value: "isolated vocal stem" },
      { label: "Whisper output",  value: '"math co ma roon"' },
      { label: "IPA",             value: "/mæθ koʊ mɑ ɹuːn/" },
      { label: "Dothraki match",  value: "m'athchomaroon" },
      { label: "Translation",     value: '"With respect" (formal greeting)' },
    ],
  },
  {
    label: "Khal Drogo",
    steps: [
      { label: "Scene audio",     value: "raw GoT scene — close-mic dialogue" },
      { label: "After Demucs",    value: "isolated vocal stem" },
      { label: "Whisper output",  value: '"cal dro go"' },
      { label: "IPA",             value: "/kɑl dɹoʊ goʊ/" },
      { label: "Dothraki match",  value: "khal · drogo" },
      { label: "Translation",     value: '"Warlord Drogo" (proper noun / title)' },
    ],
  },
];

const STEP_DELAY = 480;

export function DothrakiDemo() {
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(0);
  const [running, setRunning] = useState(false);

  function pick(i: number) {
    if (selected === i && !running) return;
    setSelected(i);
    setRevealed(0);
    setRunning(true);
  }

  useEffect(() => {
    if (!running || selected === null) return;
    const steps = PHRASES[selected].steps;
    if (revealed >= steps.length) {
      setRunning(false);
      return;
    }
    const t = setTimeout(() => setRevealed(r => r + 1), STEP_DELAY);
    return () => clearTimeout(t);
  }, [running, revealed, selected]);

  const phrase = selected !== null ? PHRASES[selected] : null;

  return (
    <div
      className="rounded-xl overflow-hidden mt-6"
      style={{ border: "1px solid rgba(139,92,246,0.25)", background: "rgba(139,92,246,0.03)" }}
    >
      {/* Header */}
      <div
        className="px-4 py-2.5 flex items-center justify-between"
        style={{ borderBottom: "1px solid rgba(139,92,246,0.15)", background: "rgba(139,92,246,0.05)" }}
      >
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: ACCENT }} />
          <span className="text-[11px] font-mono" style={{ color: "var(--g8)" }}>dothraki-asr / pipeline trace</span>
        </div>
        {running && (
          <span className="text-[10px] font-mono animate-pulse" style={{ color: "var(--g6)" }}>running…</span>
        )}
      </div>

      <div className="p-4">
        {/* Phrase selector */}
        <div className="mb-4">
          <p className="text-[10px] font-mono mb-2" style={{ color: "var(--g6)" }}>SELECT PHRASE</p>
          <div className="flex flex-wrap gap-2">
            {PHRASES.map((p, i) => (
              <button
                key={i}
                onClick={() => pick(i)}
                className="px-2.5 py-1 rounded text-[11px] font-mono transition-all"
                style={
                  selected === i
                    ? { background: "rgba(139,92,246,0.2)", border: "1px solid rgba(139,92,246,0.5)", color: "#c4b5fd" }
                    : { background: "var(--g2)", border: "1px solid var(--g4)", color: "var(--g7)" }
                }
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Trace */}
        <AnimatePresence mode="wait">
          {phrase && (
            <motion.div
              key={selected}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="space-y-1.5"
            >
              {phrase.steps.map((step, i) => {
                const isLast = i === phrase.steps.length - 1;
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
                      background: isLast && visible ? "rgba(139,92,246,0.08)" : active ? "rgba(139,92,246,0.04)" : "transparent",
                      border: isLast && visible ? "1px solid rgba(139,92,246,0.2)" : "1px solid transparent",
                    }}
                  >
                    <span
                      className="text-[10px] font-mono w-28 shrink-0 pt-px"
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

              {!running && revealed >= phrase.steps.length && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  onClick={() => pick(selected!)}
                  className="mt-2 text-[10px] font-mono transition-colors"
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
              style={{ color: "var(--g6)" }}
            >
              ↑ pick a phrase to trace the pipeline
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
