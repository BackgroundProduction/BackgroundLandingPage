"use client";

import { useRef } from "react";
import { site } from "@/content/site";
import { useReveal } from "./useReveal";

export default function AboutSection() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);

  return (
    <section
      ref={ref}
      id="about"
      aria-labelledby="about-heading"
      className="px-[var(--gutter)] py-[var(--space-section-y)]"
    >
      <div className="mx-auto max-w-6xl">
        {/* studio intro — two columns */}
        <div className="grid items-start gap-10 md:grid-cols-2 md:gap-20">
          <div data-reveal>
            <p className="text-eyebrow text-accent">Who we are</p>
            <h2
              id="about-heading"
              className="font-display font-medium text-display-lg mt-6"
            >
              The magic is behind the scene<span className="text-accent">.</span>
            </h2>
            {/* photo slot — swap for real team/production photography */}
            <div
              aria-hidden="true"
              className="mt-10 hidden aspect-[4/3] items-end rounded-sm p-6 md:flex"
              style={{
                background:
                  "linear-gradient(135deg, var(--color-accent-soft), rgba(17,16,14,0.06))",
                border: "1px solid var(--color-line-soft)",
              }}
            >
              <span className="text-eyebrow text-text-dim">
                Production still — photography coming
              </span>
            </div>
          </div>
          <div className="space-y-6">
            <p
              data-reveal
              className="font-display text-display-md font-medium leading-snug"
            >
              “{site.philosophy}”
            </p>
            {site.about.paragraphs.map((p, i) => (
              <p
                key={i}
                data-reveal
                className="text-[length:var(--text-body-lg)] leading-relaxed text-text-dim"
              >
                {p}
              </p>
            ))}
            <p data-reveal className="font-display text-xl font-medium text-accent">
              {site.about.aside}
            </p>
          </div>
        </div>

        {/* key metrics — three stat cards */}
        <div className="mt-24 grid gap-4 sm:grid-cols-3">
          {site.stats.map((stat) => (
            <div
              key={stat.label}
              data-reveal
              className="rounded-sm bg-surface p-8"
              style={{ border: "1px solid var(--color-line-soft)" }}
            >
              <p className="font-display text-5xl font-medium md:text-6xl">
                {stat.value}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-text-dim">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* client strip — text-based logo row */}
        <div
          data-reveal
          className="mt-16 border-t pt-10"
          style={{ borderColor: "var(--color-line-soft)" }}
        >
          <p className="text-eyebrow text-text-dim">Trusted for</p>
          <ul className="mt-6 flex flex-wrap gap-x-10 gap-y-4">
            {site.clients.map((client) => (
              <li
                key={client}
                className="font-display text-lg font-medium text-text-dim transition-colors hover:text-text"
              >
                {client}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
