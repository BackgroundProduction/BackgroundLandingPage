"use client";

import { useContent } from "@/components/dom/LocaleProvider";
import SoundToggle from "@/components/dom/SoundToggle";

export default function Header() {
  const { t, locale } = useContent();

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
            {t.nav.map((item) => (
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
          {/* language switcher — Armenian lives at /, English at /en */}
          <nav aria-label="Language" className="flex items-center gap-1 text-xs font-medium">
            <a
              href="/"
              aria-current={locale === "hy" ? "page" : undefined}
              className="rounded-full px-2.5 py-1.5 transition-colors"
              style={
                locale === "hy"
                  ? { background: "var(--color-paper)", color: "var(--color-ink)" }
                  : { color: "var(--color-text-dim)" }
              }
            >
              ՀԱՅ
            </a>
            <a
              href="/en"
              aria-current={locale === "en" ? "page" : undefined}
              className="rounded-full px-2.5 py-1.5 transition-colors"
              style={
                locale === "en"
                  ? { background: "var(--color-paper)", color: "var(--color-ink)" }
                  : { color: "var(--color-text-dim)" }
              }
            >
              ENG
            </a>
          </nav>
          <div className="hidden sm:block">
            <SoundToggle />
          </div>
          <a
            href={t.contact.emailHref}
            className="hidden rounded-full px-5 py-2 text-sm font-medium transition-transform hover:scale-[1.03] md:block"
            style={{ background: "var(--color-paper)", color: "var(--color-ink)" }}
          >
            {t.ui.startProject}
          </a>
        </div>
      </div>
    </header>
  );
}
