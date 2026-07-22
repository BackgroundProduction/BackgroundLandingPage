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
      id="faq"
      aria-labelledby="faq-heading"
      className="theme-dark px-[var(--gutter)] py-[var(--space-section-y)]"
    >
      {/* full-bleed: narrow left column, accordion stretches to the right edge */}
      <div className="grid gap-12 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-16">
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
            {/* photo slot — branded placeholder until a team headshot lands */}
            <div
              aria-hidden="true"
              className="relative mb-5 flex aspect-square w-44 items-end rounded-sm p-4"
              style={{
                background:
                  "linear-gradient(135deg, var(--color-accent-soft), rgba(240,238,233,0.04))",
                border: "1px dashed var(--color-line)",
              }}
            >
              <img
                src="/assets/logo.svg"
                alt=""
                className="pointer-events-none absolute inset-0 m-auto h-1/1 w-auto opacity-25"
              />
              
            </div>
            <p className="font-display text-lg font-medium leading-snug">
              {t.faq.moreTitle}
            </p>
            <p className="dim mt-1 text-sm">{t.faq.moreText}</p>
            <a
              href={t.contact.phoneHref}
              className="mt-5 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-transform hover:scale-[1.03]"
              style={{ background: "var(--color-paper)", color: "var(--color-ink)" }}
            >
              {t.faq.bookCall}
              <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>

        {/* RIGHT — big heading + full-width accordion */}
        <div>
          <h2
            id="faq-heading"
            data-reveal
            className="font-display font-bold uppercase max-w-[20ch]"
            style={{ fontSize: "clamp(2rem, 4vw, 4rem)", lineHeight: 1.05, letterSpacing: "-0.02em" }}
          >
            {t.faq.heading}
            <span className="text-accent">.</span>
          </h2>

          <div
            data-reveal
            className="mt-14 border-t"
            style={{ borderColor: "var(--color-line)" }}
          >
            {t.faq.items.map((faq) => (
              <details key={faq.q} className="faq-item">
                <summary>
                  <span className="font-display text-xl font-medium md:text-2xl">
                    {faq.q}
                  </span>
                </summary>
                <p className="dim max-w-3xl px-1 pb-6 pt-1 text-[length:var(--text-body-lg)] leading-relaxed">
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
