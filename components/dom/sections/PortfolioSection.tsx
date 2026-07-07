"use client";

import { useRef } from "react";
import Image from "next/image";
import { useContent } from "@/components/dom/LocaleProvider";
import { useReveal } from "./useReveal";

export default function PortfolioSection() {
  const ref = useRef<HTMLElement>(null);
  const { t } = useContent();
  useReveal(ref);

  return (
    <section
      ref={ref}
      id="work"
      aria-labelledby="work-heading"
      className="py-[var(--space-section-y)]"
    >
      <div className="px-[var(--gutter)]">
        <div className="mx-auto max-w-6xl">
          <p data-reveal className="text-eyebrow text-accent">
            {t.work.eyebrow}
          </p>
          <div className="mt-6 flex flex-wrap items-end justify-between gap-6">
            <h2
              id="work-heading"
              data-reveal
              className="font-display font-medium text-display-lg max-w-[18ch]"
            >
              {t.work.heading}
              <span className="text-accent">.</span>
            </h2>
            <p data-reveal className="text-sm text-text-dim">
              {t.ui.dragSideways}
            </p>
          </div>
        </div>
      </div>

      {/* horizontal carousel — full-bleed, snap-scrolls */}
      <div data-reveal className="work-track mt-14 px-[var(--gutter)]">
        {t.portfolio.map((entry, i) => (
          <article
            key={entry.slug}
            className="work-card group w-[78vw] shrink-0 sm:w-[46vw] lg:w-[30vw]"
          >
            <div
              className="relative aspect-[4/3] overflow-hidden rounded-sm"
              style={{ border: "1px solid var(--color-line-soft)" }}
            >
              <Image
                src={entry.image.src}
                alt={entry.image.alt}
                fill
                sizes="(max-width: 640px) 78vw, (max-width: 1024px) 46vw, 30vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <span
                className="absolute left-4 top-4 rounded-full px-3 py-1 text-eyebrow"
                style={{
                  background: "rgba(12, 11, 10, 0.65)",
                  color: "var(--color-dark-text)",
                }}
              >
                {entry.category}
              </span>
            </div>
            <div className="mt-4 flex items-baseline gap-4">
              <span className="font-display text-sm text-text-dim">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="font-display text-xl font-medium leading-snug">
                  {entry.title}
                </h3>
                <p className="mt-1 text-sm text-text-dim">
                  {entry.location}
                  {entry.date ? ` · ${entry.date}` : ""}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
