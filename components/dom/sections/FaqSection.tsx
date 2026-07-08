"use client";

import { useRef } from "react";
import { useContent } from "@/components/dom/LocaleProvider";
import { useReveal } from "./useReveal";

export default function FaqSection() {
  const ref = useRef<HTMLElement>(null);
  const { t } = useContent();
  useReveal(ref);

  return (
    <section
      ref={ref}
      aria-labelledby="faq-heading"
      className="theme-dark px-[var(--gutter)] py-[var(--space-section-y)]"
    >
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_2.3fr] lg:gap-16">
        {/* LEFT — eyebrow (top) + "more questions" CTA (bottom) */}
        <div className="flex flex-col justify-between gap-16">
          <p
            data-reveal
            className="flex items-center gap-3 text-eyebrow text-text-dim"
          >
            <span aria-hidden="true" className="text-accent">
              ●
            </span>
            {t.faq.eyebrow}
          </p>

          <div data-reveal>
            {/* photo slot — swap for a team headshot */}
            <div
              aria-hidden="true"
              className="mb-5 flex aspect-square w-40 items-end rounded-sm p-4"
              style={{
                background:
                  "linear-gradient(135deg, var(--color-accent-soft), rgba(240,238,233,0.04))",
                border: "1px dashed var(--color-line)",
              }}
            >
              <span className="text-eyebrow text-text-dim">{t.ui.photoLabel}</span>
            </div>
            <p className="font-display text-xl font-medium leading-snug">
              {t.faq.moreTitle}
            </p>
            <p className="dim mt-1 text-sm">{t.faq.moreText}</p>
            <a
              href={t.contact.emailHref}
              className="mt-5 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-transform hover:scale-[1.03]"
              style={{ background: "var(--color-paper)", color: "var(--color-ink)" }}
            >
              {t.faq.bookCall}
              <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>

        {/* RIGHT — heading + full-width accordion */}
        <div>
          <h2
            id="faq-heading"
            data-reveal
            className="font-display font-medium text-display-lg max-w-[16ch]"
          >
            {t.faq.heading}
            <span className="text-accent">.</span>
          </h2>

          <div
            data-reveal
            className="mt-12 border-t"
            style={{ borderColor: "var(--color-line)" }}
          >
            {t.faq.items.map((faq) => (
              <details key={faq.q} className="faq-item">
                <summary>
                  <span className="font-display text-base font-medium md:text-lg">
                    {faq.q}
                  </span>
                </summary>
                <p className="dim max-w-2xl px-1 pb-6 pt-1 text-[length:var(--text-body-lg)] leading-relaxed">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
