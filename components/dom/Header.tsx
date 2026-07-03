"use client";

import { site } from "@/content/site";

export default function Header() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 mix-blend-difference">
      <div className="flex items-center justify-between px-6 md:px-12 py-6">
        <a
          href="#top"
          className="font-display text-lg tracking-wide text-cream"
        >
          Background<span className="text-gold-bright">.</span>
        </a>
        <nav aria-label="Main navigation" className="hidden sm:block">
          <ul className="flex gap-6 md:gap-10">
            {site.nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="text-eyebrow text-cream/80 hover:text-gold-bright transition-colors"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
