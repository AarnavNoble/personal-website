"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";

type Cmd = { group: string; id: string; label: string; hint?: string; action: () => void };

export function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const copyEmail = useCallback(() => {
    navigator.clipboard.writeText("aarnavnoble14@gmail.com").then(() => {
      setCopied(true);
      setTimeout(() => { setCopied(false); setOpen(false); }, 900);
    });
  }, []);

  const COMMANDS: Cmd[] = [
    { group: "Navigate", id: "home",     label: "Home",         action: () => { router.push("/");          setOpen(false); } },
    { group: "Navigate", id: "work",     label: "Work",         action: () => { router.push("/work");      setOpen(false); } },
    { group: "Navigate", id: "projects", label: "Projects",     action: () => { router.push("/projects");  setOpen(false); } },
    { group: "Connect",  id: "github",   label: "GitHub",       hint: "G", action: () => { window.open("https://github.com/AarnavNoble", "_blank"); setOpen(false); } },
    { group: "Connect",  id: "linkedin", label: "LinkedIn",     hint: "L", action: () => { window.open("https://linkedin.com/in/aarnav-noble", "_blank"); setOpen(false); } },
    { group: "Connect",  id: "email",    label: copied ? "Copied ✓" : "Copy email", hint: "E", action: copyEmail },
  ];

  const filtered = query.trim()
    ? COMMANDS.filter(c => c.label.toLowerCase().includes(query.toLowerCase()))
    : COMMANDS;

  useEffect(() => { setActive(0); }, [query]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 20);
    else setQuery("");
  }, [open]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); setOpen(o => !o); return; }
      if (!open) return;
      if (e.key === "Escape") { setOpen(false); return; }
      if (e.key === "ArrowDown") { e.preventDefault(); setActive(a => Math.min(a + 1, filtered.length - 1)); }
      if (e.key === "ArrowUp")   { e.preventDefault(); setActive(a => Math.max(a - 1, 0)); }
      if (e.key === "Enter") { e.preventDefault(); filtered[active]?.action(); }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, filtered, active, copyEmail]);

  if (!open) return null;

  const groups = [...new Set(filtered.map(c => c.group))];

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]"
      style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)" }}
      onClick={() => setOpen(false)}
    >
      <div
        className="w-full max-w-[480px] mx-4 rounded-xl overflow-hidden"
        style={{ background: "var(--g1)", border: "1px solid var(--g4)", boxShadow: "0 24px 64px rgba(0,0,0,0.6)" }}
        onClick={e => e.stopPropagation()}
      >
        {/* Input */}
        <div className="flex items-center gap-3 px-4 py-3.5" style={{ borderBottom: "1px solid var(--g3)" }}>
          <span className="text-[14px]" style={{ color: "var(--g6)" }}>⌘</span>
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search…"
            className="flex-1 bg-transparent outline-none text-[14px]"
            style={{ color: "var(--g12)" }}
          />
          <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded" style={{ color: "var(--g6)", background: "var(--g3)", border: "1px solid var(--g4)" }}>ESC</kbd>
        </div>

        {/* Commands */}
        <div className="py-1.5 max-h-[320px] overflow-y-auto">
          {filtered.length === 0 && (
            <p className="px-4 py-3 text-[13px]" style={{ color: "var(--g6)" }}>No results</p>
          )}
          {groups.map(group => (
            <div key={group}>
              <p className="px-4 pt-3 pb-1 text-[10px] font-mono uppercase tracking-[0.1em]" style={{ color: "var(--g5)" }}>
                {group}
              </p>
              {filtered.filter(c => c.group === group).map(cmd => {
                const idx = filtered.indexOf(cmd);
                const isActive = active === idx;
                return (
                  <button
                    key={cmd.id}
                    className="w-full flex items-center justify-between gap-3 px-4 py-2.5 text-left transition-colors"
                    style={{ background: isActive ? "var(--g3)" : "transparent" }}
                    onMouseEnter={() => setActive(idx)}
                    onClick={cmd.action}
                  >
                    <span className="text-[14px]" style={{ color: isActive ? "var(--g12)" : "var(--g9)" }}>
                      {cmd.label}
                    </span>
                    {cmd.hint && (
                      <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded shrink-0"
                        style={{ color: "var(--g6)", background: "var(--g2)", border: "1px solid var(--g4)" }}>
                        {cmd.hint}
                      </kbd>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 flex items-center gap-4" style={{ borderTop: "1px solid var(--g3)" }}>
          <span className="text-[10px] font-mono" style={{ color: "var(--g5)" }}>↑↓ navigate</span>
          <span className="text-[10px] font-mono" style={{ color: "var(--g5)" }}>↵ select</span>
          <span className="text-[10px] font-mono" style={{ color: "var(--g5)" }}>esc close</span>
        </div>
      </div>
    </div>
  );
}
