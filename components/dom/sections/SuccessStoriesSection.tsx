"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { useContent } from "@/components/dom/LocaleProvider";
import CleanYouTube from "@/components/dom/ui/CleanYouTube";
import { useReveal } from "./useReveal";

/* Section-heading size used below the desktop breakpoint, where the title
   wraps instead of being scaled to a single line. */
const HEADING_CLAMP = "clamp(3rem, 13.5vw, 15rem)";

/* One gradient per success story, applied to its title in order.
   Swap these hex stops for the brand colours you want per title —
   any number of stops works, they're spread evenly left to right. */
const TITLE_GRADIENTS: string[][] = [
  ["#F6D365", "#F5A623", "#E8615A"], // gold → amber → rose
  ["#A8EDEA", "#5BC0EB", "#4A7DE8"], // ice → cyan → blue
  ["#A78BFA", "#D946EF", "#F472B6"], // violet → magenta → pink
  ["#BEF264", "#34D399", "#0EA5A4"], // lime → emerald → teal
  ["#FFD3A5", "#FD9A6E", "#E0475B"], // peach → coral → crimson
  ["#F0EEE9", "#C7CCD4", "#8E97A3"], // warm white → platinum → steel
];

export default function SuccessStoriesSection() {
  const ref = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const { t } = useContent();
  useReveal(ref);

  /* The heading is a single full-bleed line, but Armenian and English differ
     wildly in length — any fixed vw size either overflows one locale or leaves
     the other tiny. Measure the text and scale it to exactly fill the column. */
  useEffect(() => {
    const el = headingRef.current;
    if (!el) return;
    const REF = 100;
    const fit = () => {
      // below the desktop breakpoint a 40-character title on one line would be
      // unreadably small — let it wrap at the CSS clamp size instead
      if (window.innerWidth < 768) {
        el.style.whiteSpace = "normal";
        // the clamp lives in an inline style prop, so clearing it would fall
        // back to 16px rather than the CSS value — restore it explicitly
        el.style.fontSize = HEADING_CLAMP;
        return;
      }
      el.style.whiteSpace = "nowrap";
      const avail = el.parentElement?.clientWidth ?? 0;
      if (!avail) return;
      el.style.fontSize = `${REF}px`;
      const textWidth = el.scrollWidth;
      if (!textWidth) return;
      el.style.fontSize = `${Math.min(160, (avail / textWidth) * REF)}px`;
    };
    fit();
    window.addEventListener("resize", fit);
    // web fonts land after first paint and change the measurement
    document.fonts?.ready.then(fit).catch(() => {});
    return () => window.removeEventListener("resize", fit);
  }, [t.success.heading]);

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
        {/* full-bleed one-liner — same treatment as the process "journey"
            title; the effect above scales it to exactly fill the column */}
        <h2
          ref={headingRef}
          id="stories-heading"
          data-reveal
          className="font-display mt-6 whitespace-nowrap font-bold uppercase leading-[0.9]"
          style={{ fontSize: HEADING_CLAMP, letterSpacing: "-0.03em" }}
        >
          {t.success.heading}
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
                  {story.youtube ? (
                    // parallax layer is 120% tall, so the 16:9 iframe needs
                    // ~134% width to keep covering the frame
                    <CleanYouTube
                      id={story.youtube}
                      coverWidth="134%"
                      start={story.youtubeStart ?? undefined}
                    />
                  ) : story.video ? (
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
                <h3
                  className="font-display mt-5 font-bold leading-[1.05] uppercase"
                  style={{
                    // caps at the requested 6rem on desktop; scales down on
                    // narrow screens so long titles can't overflow the column
                    fontSize: "clamp(2.25rem, 7vw, 6rem)",
                    backgroundImage: `linear-gradient(100deg, ${(
                      TITLE_GRADIENTS[i % TITLE_GRADIENTS.length]
                    ).join(", ")})`,
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    color: "transparent",
                    WebkitTextFillColor: "transparent",
                  }}
                >
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
