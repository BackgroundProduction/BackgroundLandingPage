"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "@/lib/gsap";
import { useContent } from "@/components/dom/LocaleProvider";
import { useReveal } from "./useReveal";

const DIM = "rgba(240, 238, 233, 0.26)";

export default function ServicesSection() {
  const ref = useRef<HTMLElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);
  const floatRef = useRef<HTMLDivElement>(null);
  const { t } = useContent();
  const [active, setActive] = useState(0);
  const [quote, setQuote] = useState(0);
  useReveal(ref);

  const items = t.services.items;
  const testimonials = t.testimonials;
  const story = testimonials[quote];
  const cycleQuote = (dir: -1 | 1) =>
    setQuote((q) => (q + dir + testimonials.length) % testimonials.length);

  const enabled = () =>
    typeof window !== "undefined" &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
    !window.matchMedia("(pointer: coarse)").matches;

  // image stays anchored on the right; only its vertical position slides to
  // sit in front of the hovered title
  const onEnter = (i: number, e: React.MouseEvent) => {
    setActive(i);
    const main = mainRef.current;
    const img = floatRef.current;
    if (!main || !img || !enabled()) return;
    const liRect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const mainRect = main.getBoundingClientRect();
    const targetCenter = liRect.top - mainRect.top + liRect.height / 2;
    gsap.to(img, {
      y: targetCenter - img.offsetHeight / 2,
      autoAlpha: 1,
      duration: 0.5,
      ease: "power3.out",
    });
  };
  const onLeave = () => {
    if (floatRef.current)
      gsap.to(floatRef.current, { autoAlpha: 0, duration: 0.3, ease: "power3.out" });
  };

  return (
    <section
      ref={ref}
      id="services"
      aria-labelledby="services-heading"
      className="theme-dark px-[var(--gutter)] py-[var(--space-section-y)]"
    >
      <div className="mx-auto grid max-w-12xl gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,2.7fr)] lg:gap-12">
        {/* LEFT — rotating client testimonial */}
        <div data-reveal className="order-2 lg:order-1">
          <div
            className="flex items-center justify-between border-t pt-3"
            style={{ borderColor: "rgba(240, 238, 233, 0.25)" }}
          >
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => cycleQuote(-1)}
                aria-label="Previous testimonial"
                className="text-lg transition-colors hover:text-accent"
              >
                ←
              </button>
              <button
                type="button"
                onClick={() => cycleQuote(1)}
                aria-label="Next testimonial"
                className="text-lg transition-colors hover:text-accent"
              >
                →
              </button>
            </div>
            <p className="dim font-mono text-xs tracking-widest">
              {String(quote + 1).padStart(2, "0")}/
              {String(testimonials.length).padStart(2, "0")}
            </p>
          </div>

          <p className="dim mt-6 font-mono text-xs tracking-widest">
            ({t.ui.clientStories})
          </p>

          <blockquote key={quote} className="fade-in mt-5">
            <p className="text-[0.95rem] leading-relaxed">“{story.quote}”</p>
            <footer className="mt-6 flex items-center gap-3">
              <span
                aria-hidden="true"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-medium"
                style={{
                  background: "var(--color-accent-soft)",
                  color: "var(--color-accent)",
                }}
              >
                {story.author.slice(0, 2)}
              </span>
              <span className="text-sm leading-tight">
                <span className="block font-medium">{story.author}</span>
                <span className="dim block">{story.role}</span>
              </span>
            </footer>
          </blockquote>
        </div>

        {/* RIGHT — eyebrow, giant titles, and the right-anchored hover image */}
        <div ref={mainRef} className="relative order-1 lg:order-2">
          <p
            data-reveal
            className="flex items-center gap-3 text-eyebrow text-text-dim"
          >
            <span aria-hidden="true" className="text-accent">
              ●
            </span>
            {t.services.eyebrow}
          </p>

          <ol
            data-reveal
            className="mt-8 list-none lg:max-w-[62%]"
            onMouseLeave={onLeave}
          >
            {items.map((service, i) => (
              <li key={service.slug}>
                <button
                  type="button"
                  onMouseEnter={(e) => onEnter(i, e)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                  aria-pressed={i === active}
                  className="font-display block w-full text-left font-medium leading-[1.05] transition-colors duration-300"
                  style={{
                    fontSize: "clamp(2.25rem, 5.5vw, 5.5rem)",
                    letterSpacing: "-0.03em",
                    color: i === active ? "var(--color-dark-text)" : DIM,
                  }}
                >
                  {i === 0 && (
                    <span className="sr-only" id="services-heading">
                      {t.services.heading}.{" "}
                    </span>
                  )}
                  {service.title}
                </button>
              </li>
            ))}
          </ol>

          {/* right-anchored image — slides vertically to the hovered title */}
          <div
            ref={floatRef}
            aria-hidden="true"
            className="pointer-events-none absolute right-0 top-0 z-20 hidden w-[26%] lg:block"
            style={{ opacity: 0, visibility: "hidden" }}
          >
            <div
              key={active}
              className="fade-in relative aspect-[3/4] w-full overflow-hidden rounded-sm shadow-2xl"
              style={{ border: "1px solid var(--color-line-soft)" }}
            >
              <Image
                src={items[active].image}
                alt=""
                fill
                sizes="26vw"
                className="object-cover"
              />
            </div>
          </div>

          {/* reviewer note: per-service description removed to keep the
              section visual — the data stays in content for future use */}
        </div>
      </div>
    </section>
  );
}
