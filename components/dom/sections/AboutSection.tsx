"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { useContent } from "@/components/dom/LocaleProvider";
import { useReveal } from "./useReveal";

/* Brand logo split into its 5 strokes (from public/assets/logo.svg,
   viewBox 0 0 29.7 39.7) — animated piece-by-piece as a puzzle. */
const LOGO_PIECES = [
  "M2.3,0c1.4,3,2.7,6.1,4,9.1,1.3,3.1,2.5,6.1,3.7,9.2v.2c0,0,0,.2,0,.2-.6,1.8-1.2,3.5-1.9,5.3-.6,1.8-1.3,3.5-1.9,5.3-1.3,3.5-2.7,7-4.3,10.4,1-3.6,2.1-7.2,3.2-10.7.6-1.8,1.2-3.5,1.8-5.3.6-1.8,1.2-3.5,1.9-5.3v.4c-1.2-3.1-2.3-6.2-3.4-9.4C4.3,6.3,3.3,3.2,2.3,0Z",
  "M.9,4.3c1.9-.3,3.9-.4,5.8-.5,1.9-.1,3.9-.1,5.8-.1,1.9,0,3.9,0,5.8.1,1.9,0,3.9.2,5.8.5-1.9.3-3.9.4-5.8.5-1.9.1-3.9.1-5.8.1-1.9,0-3.9,0-5.8-.1-1.9,0-3.9-.2-5.8-.5Z",
  "M20.3,2.5c-1.1,2.1-2.3,4.2-3.6,6.2-1.2,2-2.6,4-3.9,6-1.3,2-2.7,3.9-4.1,5.8-1.4,1.9-2.9,3.8-4.4,5.6,1.1-2.1,2.3-4.2,3.6-6.2,1.3-2,2.6-4,3.9-6,1.3-2,2.7-3.9,4.1-5.8,1.4-1.9,2.9-3.8,4.4-5.6Z",
  "M3.6,12.3c2.3,2.1,4.5,4.3,6.7,6.5,2.2,2.2,4.3,4.5,6.4,6.8,2.1,2.3,4.2,4.6,6.2,7,2,2.4,4,4.7,5.9,7.2-2.3-2.1-4.5-4.3-6.7-6.5-2.2-2.2-4.3-4.5-6.4-6.8-2.1-2.3-4.2-4.6-6.2-7-2-2.4-4-4.7-5.9-7.2Z",
  "M0,35.5c2.5-.3,5-.4,7.4-.5,2.5-.1,5-.1,7.4-.1,2.5,0,5,0,7.4.1,2.5,0,5,.2,7.4.5-2.5.3-5,.4-7.4.5-2.5.1-5,.1-7.4.1-2.5,0-5,0-7.4-.1-2.5,0-5-.2-7.4-.5Z",
];

/* scatter start per piece (viewBox units) — where each puzzle piece flies in from */
const SCATTER = [
  { x: -16, y: -10, rotation: -50 },
  { x: 12, y: -14, rotation: 35 },
  { x: 18, y: 8, rotation: 45 },
  { x: -14, y: 12, rotation: -35 },
  { x: 10, y: 16, rotation: 25 },
];

export default function AboutSection() {
  const ref = useRef<HTMLElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const { t } = useContent();
  useReveal(ref);

  // puzzle assembly: pieces start scattered/rotated/invisible and converge
  // into the complete mark as the section scrolls toward centre screen
  useGSAP(
    () => {
      if (!svgRef.current || !ref.current) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const pieces = svgRef.current.querySelectorAll("path");
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ref.current,
          // starts once the section is well inside the viewport, not on first peek
          start: "top 45%",
          end: "center 40%",
          scrub: 0.4,
        },
      });
      pieces.forEach((piece, i) => {
        tl.fromTo(
          piece,
          { ...SCATTER[i % SCATTER.length], opacity: 0, transformOrigin: "50% 50%" },
          { x: 0, y: 0, rotation: 0, opacity: 1, ease: "power2.out" },
          i * 0.08
        );
      });

      // stat ledger: cells fade in while the serif numerals rise out of
      // their overflow masks, then count up. SSR renders the final values,
      // so no-JS / reduced-motion stay correct.
      const statCards = ref.current.querySelectorAll<HTMLElement>("[data-stat-card]");
      if (statCards.length) {
        const statsTl = gsap.timeline({
          scrollTrigger: {
            trigger: statCards[0].parentElement,
            start: "top 82%",
            once: true,
          },
        });
        statsTl.fromTo(
          statCards,
          { opacity: 0 },
          { opacity: 1, duration: 0.7, ease: "power2.out", stagger: 0.1 }
        );
        statsTl.fromTo(
          ref.current.querySelectorAll("[data-stat-value]"),
          { yPercent: 112 },
          { yPercent: 0, duration: 0.9, ease: "power3.out", stagger: 0.1 },
          0.1
        );
        ref.current
          .querySelectorAll<HTMLElement>("[data-stat-value]")
          .forEach((el, i) => {
            const final = el.dataset.final ?? "";
            const end = Number(final.replace(/[^\d]/g, ""));
            if (!end) return;
            const suffix = final.trimEnd().endsWith("+") ? "+" : "";
            const grouped = final.includes(",");
            const counter = { n: 0 };
            statsTl.to(
              counter,
              {
                n: end,
                duration: 1.6,
                ease: "power2.out",
                onUpdate: () => {
                  const v = Math.round(counter.n);
                  el.textContent =
                    (grouped ? v.toLocaleString("en-US") : String(v)) + suffix;
                },
              },
              0.25 + i * 0.12
            );
          });
      }
    },
    { scope: ref }
  );

  return (
    <section
      ref={ref}
      id="about"
      aria-labelledby="about-heading"
      className="relative overflow-hidden px-[var(--gutter)] py-[var(--space-section-y)]"
    >
      {/* centred background logo — assembles like a puzzle on scroll */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center"
      >
        <svg
          ref={svgRef}
          viewBox="0 0 29.7 39.7"
          className="h-[72vh] w-auto opacity-[0.07]"
          fill="#fff"
        >
          {LOGO_PIECES.map((d, i) => (
            <path key={i} d={d} />
          ))}
        </svg>
      </div>

      <div className="relative z-10 mx-auto max-w-9xl">
        {/* studio intro — two columns */}
        <div className="grid items-start gap-10 md:grid-cols-2 md:gap-20">
          <div data-reveal>
            <p className="text-eyebrow text-accent">{t.about.eyebrow}</p>
            <h2
              id="about-heading"
              className="font-display font-medium text-display-lg mt-6"
            >
              {t.about.heading}
              <span className="text-accent">.</span>
            </h2>
            {/* photo slot — swap for real team/production photography */}
            <div
              aria-hidden="true"
              className="mt-10 hidden aspect-[4/3] items-end rounded-sm p-6 md:flex"
              style={{
                
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                border: "1px dashed var(--color-line)",
              }}
            >
              <span className="text-eyebrow text-text-dim">
                {t.ui.photoLabel}
              </span>
            </div>
          </div>
          <div className="space-y-6">
            <p
              data-reveal
              className="font-display text-display-md font-medium leading-snug"
            >
              “{t.about.philosophy}”
            </p>
            {t.about.paragraphs.map((p, i) => (
              <p
                key={i}
                data-reveal
                className="text-[length:var(--text-body-lg)] leading-relaxed text-text-dim"
              >
                {p}
              </p>
            ))}
            <p data-reveal className="font-display text-xl font-medium text-accent">
              {t.about.aside}
            </p>
          </div>
        </div>

        {/* key metrics — editorial ledger: hairline rules instead of cards,
            oversized serif numerals that rise out of a mask and count up */}
        <div className="mt-24 border-y border-line">
          <div className="grid lg:grid-cols-4">
            {t.stats.map((stat, i) => (
              <div
                key={stat.label}
                data-stat-card
                className="group border-t border-line py-10 first:border-t-0 lg:border-t-0 lg:border-l lg:px-8 lg:first:border-l-0 lg:first:pl-0 lg:last:pr-0"
              >
                <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-text-dim">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <div className="mt-6 overflow-hidden transition-transform duration-500 group-hover:-translate-y-1.5">
                  <p
                    data-stat-value
                    data-final={stat.value}
                    className="font-serif-display italic leading-none"
                    style={{
                      fontSize: "clamp(3.2rem, 5.2vw, 5.4rem)",
                      padding: "0 0.06em 0.1em 0",
                    }}
                  >
                    {stat.value}
                  </p>
                </div>
                <p className="mt-5 max-w-[26ch] font-mono text-[11px] uppercase tracking-[0.18em] leading-relaxed text-text-dim">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* client logo wall — logos forced monochrome to sit on the dark
            ground, with small mono captions beneath (reference-style) */}
        <div
          data-reveal
          className="mt-16 border-t pt-10"
          style={{ borderColor: "var(--color-line-soft)" }}
        >
          <p className="text-eyebrow text-text-dim">{t.ui.trustedFor}</p>
          <ul className="mt-12 grid grid-cols-2 gap-x-10 gap-y-14 md:grid-cols-4">
            {t.clients.map((client) => (
              <li key={client.name} className="flex flex-col items-center gap-7">
                <div className="relative h-16 w-full md:h-20">
                  <Image
                    src={client.logo}
                    alt={client.name}
                    fill
                    sizes="(min-width: 768px) 22vw, 45vw"
                    className="object-contain opacity-75 transition-opacity duration-300 hover:opacity-100"
                    style={{ filter: "brightness(0) invert(1)" }}
                  />
                </div>
                <span className="text-center font-mono text-[11px] uppercase tracking-[0.22em] text-text-dim">
                  {client.name}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
