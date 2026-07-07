"use client";

import { useRef } from "react";
import { site } from "@/content/site";
import { useReveal } from "./useReveal";

export default function ProcessSection() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);

  return (
    <section
      ref={ref}
      id="process"
      aria-labelledby="process-heading"
      className="px-[var(--gutter)] py-[var(--space-section-y)]"
    >
      <div className="mx-auto max-w-6xl">
        <p data-reveal className="text-eyebrow text-accent">
          How it works
        </p>
        <h2
          id="process-heading"
          data-reveal
          className="font-display font-medium text-display-lg mt-6 max-w-[20ch]"
        >
          Three steps between a brief and a memory
          <span className="text-accent">.</span>
        </h2>

        {/* vertical timeline */}
        <ol className="mt-16 list-none">
          {site.process.map((step, i) => (
            <li
              key={step.title}
              data-reveal
              className="relative grid gap-3 border-l-2 pb-14 pl-8 last:pb-0 md:grid-cols-[16rem_1fr] md:gap-12"
              style={{ borderColor: "var(--color-line)" }}
            >
              <span
                aria-hidden="true"
                className="absolute -left-[9px] top-1 h-4 w-4 rounded-full"
                style={{
                  background: "var(--color-accent)",
                  border: "3px solid var(--color-bg)",
                }}
              />
              <p className="text-eyebrow text-text-dim">
                Step {String(i + 1).padStart(2, "0")}
              </p>
              <div>
                <h3 className="font-display text-display-md font-medium">
                  {step.title}
                </h3>
                <p className="mt-4 max-w-xl text-[length:var(--text-body-lg)] leading-relaxed text-text-dim">
                  {step.text}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
