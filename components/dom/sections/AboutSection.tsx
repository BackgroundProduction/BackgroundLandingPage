"use client";

import { useRef } from "react";
import { site } from "@/content/site";
import { useSectionTrigger } from "./useSectionTrigger";

export default function AboutSection() {
  const ref = useRef<HTMLElement>(null);
  useSectionTrigger("about", ref);

  return (
    <section
      ref={ref}
      id="about"
      aria-labelledby="about-heading"
      className="relative px-[var(--gutter)] py-[var(--space-section-y)]"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-6 md:grid-cols-[auto_1fr] md:gap-24">
          <p data-reveal className="text-eyebrow text-accent">
            01 — Who we are
          </p>
          <div>
            <h2
              id="about-heading"
              data-reveal
              className="font-display font-medium text-display-lg max-w-[24ch]"
            >
              Event planning is all about the behind-scene{" "}
              <em className="not-italic text-accent">magic</em>.
            </h2>
            <p
              data-reveal
              className="mt-8 max-w-2xl text-[length:var(--text-body-lg)] leading-relaxed text-text-dim"
            >
              It’s about tiny details, logistics and emotions — carefully
              thought and mapped out to create a memorable experience.
            </p>
          </div>
        </div>

        {/* tagline words as an editorial value grid */}
        <div
          data-reveal
          className="mt-24 grid grid-cols-2 border-t md:grid-cols-4"
          style={{ borderColor: "var(--color-line)" }}
        >
          {site.taglineWords.map((word, i) => (
            <div
              key={word}
              className="group border-b px-2 py-10 md:py-14"
              style={{ borderColor: "var(--color-line)" }}
            >
              <p className="text-eyebrow text-text-dim">
                {String(i + 1).padStart(2, "0")}
              </p>
              <p className="font-display mt-4 text-xl md:text-2xl font-medium transition-colors group-hover:text-accent">
                {word}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-24 grid gap-12 md:grid-cols-2 md:gap-24">
          <div className="space-y-6">
            {site.about.paragraphs.map((p, i) => (
              <p
                key={i}
                data-reveal
                className="text-[length:var(--text-body-lg)] leading-relaxed text-text-dim"
              >
                {p}
              </p>
            ))}
          </div>
          <div className="flex flex-col justify-between gap-12">
            <p
              data-reveal
              className="font-display text-display-md font-medium text-accent"
            >
              {site.about.aside}
            </p>
            <p
              data-reveal
              className="border-l-2 pl-6 text-[length:var(--text-body-lg)] leading-relaxed"
              style={{ borderColor: "var(--color-accent)" }}
            >
              {site.vision}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
