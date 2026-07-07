"use client";

import { useRef } from "react";
import Image from "next/image";
import { portfolio } from "@/content/portfolio";
import { useSectionTrigger } from "./useSectionTrigger";

const ROMAN = [
  "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X",
  "XI", "XII", "XIII", "XIV", "XV", "XVI",
];

export default function PortfolioSection() {
  const ref = useRef<HTMLElement>(null);
  useSectionTrigger("portfolio", ref);

  return (
    <section
      ref={ref}
      id="portfolio"
      aria-labelledby="portfolio-heading"
      className="relative px-[var(--gutter)] py-[var(--space-section-y)]"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-6 md:grid-cols-[auto_1fr] md:gap-24">
          <p data-reveal className="text-eyebrow text-accent">
            03 — Selected work
          </p>
          <h2
            id="portfolio-heading"
            data-reveal
            className="font-display font-medium text-display-lg max-w-[16ch]"
          >
            An index of moments<span className="text-accent">.</span>
          </h2>
        </div>

        <ol
          className="mt-20 list-none border-t"
          style={{ borderColor: "var(--color-line)" }}
        >
          {portfolio.map((entry, i) => (
            <li
              key={entry.slug}
              data-reveal
              className="index-row group relative border-b transition-colors hover:bg-surface"
              style={{ borderColor: "var(--color-line)" }}
            >
              <div className="grid grid-cols-[3.5rem_1fr] items-baseline gap-4 px-2 py-8 md:grid-cols-[5rem_1.6fr_1fr_1fr] md:items-center md:gap-8 md:py-9">
                <span className="font-display text-lg text-text-dim transition-colors group-hover:text-accent">
                  {ROMAN[i]}
                </span>
                <h3 className="font-display text-xl font-medium leading-snug md:text-2xl">
                  {entry.title}
                </h3>
                <p className="col-start-2 text-sm text-text-dim md:col-start-3">
                  {entry.category}
                </p>
                <p className="col-start-2 text-sm text-text-dim md:col-start-4 md:text-right">
                  {entry.location}
                  {entry.date ? ` · ${entry.date}` : ""}
                </p>
              </div>
              {/* hover preview — swaps to real photography when images land */}
              <div
                aria-hidden="true"
                className="row-thumb pointer-events-none absolute right-[8%] top-1/2 z-10 hidden h-40 w-56 -translate-y-1/2 overflow-hidden rounded-sm lg:block"
              >
                <Image
                  src={entry.image.src}
                  alt=""
                  fill
                  sizes="224px"
                  className="object-cover"
                />
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
