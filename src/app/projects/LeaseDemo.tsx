"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ACCENT = "#34d399";
const LEASE = 10; // minutes, the repo's default
const SPAN = 40; // minutes shown on the timeline
const STEP = 5;
const TOKENS = ["7f3a", "c21e", "9b04", "e6d8", "40af", "d93c", "1a7b", "f05e"];

type Who = "A" | "B";
type Action = `${Who}:claim` | `${Who}:beat` | `${Who}:submit` | "tick";

type Seg = { who: Who; token: string; start: number; end: number | null; how: "expired" | "submitted" | null };

type Sim = {
  now: number;
  status: "available" | "claimed" | "submitted";
  holder: Who | null;
  token: string | null;
  expiresAt: number;
  issued: number;
  mine: Record<Who, string | null>;
  segs: Seg[];
  beats: { who: Who; at: number }[];
  log: { at: number; who: Who | null; text: string; ok: boolean }[];
};

const START: Sim = {
  now: 0,
  status: "available",
  holder: null,
  token: null,
  expiresAt: 0,
  issued: 0,
  mine: { A: null, B: null },
  segs: [],
  beats: [],
  log: [],
};

const COLOR: Record<Who, string> = { A: ACCENT, B: "#f5b453" };

// The server side, reduced to one script: the same rules as the claim, heartbeat and submit
// routes (lease expiry counts as free, the claim token fences off stale holders).
function step(s: Sim, a: Action): Sim {
  const say = (who: Who | null, text: string, ok = true) => [...s.log, { at: s.now, who, text, ok }];
  const live = s.status === "claimed" && s.expiresAt > s.now;

  if (a === "tick") {
    if (s.now + STEP > SPAN) return s;
    const now = s.now + STEP;
    const lapsed = s.status === "claimed" && s.expiresAt > s.now && s.expiresAt <= now;
    const log = lapsed
      ? [...s.log, { at: s.expiresAt, who: s.holder, text: "lease expired · script counts as free", ok: false }]
      : s.log;
    return { ...s, now, log };
  }

  const [who, verb] = a.split(":") as [Who, "claim" | "beat" | "submit"];
  const open = s.segs.length - 1;

  if (verb === "claim") {
    if (s.status === "submitted") return { ...s, log: say(who, "no scripts left in this language", false) };
    if (live && s.holder !== who) {
      return { ...s, log: say(who, `SKIP LOCKED · the only script is leased to ${s.holder}`, false) };
    }
    if (s.status === "claimed" && s.holder === who) {
      const text = live ? "resumed · same token, lease extended" : "revived · nobody took it, same token back";
      return { ...s, expiresAt: s.now + LEASE, log: say(who, text) };
    }
    const token = TOKENS[s.issued % TOKENS.length];
    const segs = s.segs.map((g, i) => (i === open && g.end === null ? { ...g, end: s.expiresAt, how: "expired" as const } : g));
    return {
      ...s,
      status: "claimed",
      holder: who,
      token,
      expiresAt: s.now + LEASE,
      issued: s.issued + 1,
      mine: { ...s.mine, [who]: token },
      segs: [...segs, { who, token, start: s.now, end: null, how: null }],
      log: say(who, `claimed · new token ${token}`),
    };
  }

  const mine = s.mine[who];
  if (!mine) return { ...s, log: say(who, "holds nothing", false) };
  if (mine !== s.token) {
    return { ...s, log: say(who, `409 · token ${mine} fenced off, script is ${s.holder}'s now`, false) };
  }

  if (verb === "beat") {
    if (s.status === "submitted") return { ...s, log: say(who, "already submitted", false) };
    if (!live) return { ...s, log: say(who, "lease lapsed · claim again to revive it", false) };
    return {
      ...s,
      expiresAt: s.now + LEASE,
      beats: [...s.beats, { who, at: s.now }],
      log: say(who, `heartbeat · lease runs to ${s.now + LEASE} min`),
    };
  }

  if (s.status === "submitted") return { ...s, log: say(who, "retry · same recording returned (idempotent)") };
  const segs = s.segs.map((g, i) => (i === open ? { ...g, end: s.now, how: "submitted" as const } : g));
  const text = live ? "submitted ✓ token matches" : "late submit accepted · nobody re-claimed it";
  return { ...s, status: "submitted", segs, log: say(who, text) };
}

const SCENARIOS: { label: string; about: string; actions: Action[] }[] = [
  {
    label: "Stall, then re-claim",
    about: "A stalls past the lease, B takes the script, A's late submit is fenced off.",
    actions: ["A:claim", "tick", "A:beat", "tick", "tick", "tick", "B:claim", "tick", "A:submit", "B:submit"],
  },
  {
    label: "Late take kept",
    about: "A's lease lapses but nobody re-claims, so A's finished take is still accepted.",
    actions: ["A:claim", "tick", "tick", "tick", "A:submit"],
  },
  {
    label: "Second tab",
    about: "A refreshes and gets the same token back; B can't take a live lease.",
    actions: ["A:claim", "tick", "A:claim", "B:claim", "tick", "A:beat", "A:submit", "A:submit"],
  },
];

const PLAY_DELAY = 650;

export function LeaseDemo() {
  const [sim, setSim] = useState<Sim>(START);
  const [queue, setQueue] = useState<Action[]>([]);
  const [scenario, setScenario] = useState<number | null>(null);

  const playing = queue.length > 0;

  useEffect(() => {
    if (!playing) return;
    const t = setTimeout(() => {
      setSim(s => step(s, queue[0]));
      setQueue(q => q.slice(1));
    }, PLAY_DELAY);
    return () => clearTimeout(t);
  }, [playing, queue]);

  function play(i: number) {
    setScenario(i);
    setSim(START);
    setQueue(SCENARIOS[i].actions);
  }

  function manual(a: Action) {
    setQueue([]);
    setSim(s => step(s, a));
  }

  function reset() {
    setQueue([]);
    setScenario(null);
    setSim(START);
  }

  const pct = (m: number) => `${(Math.min(m, SPAN) / SPAN) * 100}%`;
  const width = (a: number, b: number) => `${((Math.min(b, SPAN) - Math.min(a, SPAN)) / SPAN) * 100}%`;

  return (
    <div
      className="rounded-xl overflow-hidden mt-6"
      style={{ border: "1px solid rgba(52,211,153,0.25)", background: "rgba(52,211,153,0.03)" }}
    >
      <div
        className="px-4 py-2.5 flex items-center justify-between"
        style={{ borderBottom: "1px solid rgba(52,211,153,0.15)", background: "rgba(52,211,153,0.05)" }}
      >
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: ACCENT }} />
          <span className="text-[11px] font-mono" style={{ color: "var(--g8)" }}>script #412 / lease timeline</span>
        </div>
        <span className="text-[10px] font-mono" style={{ color: "var(--g6)" }}>
          t = {sim.now} min · lease {LEASE} min{playing ? " · playing…" : ""}
        </span>
      </div>

      <div className="p-4">
        <div className="mb-4">
          <p className="text-[10px] font-mono mb-2" style={{ color: "var(--g6)" }}>PLAY A SCENARIO</p>
          <div className="flex flex-wrap gap-2">
            {SCENARIOS.map((sc, i) => (
              <button
                key={sc.label}
                onClick={() => play(i)}
                className="px-2.5 py-1 rounded text-[11px] font-mono transition-all"
                style={
                  scenario === i
                    ? { background: "rgba(52,211,153,0.2)", border: "1px solid rgba(52,211,153,0.5)", color: "#a7f3d0" }
                    : { background: "var(--g2)", border: "1px solid var(--g4)", color: "var(--g7)" }
                }
              >
                {sc.label}
              </button>
            ))}
          </div>
          {scenario !== null && (
            <p className="text-[11px] font-mono mt-2" style={{ color: "var(--g7)" }}>{SCENARIOS[scenario].about}</p>
          )}
        </div>

        {/* Timeline: one row per contributor, each lease a bar, heartbeats as ticks */}
        <div className="space-y-2 mb-4">
          {(["A", "B"] as Who[]).map(who => (
            <div key={who} className="flex items-center gap-3">
              <span className="text-[10px] font-mono w-16 shrink-0" style={{ color: COLOR[who] }}>
                contrib {who}
              </span>
              <div className="relative flex-1 h-5 rounded" style={{ background: "var(--g2)", border: "1px solid var(--g3)" }}>
                {sim.segs.map((g, i) => {
                  if (g.who !== who) return null;
                  const current = g.end === null;
                  const solidEnd = current ? Math.min(sim.now, sim.expiresAt) : g.end!;
                  return (
                    <div key={i}>
                      <div
                        className="absolute top-0 bottom-0 flex items-center overflow-hidden"
                        style={{
                          left: pct(g.start),
                          width: width(g.start, Math.max(solidEnd, g.start + 0.4)),
                          background: g.how === "expired" ? "rgba(239,68,68,0.35)" : COLOR[who],
                          opacity: g.how === "expired" ? 1 : 0.85,
                        }}
                      >
                        <span className="text-[9px] font-mono px-1" style={{ color: "#0d0d0d" }}>{g.token}</span>
                      </div>
                      {current && sim.status === "claimed" && sim.expiresAt > sim.now && (
                        <div
                          className="absolute top-0 bottom-0"
                          style={{
                            left: pct(sim.now),
                            width: width(sim.now, sim.expiresAt),
                            border: `1px dashed ${COLOR[who]}`,
                            opacity: 0.6,
                          }}
                        />
                      )}
                    </div>
                  );
                })}
                {sim.beats.filter(b => b.who === who).map((b, i) => (
                  <span
                    key={i}
                    className="absolute top-0 bottom-0 w-px"
                    style={{ left: pct(b.at), background: "#ffffff" }}
                  />
                ))}
                <span
                  className="absolute -top-1 -bottom-1 w-px"
                  style={{ left: pct(sim.now), background: "var(--g10)" }}
                />
              </div>
            </div>
          ))}
          <div className="flex gap-3">
            <span className="w-16 shrink-0" />
            <div className="flex-1 flex justify-between text-[9px] font-mono" style={{ color: "var(--g6)" }}>
              {[0, 10, 20, 30, 40].map(m => <span key={m}>{m}m</span>)}
            </div>
          </div>
        </div>

        {/* Manual controls */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {(["A", "B"] as Who[]).map(who =>
            (["claim", "beat", "submit"] as const).map(verb => (
              <button
                key={who + verb}
                onClick={() => manual(`${who}:${verb}`)}
                className="px-2 py-0.5 rounded text-[10px] font-mono"
                style={{ background: "var(--g2)", border: "1px solid var(--g4)", color: COLOR[who] }}
              >
                {who} {verb === "beat" ? "heartbeat" : verb}
              </button>
            )),
          )}
          <button
            onClick={() => manual("tick")}
            disabled={sim.now >= SPAN}
            className="px-2 py-0.5 rounded text-[10px] font-mono disabled:opacity-40"
            style={{ background: "var(--g2)", border: "1px solid var(--g4)", color: "var(--g10)" }}
          >
            +{STEP} min
          </button>
          <button onClick={reset} className="text-[10px] font-mono ml-1" style={{ color: "var(--g6)" }}>
            reset ↺
          </button>
        </div>

        {/* Server log */}
        <div className="space-y-1 min-h-[3rem]">
          <AnimatePresence initial={false}>
            {sim.log.slice(-6).map((l, i, arr) => (
              <motion.div
                key={sim.log.length - arr.length + i}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
                className="flex gap-3 text-[11px] font-mono"
              >
                <span className="w-12 shrink-0" style={{ color: "var(--g6)" }}>{l.at}m</span>
                <span className="w-4 shrink-0" style={{ color: l.who ? COLOR[l.who] : "var(--g6)" }}>{l.who ?? ""}</span>
                <span style={{ color: l.ok ? "var(--g10)" : "#ef4444" }}>{l.text}</span>
              </motion.div>
            ))}
          </AnimatePresence>
          {sim.log.length === 0 && (
            <p className="text-[12px] font-mono" style={{ color: "var(--g12)" }}>
              ↑ play a scenario, or claim, heartbeat and advance time yourself
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
