"use client";

import { useRef } from "react";
import { portfolio } from "@/content/portfolio";
import SectionHeading from "@/components/dom/ui/SectionHeading";
import PortfolioCard from "@/components/dom/ui/PortfolioCard";
import { useSectionTrigger } from "./useSectionTrigger";

export default function PortfolioSection() {
  const ref = useRef<HTMLElement>(null);
  useSectionTrigger("portfolio", ref);

  return (
    <section
      ref={ref}
      id="portfolio"
      aria-labelledby="portfolio-heading"
      className="relative px-6 md:px-12 lg:px-24 py-[var(--space-section-y)]"
    >
      <div className="mx-auto max-w-7xl">
        <div data-reveal>
          <SectionHeading eyebrow="Portfolio" id="portfolio-heading">
            Moments we made unforgettable
          </SectionHeading>
        </div>

        <div className="mt-20 md:mt-32 grid gap-x-8 gap-y-16 md:grid-cols-2 xl:grid-cols-3">
          {portfolio.map((entry) => (
            <div key={entry.slug} data-reveal>
              <PortfolioCard entry={entry} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
