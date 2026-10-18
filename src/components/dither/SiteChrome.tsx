"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LINKS } from "@/lib/data";

const PAGES = [
  { href: "/projects", label: "Projects" },
  { href: "/work", label: "Experience" },
  { href: "/photos", label: "Photos" },
];

export function SiteNav() {
  const path = usePathname();
  return (
    <header className="nav wrap">
      <Link href="/" className="nav-name">Aarnav Noble</Link>
      <nav aria-label="Pages">
        {PAGES.map((p) => (
          <Link key={p.href} href={p.href} aria-current={path.startsWith(p.href) ? "page" : undefined}>
            {p.label}
          </Link>
        ))}
        <a href={LINKS.resume} target="_blank" rel="noopener">Résumé</a>
      </nav>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="wrap footer">
      <span>© {new Date().getFullYear()} Aarnav Noble</span>
      <span className="footer-links">
        <a href={LINKS.github} target="_blank" rel="noopener">GitHub</a>
        <a href={LINKS.linkedin} target="_blank" rel="noopener">LinkedIn</a>
        <a href={`mailto:${LINKS.email}`}>{LINKS.email}</a>
      </span>
    </footer>
  );
}
