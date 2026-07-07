"use client";

import { useRef } from "react";
import { services } from "@/content/services";
import { useSectionTrigger } from "./useSectionTrigger";

export default function ServicesSection() {
  const ref = useRef<HTMLElement>(null);
  useSectionTrigger("services", ref);

  return (
    <section
      ref={ref}
      id="services"
      aria-labelledby="services-heading"
      className="relative px-[var(--gutter)] py-[var(--space-section-y)]"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-6 md:grid-cols-[auto_1fr] md:gap-24">
          <p data-reveal className="text-eyebrow text-accent">
            02 — What we do
          </p>
          <h2
            id="services-heading"
            data-reveal
            className="font-display font-medium text-display-lg"
          >
            Every stage, every scale<span className="text-accent">.</span>
          </h2>
        </div>

        <ol
          className="mt-20 list-none border-t"
          style={{ borderColor: "var(--color-line)" }}
        >
          {services.map((service, i) => (
            <li
              key={service.slug}
              data-reveal
              className="group border-b transition-colors hover:bg-surface"
              style={{ borderColor: "var(--color-line)" }}
            >
              <div className="grid gap-3 px-2 py-10 md:grid-cols-[6rem_1fr_1.2fr_auto] md:items-center md:gap-10 md:py-12">
                <span className="font-display text-lg text-text-dim transition-colors group-hover:text-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-display text-display-md font-medium">
                  {service.title}
                </h3>
                <p className="max-w-md text-base leading-relaxed text-text-dim">
                  {service.description}
                </p>
                <span
                  aria-hidden="true"
                  className="hidden text-2xl text-text-dim transition-all group-hover:translate-x-2 group-hover:text-accent md:block"
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
