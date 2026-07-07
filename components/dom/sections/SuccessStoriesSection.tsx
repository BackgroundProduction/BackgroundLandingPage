"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { useContent } from "@/components/dom/LocaleProvider";
import { useReveal } from "./useReveal";

export default function SuccessStoriesSection() {
  const ref = useRef<HTMLElement>(null);
  const { t } = useContent();
  useReveal(ref);

  // parallax on every media block: the inner layer is 20% taller than its
  // frame and drifts vertically as the row crosses the viewport
  useGSAP(
    () => {
      if (!ref.current) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      ref.current
        .querySelectorAll<HTMLElement>("[data-parallax]")
        .forEach((layer) => {
          gsap.fromTo(
            layer,
            { yPercent: -9 },
            {
              yPercent: 9,
              ease: "none",
              scrollTrigger: {
                trigger: layer.parentElement,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            }
          );
        });
    },
    { scope: ref }
  );

  // join each story with its portfolio entry (image/title live there)
  const stories = t.success.items
    .map((item) => ({
      ...item,
      entry: t.portfolio.find((p) => p.slug === item.slug),
    }))
    .filter((s) => s.entry);

  return (
    <section
      ref={ref}
      id="stories"
      aria-labelledby="stories-heading"
      className="px-[var(--gutter)] py-[var(--space-section-y)]"
    >
      <div className="mx-auto max-w-12xl">
        <p data-reveal className="text-eyebrow text-accent">
          {t.success.eyebrow}
        </p>
        <h2
          id="stories-heading"
          data-reveal
          className="font-display font-medium text-display-lg mt-6 max-w-[18ch]"
        >
          {t.success.heading}
          <span className="text-accent">.</span>
        </h2>

        <div className="mt-16 flex flex-col">
          {stories.map((story, i) => (
            <article
              key={story.slug}
              data-reveal
              className="grid gap-8 border-t py-12 md:grid-cols-[1.5fr_1fr] md:gap-16 md:py-16"
              style={{ borderColor: "var(--color-line)" }}
            >
              {/* media — video when provided, image otherwise; parallaxed */}
              <div
                className="relative aspect-[16/10] overflow-hidden rounded-sm"
                style={{ border: "1px solid var(--color-line-soft)" }}
              >
                <div data-parallax className="absolute inset-x-0 -top-[10%] h-[120%]">
                  {story.video ? (
                    <video
                      className="h-full w-full object-cover"
                      src={story.video}
                      autoPlay
                      loop
                      muted
                      playsInline
                      preload="metadata"
                    />
                  ) : (
                    <Image
                      src={story.entry!.image.src}
                      alt={story.entry!.image.alt}
                      fill
                      sizes="(max-width: 768px) 100vw, 60vw"
                      className="object-cover"
                    />
                  )}
                </div>
              </div>

              {/* text column */}
              <div className="flex flex-col">
                <p className="text-eyebrow text-text-dim">
                  {String(i + 1).padStart(2, "0")} / {String(stories.length).padStart(2, "0")}
                </p>
                <h3 className="font-display mt-5 text-2xl font-medium leading-snug md:text-3xl">
                  {story.entry!.title}
                </h3>
                <p className="mt-4 max-w-md text-sm leading-relaxed text-text-dim">
                  {story.detail}
                </p>
                <div className="mt-8 md:mt-auto md:pt-8">
                  <span
                    className="inline-block rounded-sm px-3 py-1.5 font-display text-lg font-medium"
                    style={{ background: "var(--color-accent-soft)", color: "var(--color-accent)" }}
                  >
                    {story.badge}
                  </span>
                  <p className="font-display mt-4 max-w-[24ch] text-xl font-medium leading-snug md:text-2xl">
                    {story.result}
                    <span className="text-accent">.</span>
                  </p>
                  <p className="mt-3 text-sm text-text-dim">
                    {story.entry!.location}
                    {story.entry!.date ? ` · ${story.entry!.date}` : ""}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
