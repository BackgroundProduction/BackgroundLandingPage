"use client";

import { useRef } from "react";
import { useContent } from "@/components/dom/LocaleProvider";
import { useReveal } from "./useReveal";

export default function ServicesSection() {
  const ref = useRef<HTMLElement>(null);
  const { t } = useContent();
  useReveal(ref);

  return (
    <section
      ref={ref}
      id="services"
      aria-labelledby="services-heading"
      className="px-[var(--gutter)] py-[var(--space-section-y)]"
    >
      <div className="mx-auto max-w-6xl">
        <p data-reveal className="text-eyebrow text-accent">
          {t.services.eyebrow}
        </p>
        <h2
          id="services-heading"
          data-reveal
          className="font-display font-medium text-display-lg mt-6"
        >
          {t.services.heading}
          <span className="text-accent">.</span>
        </h2>
        <ol
          className="mt-16 list-none border-t"
          style={{ borderColor: "var(--color-line)" }}
        >
          {t.services.items.map((service, i) => (
            <li
              key={service.slug}
              data-reveal
              className="group border-b transition-colors hover:bg-surface"
              style={{ borderColor: "var(--color-line)" }}
            >
              <div className="grid gap-2 px-2 py-8 md:grid-cols-[5rem_1fr_1.2fr_auto] md:items-center md:gap-8 md:py-10">
                <span className="font-display text-base text-text-dim transition-colors group-hover:text-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-display text-display-md font-medium">
                  {service.title}
                </h3>
                <p className="max-w-md text-sm leading-relaxed text-text-dim">
                  {service.description}
                </p>
                <span
                  aria-hidden="true"
                  className="hidden text-xl text-text-dim transition-all group-hover:translate-x-1.5 group-hover:text-accent md:block"
                >
                  →
                </span>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
