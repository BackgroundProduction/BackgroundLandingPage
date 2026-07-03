"use client";

import { useRef } from "react";
import { site } from "@/content/site";
import { useSectionTrigger } from "./useSectionTrigger";

export default function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  useSectionTrigger("hero", ref);

  return (
    <section
      ref={ref}
      id="top"
      aria-label="Introduction"
      className="relative min-h-[160vh]"
    >
      <div className="sticky top-0 flex h-screen flex-col items-center justify-center px-6 text-center">
        <p data-reveal className="text-eyebrow text-gold mb-8 font-medium">
          Event Production · Yerevan, Armenia
        </p>
        <h1
          data-reveal
          className="font-display font-semibold text-display-xl text-cream max-w-6xl"
        >
          We are{" "}
          <em className="not-italic text-gold-bright">Professional</em>{" "}
          <em className="not-italic">Creative</em>{" "}
          <em className="not-italic text-gold-bright">Innovative</em>{" "}
          <em className="not-italic">Experienced</em>
        </h1>
        <p
          data-reveal
          className="mt-10 max-w-2xl text-[length:var(--text-body-lg)] text-cream-dim leading-relaxed"
        >
          {site.description}
        </p>
        <div
          data-reveal
          aria-hidden="true"
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 text-cream-dim"
        >
          <span className="text-eyebrow">Scroll</span>
          <span className="block h-12 w-px bg-gradient-to-b from-gold to-transparent" />
        </div>
      </div>
    </section>
  );
}
