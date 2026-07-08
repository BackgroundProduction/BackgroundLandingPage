"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { useContent } from "@/components/dom/LocaleProvider";
import { useReveal } from "./useReveal";

const DIM = "rgba(240, 238, 233, 0.26)";

export default function ServicesSection() {
  const ref = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLOListElement>(null);
  const floatRef = useRef<HTMLDivElement>(null);
  const xTo = useRef<((v: number) => void) | null>(null);
  const yTo = useRef<((v: number) => void) | null>(null);
  const { t } = useContent();
  const [active, setActive] = useState(0);
  const [quote, setQuote] = useState(0);
  useReveal(ref);

  const items = t.services.items;
  const testimonials = t.testimonials;
  const story = testimonials[quote];
  const cycleQuote = (dir: -1 | 1) =>
    setQuote((q) => (q + dir + testimonials.length) % testimonials.length);

  // set up smooth cursor-follow for the floating hover image
  useGSAP(
    () => {
      if (!floatRef.current) return;
      xTo.current = gsap.quickTo(floatRef.current, "x", { duration: 0.5, ease: "power3" });
      yTo.current = gsap.quickTo(floatRef.current, "y", { duration: 0.5, ease: "power3" });
    },
    { scope: ref }
  );

  const enabled = () =>
    typeof window !== "undefined" &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
    !window.matchMedia("(pointer: coarse)").matches;

  const onListMove = (e: React.MouseEvent) => {
    const list = listRef.current;
    if (!list || !enabled()) return;
    const r = list.getBoundingClientRect();
    xTo.current?.(e.clientX - r.left);
    yTo.current?.(e.clientY - r.top);
  };
  const showFloat = () => {
    if (!enabled()) return;
    gsap.to(floatRef.current, { autoAlpha: 1, duration: 0.35, ease: "power3.out" });
  };
  const hideFloat = () => {
    gsap.to(floatRef.current, { autoAlpha: 0, duration: 0.3, ease: "power3.out" });
  };

  return (
    <section
      ref={ref}
      id="services"
      aria-labelledby="services-heading"
      className="theme-dark px-[var(--gutter)] py-[var(--space-section-y)]"
    >
      {/* three columns: testimonial · giant service list · media card */}
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,2fr)_minmax(0,0.85fr)] lg:gap-10">
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

        {/* CENTER — giant stacked service titles */}
        <div className="order-1 lg:order-2">
          <p
            data-reveal
            className="flex items-center gap-3 text-eyebrow text-text-dim"
          >
            <span aria-hidden="true" className="text-accent">
              ●
            </span>
            {t.services.eyebrow}
          </p>

          {/* relative wrapper so the floating image can follow the cursor
              within the titles area, layered above the text */}
          <div className="relative">
            <ol
              ref={listRef}
              data-reveal
              className="mt-8 list-none"
              onMouseMove={onListMove}
              onMouseEnter={showFloat}
              onMouseLeave={hideFloat}
            >
              {items.map((service, i) => (
                <li key={service.slug}>
                  <button
                    type="button"
                    onMouseEnter={() => setActive(i)}
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

            {/* floating hover image — follows the cursor, sits in front of
                the title that's hovered */}
            <div
              ref={floatRef}
              aria-hidden="true"
              className="pointer-events-none absolute left-0 top-0 z-30 hidden lg:block"
              style={{ opacity: 0, visibility: "hidden" }}
            >
              <div className="-translate-x-1/2 -translate-y-1/2">
                <div
                  key={active}
                  className="fade-in relative h-[28vh] w-[22vw] overflow-hidden rounded-sm shadow-2xl"
                  style={{ border: "1px solid var(--color-line-soft)" }}
                >
                  <Image
                    src={items[active].image}
                    alt=""
                    fill
                    sizes="22vw"
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>

          <p
            key={active}
            className="fade-in dim mt-10 max-w-lg text-[length:var(--text-body-lg)] leading-relaxed"
          >
            {items[active].description}
          </p>
        </div>

        {/* RIGHT — media card, swaps to the active service */}
        <div aria-hidden="true" className="order-3 hidden lg:block">
          <div
            key={active}
            className="fade-in relative aspect-[3/4] w-full overflow-hidden rounded-sm"
            style={{ border: "1px solid var(--color-line-soft)" }}
          >
            <Image
              src={items[active].image}
              alt=""
              fill
              sizes="22vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
