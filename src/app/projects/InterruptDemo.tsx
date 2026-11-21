"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ACCENT = "#f472b6";
const NOISE_GATE_MS = 300;
const CHAR_MS = 38; // the silent voice: a fixed reading speed
const REPLY_MS = 450;

// A small version of the repo's reducer: every event goes through reduce(state, event), which
// returns the next state, the effects to run, and a name for the transition. Timers and the
// voice live outside it and come back in as events.
type Phase = "idle" | "processing" | "bot_speaking" | "overlap" | "user_speaking";
const PHASES: Phase[] = ["idle", "processing", "bot_speaking", "overlap", "user_speaking"];

type BotTurn = { id: number; role: "bot"; text: string; heard: number; interrupted: boolean };
type UserTurn = { id: number; role: "user"; text: string };
type Turn = BotTurn | UserTurn;
type Utterance = { startedAt: number; text: string; gate: boolean };

type State = {
  phase: Phase;
  started: boolean;
  nextId: number;
  turns: Turn[];
  activeBotId: number | null;
  awaitingReplyId: number | null;
  utterance: Utterance | null;
};

type Event =
  | { type: "START"; at: number }
  | { type: "BOT_REPLY"; at: number; turnId: number; text: string }
  | { type: "TTS_PROGRESS"; at: number; turnId: number }
  | { type: "USER_SPEECH_START"; at: number }
  | { type: "USER_TRANSCRIPT"; at: number; text: string }
  | { type: "NOISE_GATE_ELAPSED"; at: number; speechStartedAt: number }
  | { type: "USER_SPEECH_END"; at: number }
  | { type: "USER_TYPED"; at: number; text: string };

type Unstamped<E = Event> = E extends Event ? Omit<E, "at"> : never;

type Effect =
  | { type: "generate"; turnId: number; userText: string | null }
  | { type: "stopSpeaking" }
  | { type: "startNoiseGate"; speechStartedAt: number };

type Result = { state: State; effects: Effect[]; transition: string };

const INITIAL: State = {
  phase: "idle",
  started: false,
  nextId: 1,
  turns: [],
  activeBotId: null,
  awaitingReplyId: null,
  utterance: null,
};

const same = (state: State, transition: string): Result => ({ state, effects: [], transition });

// Freeze the bot turn at what was actually played and stop the voice.
function interrupt(s: State): State {
  return {
    ...s,
    activeBotId: null,
    turns: s.turns.map(t => (t.role === "bot" && t.id === s.activeBotId ? { ...t, interrupted: true } : t)),
  };
}

function requestReply(s: State, text: string): { state: State; effects: Effect[] } {
  const id = s.nextId;
  return {
    state: { ...s, phase: "processing", nextId: id + 1, awaitingReplyId: id, utterance: null },
    effects: [{ type: "generate", turnId: id, userText: text }],
  };
}

function addUser(s: State, text: string): State {
  return { ...s, nextId: s.nextId + 1, turns: [...s.turns, { id: s.nextId, role: "user", text }] };
}

function reduce(s: State, e: Event): Result {
  switch (e.type) {
    case "START": {
      if (s.started) return same(s, "start_ignored_already_started");
      const id = s.nextId;
      return {
        state: { ...s, started: true, phase: "processing", nextId: id + 1, awaitingReplyId: id },
        effects: [{ type: "generate", turnId: id, userText: null }],
        transition: "opener_requested",
      };
    }
    case "BOT_REPLY": {
      if (e.turnId !== s.awaitingReplyId) return same(s, "stale_chunk_dropped");
      const turn: BotTurn = { id: e.turnId, role: "bot", text: e.text, heard: 0, interrupted: false };
      return same(
        { ...s, phase: "bot_speaking", awaitingReplyId: null, activeBotId: e.turnId, turns: [...s.turns, turn] },
        "reply_started",
      );
    }
    case "TTS_PROGRESS": {
      if (e.turnId !== s.activeBotId) return same(s, "stale_tts_dropped");
      const turns = s.turns.map(t => (t.role === "bot" && t.id === e.turnId ? { ...t, heard: t.heard + 1 } : t));
      const turn = turns.find(t => t.id === e.turnId) as BotTurn;
      if (turn.heard < turn.text.length) return same({ ...s, turns }, "tts_progress");
      if (s.phase === "overlap") {
        // Nothing left to cut: the user simply has the floor.
        const u = s.utterance!;
        const next = u.text ? addUser({ ...s, turns }, u.text) : { ...s, turns };
        return same({ ...next, phase: "user_speaking", activeBotId: null }, "bot_finished_during_overlap");
      }
      return same({ ...s, turns, phase: "idle", activeBotId: null }, "bot_turn_complete");
    }
    case "USER_SPEECH_START": {
      if (s.utterance) return same(s, "duplicate_speech_start_ignored");
      const utterance = { startedAt: e.at, text: "", gate: false };
      if (s.phase === "bot_speaking") {
        return {
          state: { ...s, phase: "overlap", utterance },
          effects: [{ type: "startNoiseGate", speechStartedAt: e.at }],
          transition: "overlap_began",
        };
      }
      return same({ ...s, phase: "user_speaking", started: true, utterance }, "user_turn_began");
    }
    case "USER_TRANSCRIPT": {
      if (!s.utterance) return same(s, "transcript_without_speech_ignored");
      const utterance = { ...s.utterance, text: e.text };
      if (s.phase === "overlap") return same({ ...s, utterance }, "overlap_text_buffered");
      const last = s.turns[s.turns.length - 1];
      if (last?.role !== "user") return same({ ...addUser(s, e.text), utterance }, "user_text_updated");
      const turns = s.turns.map(t => (t === last ? { ...t, text: e.text } : t));
      return same({ ...s, utterance, turns }, "user_text_updated");
    }
    case "NOISE_GATE_ELAPSED": {
      if (s.phase !== "overlap" || s.utterance?.startedAt !== e.speechStartedAt) return same(s, "stale_noise_gate_ignored");
      const utterance = { ...s.utterance, gate: true };
      if (!utterance.text) return same({ ...s, utterance }, "noise_gate_passed_waiting_for_words");
      return {
        state: { ...addUser(interrupt(s), utterance.text), phase: "user_speaking", utterance },
        effects: [{ type: "stopSpeaking" }],
        transition: "interrupt_confirmed",
      };
    }
    case "USER_SPEECH_END": {
      const u = s.utterance;
      if (!u) return same(s, "speech_end_ignored");
      if (s.phase === "overlap") {
        const real = (u.gate || e.at - u.startedAt >= NOISE_GATE_MS) && u.text.trim() !== "";
        if (!real) return same({ ...s, phase: "bot_speaking", utterance: null }, "noise_ignored");
        const r = requestReply(addUser(interrupt(s), u.text), u.text);
        return { state: r.state, effects: [{ type: "stopSpeaking" }, ...r.effects], transition: "interrupt_confirmed_at_speech_end" };
      }
      if (!u.text.trim()) return same({ ...s, phase: "idle", utterance: null }, "empty_user_turn_dropped");
      return { ...requestReply(s, u.text), transition: "user_turn_ended" };
    }
    case "USER_TYPED": {
      if (s.phase === "bot_speaking" || s.phase === "overlap") {
        const r = requestReply(addUser(interrupt(s), e.text), e.text);
        return { state: r.state, effects: [{ type: "stopSpeaking" }, ...r.effects], transition: "typed_interrupt" };
      }
      if (s.phase === "idle") return { ...requestReply(addUser({ ...s, started: true }, e.text), e.text), transition: "typed_turn" };
      return same(s, "typed_ignored_in_demo");
    }
  }
}

// A canned responder; the repo's is rule based too.
function respond(userText: string | null) {
  if (userText === null) {
    return "Hi, I'm a voice agent you can interrupt. I read my reply one sentence at a time, and I only remember the words you actually heard. Cut in whenever you like.";
  }
  if (userText.includes("joke")) return "Sure. Why did the state machine stay calm? Every event had exactly one place to go.";
  return "Okay, I've stopped. Say something whenever you're ready.";
}

type Script = [ms: number, event: Unstamped][];

const USER_ACTIONS: { label: string; about: string; script: Script }[] = [
  {
    label: "Cough",
    about: "150 ms of sound, no words: it never passes the noise gate",
    script: [
      [0, { type: "USER_SPEECH_START" }],
      [150, { type: "USER_SPEECH_END" }],
    ],
  },
  {
    label: "Say \"wait…\"",
    about: "\"wait\" arrives before the gate and is buffered, not lost",
    script: [
      [0, { type: "USER_SPEECH_START" }],
      [150, { type: "USER_TRANSCRIPT", text: "wait" }],
      [800, { type: "USER_TRANSCRIPT", text: "wait, tell me a joke" }],
      [1100, { type: "USER_SPEECH_END" }],
    ],
  },
  {
    label: "Type \"stop\"",
    about: "typing is deliberate, so it skips the gate",
    script: [[0, { type: "USER_TYPED", text: "stop" }]],
  },
];

type LogLine = { id: number; event: string; transition: string; phase: Phase };

// The app side, like the repo's main.ts: stamps events, feeds them to the reducer one at a
// time, and turns effects into timers. Created once per mounted demo.
function createRunner(onState: (s: State) => void, onLog: (line: LogLine) => void) {
  let state = INITIAL;
  let timers: ReturnType<typeof setTimeout>[] = [];
  let logId = 0;

  function later(ms: number, fn: () => void) {
    timers.push(setTimeout(fn, ms));
  }

  function dispatch(event: Unstamped) {
    const full = { ...event, at: performance.now() } as Event;
    const r = reduce(state, full);
    state = r.state;
    onState(state);
    if (r.transition !== "tts_progress") {
      onLog({ id: ++logId, event: full.type, transition: r.transition, phase: state.phase });
    }
    for (const fx of r.effects) {
      if (fx.type === "generate") {
        later(REPLY_MS, () => dispatch({ type: "BOT_REPLY", turnId: fx.turnId, text: respond(fx.userText) }));
      } else if (fx.type === "startNoiseGate") {
        later(NOISE_GATE_MS, () => dispatch({ type: "NOISE_GATE_ELAPSED", speechStartedAt: fx.speechStartedAt }));
      }
      // stopSpeaking needs no work here: the voice only plays the active bot turn.
    }
  }

  return {
    dispatch,
    run(script: Script) {
      for (const [ms, event] of script) later(ms, () => dispatch(event));
    },
    cancelTimers() {
      timers.forEach(clearTimeout);
      timers = [];
    },
    reset() {
      this.cancelTimers();
      // Ids keep counting so a late reply from before the reset can never match.
      state = { ...INITIAL, nextId: state.nextId };
      onState(state);
    },
  };
}

export function InterruptDemo() {
  const [state, setState] = useState<State>(INITIAL);
  const [log, setLog] = useState<LogLine[]>([]);
  const [runner] = useState(() => createRunner(setState, line => setLog(l => [...l.slice(-7), line])));

  // The voice: plays the active bot turn one character at a time, reporting progress as events.
  const speakingId = state.phase === "bot_speaking" || state.phase === "overlap" ? state.activeBotId : null;
  useEffect(() => {
    if (speakingId === null) return;
    const t = setInterval(() => runner.dispatch({ type: "TTS_PROGRESS", turnId: speakingId }), CHAR_MS);
    return () => clearInterval(t);
  }, [speakingId, runner]);

  useEffect(() => () => runner.cancelTimers(), [runner]);

  const dispatch = runner.dispatch;
  const run = runner.run;

  function reset() {
    runner.reset();
    setLog([]);
  }

  const botTalking = state.phase === "bot_speaking";

  return (
    <div
      className="rounded-xl overflow-hidden mt-6"
      style={{ border: "1px solid rgba(244,114,182,0.25)", background: "rgba(244,114,182,0.03)" }}
    >
      <div
        className="px-4 py-2.5 flex items-center justify-between"
        style={{ borderBottom: "1px solid rgba(244,114,182,0.15)", background: "rgba(244,114,182,0.05)" }}
      >
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: ACCENT }} />
          <span className="text-[11px] font-mono" style={{ color: "var(--g8)" }}>interrupt-lab / reducer</span>
        </div>
        <span className="text-[10px] font-mono" style={{ color: "var(--g6)" }}>no mic, silent voice</span>
      </div>

      <div className="p-4">
        {/* Phase strip */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {PHASES.map(p => (
            <span
              key={p}
              className="px-2 py-0.5 rounded text-[10px] font-mono transition-all"
              style={
                state.phase === p
                  ? { background: "rgba(244,114,182,0.2)", border: "1px solid rgba(244,114,182,0.5)", color: "#fbcfe8" }
                  : { background: "var(--g2)", border: "1px solid var(--g4)", color: "var(--g6)" }
              }
            >
              {p}
            </span>
          ))}
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <button
            onClick={() => dispatch({ type: "START" })}
            className="px-2.5 py-1 rounded text-[11px] font-mono"
            style={{ background: "rgba(244,114,182,0.15)", border: "1px solid rgba(244,114,182,0.4)", color: "#fbcfe8" }}
          >
            {state.started ? "start again (ignored)" : "start conversation"}
          </button>
          {USER_ACTIONS.map(a => (
            <button
              key={a.label}
              onClick={() => run(a.script)}
              disabled={!botTalking}
              title={a.about}
              className="px-2.5 py-1 rounded text-[11px] font-mono disabled:opacity-40"
              style={{ background: "var(--g2)", border: "1px solid var(--g4)", color: "var(--g10)" }}
            >
              {a.label}
            </button>
          ))}
          <button onClick={reset} className="text-[10px] font-mono ml-1" style={{ color: "var(--g6)" }}>
            reset ↺
          </button>
        </div>
        <p className="text-[10px] font-mono mb-4" style={{ color: "var(--g6)" }}>
          the interrupt buttons work while the bot is speaking
        </p>

        {/* Transcript: delivered text normal, undelivered struck through */}
        <div className="space-y-1.5 mb-4 min-h-[2.5rem]">
          {state.turns.length === 0 && (
            <p className="text-[12px] font-mono" style={{ color: "var(--g12)" }}>
              ↑ start the conversation, then cut the bot off
            </p>
          )}
          {state.turns.slice(-4).map(t => (
            <div key={t.id} className="flex gap-3 text-[12px] font-mono">
              <span className="w-8 shrink-0" style={{ color: t.role === "bot" ? ACCENT : "var(--g8)" }}>
                {t.role === "bot" ? "bot" : "you"}
              </span>
              {t.role === "user" ? (
                <span style={{ color: "var(--g11)" }}>{t.text}</span>
              ) : (
                <span>
                  <span style={{ color: "var(--g10)" }}>{t.text.slice(0, t.heard)}</span>
                  <span
                    style={{
                      color: "var(--g5)",
                      textDecoration: t.interrupted ? "line-through" : "none",
                    }}
                  >
                    {t.text.slice(t.heard)}
                  </span>
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Event log */}
        <div className="pt-3 space-y-1" style={{ borderTop: "1px solid var(--g3)" }}>
          <p className="text-[10px] font-mono mb-1" style={{ color: "var(--g6)" }}>EVENT LOG</p>
          <AnimatePresence initial={false}>
            {log.map(l => (
              <motion.div
                key={l.id}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
                className="flex flex-wrap gap-x-3 text-[11px] font-mono"
              >
                <span className="w-40 shrink-0" style={{ color: "var(--g7)" }}>{l.event}</span>
                <span style={{ color: l.transition.includes("stale") || l.transition.includes("ignored") ? "var(--g6)" : ACCENT }}>
                  {l.transition}
                </span>
                <span style={{ color: "var(--g6)" }}>→ {l.phase}</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
