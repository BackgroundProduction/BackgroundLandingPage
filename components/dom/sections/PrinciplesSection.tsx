"use client";

import { useRef } from "react";
import { site } from "@/content/site";
import { useReveal } from "./useReveal";

export default function PrinciplesSection() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);

  return (
    <section
      ref={ref}
      aria-labelledby="principles-heading"
      className="px-[var(--gutter)] py-[var(--space-section-y)]"
    >
      <div className="mx-auto max-w-6xl">
        <p data-reveal className="text-eyebrow text-accent">
          How we operate
        </p>
        <h2
          id="principles-heading"
          data-reveal
          className="font-display font-medium text-display-lg mt-6 max-w-[20ch]"
        >
          Four words we actually mean<span className="text-accent">.</span>
        </h2>
        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {site.principles.map((principle, i) => (
            <div
              key={principle.title}
              data-reveal
              className="rounded-sm bg-surface p-8"
              style={{ border: "1px solid var(--color-line-soft)" }}
            >
              <p className="text-eyebrow text-text-dim">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="font-display mt-5 text-2xl font-medium">
                {principle.title}
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-text-dim">
                {principle.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
