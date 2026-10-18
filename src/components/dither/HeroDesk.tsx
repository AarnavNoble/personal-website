"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type PointerEvent } from "react";
import { ColorDither } from "./ColorDither";
import { Window } from "./Window";

// Numbers are from llm-engine's docs/results.md (CUDA backend, NVIDIA A40).
const BENCH = [
  "$ ./engine bench --model qwen2.5-0.5b",
  "backend      cuda, nvidia a40",
  "requests     32 concurrent",
  "batching     continuous",
  "ttft p50     75 ms   (static 3,993 ms)",
  "throughput   771 tok/s",
  "kv slots     99.0% in use",
  "$ ",
];

function subscribeReduced(on: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", on);
  return () => mq.removeEventListener("change", on);
}

function useReducedMotion() {
  return useSyncExternalStore(
    subscribeReduced,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );
}

function Terminal() {
  const reduced = useReducedMotion();
  const full = BENCH.join("\n");
  const [n, setN] = useState(0);

  useEffect(() => {
    if (reduced) return;
    if (n >= full.length) return;
    // Commands type slowly; output arrives a line at a time.
    const lineStart = full.lastIndexOf("\n", n - 1) + 1;
    const typing = full.startsWith("$", lineStart);
    const t = setTimeout(() => {
      if (typing) setN(n + 1);
      else {
        const end = full.indexOf("\n", n);
        setN(end === -1 ? full.length : end + 1);
      }
    }, typing ? 45 : 260);
    return () => clearTimeout(t);
  }, [n, full, reduced]);

  return (
    <pre className="terminal" aria-label="Benchmark output">
      {reduced ? full : full.slice(0, n)}
      <span className="cursor" aria-hidden="true" />
    </pre>
  );
}

const KV_COLS = 22;
const KV_ROWS = 7;

// Paged KV cache blocks: + is a block holding a sequence's keys and values,
// - is free. Sequences arrive, grow a block at a time, and leave.
function KvGrid() {
  const reduced = useReducedMotion();
  const [cells, setCells] = useState<boolean[]>(() =>
    Array.from({ length: KV_COLS * KV_ROWS }, (_, i) => (i * 7919) % 10 < 6),
  );

  useEffect(() => {
    if (reduced) return;
    const t = setInterval(() => {
      setCells((prev) => {
        const next = prev.slice();
        for (let k = 0; k < 6; k++) {
          const i = (Math.random() * next.length) | 0;
          const used = next.filter(Boolean).length / next.length;
          // Drift toward about 70% occupancy, like a busy server.
          next[i] = Math.random() < (used < 0.7 ? 0.75 : 0.35);
        }
        return next;
      });
    }, 160);
    return () => clearInterval(t);
  }, [reduced]);

  const used = cells.filter(Boolean).length;
  return (
    <div className="kv">
      <div className="kv-grid" style={{ gridTemplateColumns: `repeat(${KV_COLS}, 1fr)` }} aria-hidden="true">
        {cells.map((on, i) => (
          <span key={i} className={on ? "on" : ""}>{on ? "+" : "-"}</span>
        ))}
      </div>
      <p className="kv-meta">blocks {used}/{cells.length}, 16 tokens each</p>
    </div>
  );
}

type Pos = { x: number; y: number };

export function HeroDesk({ photo, scan }: { photo: string; scan: string }) {
  const [scale, setScale] = useState(3);
  const [levels, setLevels] = useState(4);
  const [offsets, setOffsets] = useState<Record<string, Pos>>({});
  const drag = useRef<{ id: string; sx: number; sy: number; ox: number; oy: number } | null>(null);

  function onBarDown(e: PointerEvent<HTMLDivElement>) {
    const id = e.currentTarget.closest<HTMLElement>("[data-win]")?.dataset.win;
    if (!id) return;
    const o = offsets[id] ?? { x: 0, y: 0 };
    drag.current = { id, sx: e.clientX, sy: e.clientY, ox: o.x, oy: o.y };
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  useEffect(() => {
    function move(e: globalThis.PointerEvent) {
      const d = drag.current;
      if (!d) return;
      setOffsets((prev) => ({ ...prev, [d.id]: { x: d.ox + e.clientX - d.sx, y: d.oy + e.clientY - d.sy } }));
    }
    function up() {
      drag.current = null;
    }
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
  }, []);

  const at = (id: string) => {
    const o = offsets[id];
    return o ? { transform: `translate(${o.x}px, ${o.y}px)` } : undefined;
  };

  return (
    <div className="desk">
      <Window tag="SCAN.RAW" className="w-scan" style={at("scan")} id="scan">
        <div className="w-photo">
          <ColorDither src={scan} alt="" cell={4} levels={3} />
        </div>
      </Window>

      <Window tag="BENCH.LOG" title="llm-engine" className="w-term" style={at("term")} onBarPointerDown={onBarDown} id="term">
        <Terminal />
      </Window>

      <Window tag="KVCACHE.SYS" title="paged kv cache" className="w-kv" style={at("kv")} onBarPointerDown={onBarDown} id="kv">
        <KvGrid />
      </Window>

      <Window tag="LIONS_HEAD.RAW" className="w-photo-win" style={at("photo")} id="photo">
        <div className="w-photo">
          <ColorDither src={photo} alt="Lion's Head, photographed by Aarnav" cell={scale} levels={levels} />
        </div>
      </Window>

      <Window tag="CTRL.SYS" title="dither" className="w-ctrl" style={at("ctrl")} onBarPointerDown={onBarDown} id="ctrl">
        <div className="ctrl">
          <label>
            <span>Scale</span>
            <span className="ctrl-value">{scale}px</span>
            <input
              type="range"
              min={2}
              max={10}
              step={1}
              value={scale}
              onChange={(e) => setScale(Number(e.target.value))}
              aria-label="Dither cell size for the photo"
            />
          </label>
          <label>
            <span>Palette</span>
            <span className="ctrl-value">{levels ** 3} colours</span>
            <input
              type="range"
              min={2}
              max={6}
              step={1}
              value={levels}
              onChange={(e) => setLevels(Number(e.target.value))}
              aria-label="Colour steps per channel for the photo"
            />
          </label>
        </div>
      </Window>
    </div>
  );
}
