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
      className="px-[var(--gutter)] py-[var(--space-section-y)]"
    >
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 md:grid-cols-[1fr_1.6fr] md:gap-20">
          <div>
            <p data-reveal className="text-eyebrow text-accent">
              {t.faq.eyebrow}
            </p>
            <h2
              id="faq-heading"
              data-reveal
              className="font-display font-medium text-display-lg mt-6"
            >
              {t.faq.heading}
              <span className="text-accent">.</span>
            </h2>
          </div>
          <div className="border-t" style={{ borderColor: "var(--color-line)" }}>
            {t.faq.items.map((faq) => (
              <details
                key={faq.q}
                data-reveal
                className="faq-item border-b"
                style={{ borderColor: "var(--color-line)" }}
              >
                <summary className="flex items-center justify-between gap-6 py-6">
                  <span className="font-display text-lg font-medium md:text-xl">
                    {faq.q}
                  </span>
                </summary>
                <p className="max-w-xl pb-6 text-[length:var(--text-body-lg)] leading-relaxed text-text-dim">
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
