"use client";

import { useState } from "react";

export function CopyEmail({ email, className }: { email: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard.writeText(email).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <button type="button" className={className} onClick={copy} aria-live="polite">
      {copied ? "Copied" : email}
    </button>
  );
}
