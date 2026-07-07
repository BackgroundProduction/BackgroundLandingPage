"use client";

import { useRef } from "react";
import { site } from "@/content/site";
import { useSectionTrigger } from "./useSectionTrigger";

const MARQUEE_ITEMS = [
  "Corporate Events",
  "Concerts",
  "Government Ceremonies",
  "Championships",
  "International Forums",
  "Grand Openings",
  "Dinner Galas",
  "Music & Film Production",
];

export default function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  useSectionTrigger("hero", ref);

  return (
    <section ref={ref} id="top" aria-label="Introduction" className="relative">
      {/* ambient glows */}
      <div
        aria-hidden="true"
        className="glow-amber pointer-events-none absolute -top-40 right-[-15%] h-[46rem] w-[46rem] rounded-full"
      />
      <div
        aria-hidden="true"
        className="glow-warm pointer-events-none absolute bottom-0 left-[-20%] h-[38rem] w-[38rem] rounded-full"
      />

      <div className="flex min-h-screen flex-col justify-between px-[var(--gutter)] pt-32 pb-0">
        <div>
          <div
            data-reveal
            className="flex flex-wrap items-center gap-x-6 gap-y-2 text-eyebrow text-text-dim"
          >
            <span className="text-accent">●</span>
            <span>Event Production</span>
            <span aria-hidden="true">—</span>
            <span>Yerevan, Armenia</span>
            <span aria-hidden="true">—</span>
            <span>Local · CIS · Europe</span>
          </div>

          <h1
            data-reveal
            className="font-display font-medium text-display-xl mt-12 max-w-[13ch]"
          >
            Events people never forget<span className="text-accent">.</span>
          </h1>

          <div className="mt-12 grid gap-10 md:grid-cols-[1fr_auto] md:items-end">
            <p
              data-reveal
              className="max-w-md text-[length:var(--text-body-lg)] leading-relaxed text-text-dim"
            >
              {site.tagline}. From state ceremonies to continental
              championships — produced end to end.
            </p>
            <div data-reveal className="flex items-center gap-4">
              <a
                href={site.contact.emailHref}
                className="rounded-full bg-accent px-7 py-3.5 font-medium text-ink transition-transform hover:scale-[1.03]"
                style={{ color: "var(--color-ink)" }}
              >
                Start a project
              </a>
              <a
                href="#portfolio"
                className="rounded-full border border-line px-7 py-3.5 font-medium text-text transition-colors hover:border-accent hover:text-accent"
              >
                See the work
              </a>
            </div>
          </div>
        </div>

        {/* service marquee — full-bleed ticker along the hero's bottom edge */}
        <div
          aria-hidden="true"
          className="mt-20 -mx-[var(--gutter)] overflow-hidden border-y py-5"
          style={{ borderColor: "var(--color-line-soft)" }}
        >
          <div className="marquee-track">
            {[0, 1].map((copy) => (
              <div key={copy} className="flex shrink-0 items-center">
                {MARQUEE_ITEMS.map((item) => (
                  <span
                    key={`${copy}-${item}`}
                    className="flex items-center gap-8 pr-8 font-display text-2xl md:text-3xl font-medium whitespace-nowrap text-text-dim"
                  >
                    {item}
                    <span className="text-accent text-lg">✦</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
