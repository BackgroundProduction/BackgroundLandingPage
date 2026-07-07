"use client";

import { site } from "@/content/site";

export default function Header() {
  return (
    <header className="fixed top-0 inset-x-0 z-50">
      <div
        className="flex items-center justify-between px-[var(--gutter)] py-5 backdrop-blur-md"
        style={{
          background: "rgba(10, 10, 10, 0.55)",
          borderBottom: "1px solid var(--color-line-soft)",
        }}
      >
        <a href="#top" className="font-display text-lg font-medium tracking-tight">
          Background<span className="text-accent">.</span>
        </a>
        <nav aria-label="Main navigation" className="hidden md:block">
          <ul className="flex gap-8">
            {site.nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="text-eyebrow text-text-dim transition-colors hover:text-accent"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <a
          href={site.contact.emailHref}
          className="rounded-full border border-line px-5 py-2 text-sm font-medium transition-colors hover:border-accent hover:text-accent"
        >
          Start a project
        </a>
      </div>
    </header>
  );
}
