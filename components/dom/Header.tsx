"use client";

import { site } from "@/content/site";
import SoundToggle from "@/components/dom/SoundToggle";

export default function Header() {
  return (
    <header className="fixed top-0 inset-x-0 z-50">
      <div
        className="flex items-center justify-between px-[var(--gutter)] py-4 backdrop-blur-md"
        style={{
          background: "color-mix(in srgb, var(--color-bg) 72%, transparent)",
          borderBottom: "1px solid var(--color-line-soft)",
        }}
      >
        <a href="#top" className="font-display text-lg font-medium tracking-tight">
          Background<span className="text-accent">.</span>
        </a>
        <nav aria-label="Main navigation" className="hidden lg:block">
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
        <div className="flex items-center gap-3">
          <SoundToggle />
          <a
            href={site.contact.emailHref}
            className="rounded-full px-5 py-2 text-sm font-medium text-white transition-transform hover:scale-[1.03]"
            style={{ background: "var(--color-ink)" }}
          >
            Start a project
          </a>
        </div>
      </div>
    </header>
  );
}
