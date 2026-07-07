"use client";

import { useRef } from "react";
import { useContent } from "@/components/dom/LocaleProvider";
import { useReveal } from "./useReveal";

export default function ContactSection() {
  const ref = useRef<HTMLElement>(null);
  const { t } = useContent();
  useReveal(ref);

  return (
    <section
      ref={ref}
      id="contact"
      aria-labelledby="contact-heading"
      className="theme-dark"
    >
      {/* final CTA */}
      <div className="px-[var(--gutter)] py-[var(--space-section-y)] text-center">
        <p data-reveal className="text-eyebrow text-accent">
          {t.contactSection.eyebrow}
        </p>
        <h2
          id="contact-heading"
          data-reveal
          className="font-display font-medium text-display-xl mx-auto mt-8 max-w-[16ch]"
        >
          {t.contactSection.heading}
        </h2>
        <p
          data-reveal
          className="dim mx-auto mt-8 max-w-md text-[length:var(--text-body-lg)] leading-relaxed"
        >
          {t.contactSection.sub}
        </p>
        <div
          data-reveal
          className="mt-12 flex flex-wrap items-center justify-center gap-4"
        >
          <a
            href={t.contact.emailHref}
            className="rounded-full px-8 py-4 font-medium transition-transform hover:scale-[1.03]"
            style={{ background: "var(--color-accent)", color: "var(--color-ink)" }}
          >
            {t.contact.email}
          </a>
          <a
            href={t.contact.phoneHref}
            className="rounded-full border px-8 py-4 font-medium transition-colors hover:text-accent"
            style={{ borderColor: "rgba(240, 238, 233, 0.25)" }}
          >
            {t.contact.phone}
          </a>
        </div>
      </div>

      {/* footer */}
      <footer
        className="px-[var(--gutter)] pb-10 pt-14"
        style={{ borderTop: "1px solid rgba(240, 238, 233, 0.12)" }}
      >
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-4">
          <div>
            <p className="font-display text-lg font-medium">
              Background<span className="text-accent">.</span>
            </p>
            <p className="dim mt-3 text-sm leading-relaxed">{t.footer.blurb}</p>
          </div>
          <nav aria-label="Footer navigation">
            <p className="text-eyebrow dim">{t.ui.menu}</p>
            <ul className="mt-4 space-y-2 text-sm">
              {t.nav.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="transition-colors hover:text-accent">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div>
            <p className="text-eyebrow dim">{t.ui.studio}</p>
            <ul className="mt-4 space-y-2 text-sm">
              <li>{t.contact.location}</li>
              <li>
                <a
                  href={t.contact.emailHref}
                  className="transition-colors hover:text-accent"
                >
                  {t.contact.email}
                </a>
              </li>
              <li>
                <a
                  href={t.contact.phoneHref}
                  className="transition-colors hover:text-accent"
                >
                  {t.contact.phone}
                </a>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-eyebrow dim">{t.ui.follow}</p>
            <ul className="mt-4 space-y-2 text-sm">
              {t.social.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-accent"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className="dim mx-auto mt-14 max-w-6xl text-xs">
          © {new Date().getFullYear()} Background Production
        </p>
      </footer>
    </section>
  );
}
