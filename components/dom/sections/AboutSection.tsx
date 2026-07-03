"use client";

import { useRef } from "react";
import { site } from "@/content/site";
import SectionHeading from "@/components/dom/ui/SectionHeading";
import { useSectionTrigger } from "./useSectionTrigger";

export default function AboutSection() {
  const ref = useRef<HTMLElement>(null);
  useSectionTrigger("about", ref);

  return (
    <section
      ref={ref}
      id="about"
      aria-labelledby="about-heading"
      className="relative min-h-screen px-6 md:px-12 lg:px-24 py-[var(--space-section-y)]"
    >
      <div className="mx-auto max-w-6xl">
        <div data-reveal>
          <SectionHeading eyebrow="Who we are" id="about-heading">
            The magic behind the scene
          </SectionHeading>
        </div>

        <blockquote
          data-reveal
          className="mt-16 md:mt-24 max-w-4xl font-display text-display-md text-cream/90 italic leading-snug"
        >
          “{site.philosophy}”
        </blockquote>

        <div className="mt-16 md:mt-24 grid gap-10 md:grid-cols-2 md:gap-16">
          <div className="space-y-6">
            {site.about.paragraphs.map((p, i) => (
              <p
                key={i}
                data-reveal
                className="text-[length:var(--text-body-lg)] text-cream-dim leading-relaxed"
              >
                {p}
              </p>
            ))}
          </div>
          <div className="flex flex-col justify-between gap-12">
            <p
              data-reveal
              className="font-display text-display-lg text-gold leading-none"
            >
              {site.about.aside}
            </p>
            <p
              data-reveal
              className="text-[length:var(--text-body-lg)] text-cream/85 leading-relaxed border-l-2 border-gold-dim pl-6"
            >
              {site.vision}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
