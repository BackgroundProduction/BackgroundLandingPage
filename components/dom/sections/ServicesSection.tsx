"use client";

import { useRef, useState } from "react";
import { useContent } from "@/components/dom/LocaleProvider";
import { useReveal } from "./useReveal";

const DIM = "rgba(240, 238, 233, 0.2)";

export default function ServicesSection() {
  const ref = useRef<HTMLElement>(null);
  const { t } = useContent();
  const [active, setActive] = useState(0);
  useReveal(ref);

  const items = t.services.items;
  const current = items[active];
  const cycle = (dir: -1 | 1) =>
    setActive((a) => (a + dir + items.length) % items.length);

  return (
    <section
      ref={ref}
      id="services"
      aria-labelledby="services-heading"
      className="theme-dark px-[var(--gutter)] py-[var(--space-section-y)]"
    >
      <div className="mx-auto grid max-w-7xl gap-14 md:grid-cols-[1fr_2.2fr] md:gap-20">
        {/* left column — eyebrow, pager, active service description */}
        <div className="flex flex-col md:pt-2">
          <p data-reveal className="flex items-center gap-3 text-eyebrow text-accent">
            <span aria-hidden="true">●</span>
            {t.services.eyebrow}
          </p>

          <div data-reveal className="mt-10 md:mt-16">
            <div
              className="flex items-center justify-between border-t pt-4"
              style={{ borderColor: "rgba(240, 238, 233, 0.2)" }}
            >
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => cycle(-1)}
                  aria-label="Previous service"
                  className="text-xl transition-colors hover:text-accent"
                >
                  ←
                </button>
                <button
                  type="button"
                  onClick={() => cycle(1)}
                  aria-label="Next service"
                  className="text-xl transition-colors hover:text-accent"
                >
                  →
                </button>
              </div>
              <p className="dim font-mono text-xs tracking-widest">
                {String(active + 1).padStart(2, "0")}/{String(items.length).padStart(2, "0")}
              </p>
            </div>

            <div key={active} className="fade-in mt-8">
              <h3 id="services-heading" className="font-display text-xl font-medium">
                {current.title}
              </h3>
              <p className="dim mt-4 max-w-sm text-[0.95rem] leading-relaxed">
                {current.description}
              </p>
            </div>
          </div>
        </div>

        {/* giant stacked service titles — active lights up */}
        <ol data-reveal className="list-none">
          {items.map((service, i) => (
            <li key={service.slug}>
              <button
                type="button"
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => setActive(i)}
                aria-pressed={i === active}
                className="font-display block w-full text-left font-medium leading-[1.06] transition-colors duration-300"
                style={{
                  fontSize: "clamp(2rem, 5.2vw, 4.75rem)",
                  letterSpacing: "-0.02em",
                  color: i === active ? "var(--color-dark-text)" : DIM,
                }}
              >
                {service.title}
              </button>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
