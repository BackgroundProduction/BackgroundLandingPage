"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useContent } from "@/components/dom/LocaleProvider";
import { useReveal } from "./useReveal";

const DIM = "rgba(240, 238, 233, 0.28)";

export default function ServicesSection() {
  const ref = useRef<HTMLElement>(null);
  const { t } = useContent();
  const [active, setActive] = useState(0);
  useReveal(ref);

  const items = t.services.items;

  return (
    <section
      ref={ref}
      id="services"
      aria-labelledby="services-heading"
      className="theme-dark relative px-[var(--gutter)] py-[var(--space-section-y)]"
    >
      <div className="mx-auto max-w-7xl">
        <p
          data-reveal
          className="flex items-center gap-3 text-eyebrow text-text-dim"
        >
          <span aria-hidden="true" className="text-accent">
            ●
          </span>
          {t.services.eyebrow}
        </p>

        <div className="relative mt-12 md:mt-16">
          {/* giant full-width stacked titles — active lights up */}
          <ol data-reveal className="list-none">
            {items.map((service, i) => (
              <li key={service.slug}>
                <button
                  type="button"
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                  aria-pressed={i === active}
                  aria-describedby={i === active ? "service-desc" : undefined}
                  className="font-display block w-full text-left font-medium leading-[1.04] transition-colors duration-300"
                  style={{
                    fontSize: "clamp(2.5rem, 8vw, 8rem)",
                    letterSpacing: "-0.03em",
                    color: i === active ? "var(--color-dark-text)" : DIM,
                  }}
                >
                  {i === 0 && (
                    <span className="sr-only" id="services-heading">
                      {t.services.heading}.{" "}
                    </span>
                  )}
                  {service.title}
                </button>
              </li>
            ))}
          </ol>

          {/* hover media panel — floats top-right over the titles on desktop */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute right-0 top-2 hidden w-[clamp(16rem,26vw,26rem)] lg:block"
          >
            <div
              key={active}
              className="fade-in relative aspect-[4/3] overflow-hidden rounded-sm"
              style={{ border: "1px solid var(--color-line-soft)" }}
            >
              <Image
                src={items[active].image}
                alt=""
                fill
                sizes="26vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>

        {/* active service description */}
        <p
          id="service-desc"
          key={active}
          className="fade-in dim mt-12 max-w-xl text-[length:var(--text-body-lg)] leading-relaxed"
        >
          {items[active].description}
        </p>
      </div>
    </section>
  );
}
