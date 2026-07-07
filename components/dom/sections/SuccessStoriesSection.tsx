"use client";

import { useRef } from "react";
import Image from "next/image";
import { useContent } from "@/components/dom/LocaleProvider";
import { useReveal } from "./useReveal";

export default function SuccessStoriesSection() {
  const ref = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const { t } = useContent();
  useReveal(ref);

  // join each story with its portfolio entry (image/title/meta live there)
  const stories = t.success.items
    .map((item) => ({
      ...item,
      entry: t.portfolio.find((p) => p.slug === item.slug),
    }))
    .filter((s) => s.entry);

  const scrollByCard = (dir: -1 | 1) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>(".work-card");
    track.scrollBy({
      left: dir * ((card?.offsetWidth ?? 480) + 20),
      behavior: "smooth",
    });
  };

  return (
    <section
      ref={ref}
      id="stories"
      aria-labelledby="stories-heading"
      className="py-[var(--space-section-y)]"
    >
      <div className="px-[var(--gutter)]">
        <div className="mx-auto max-w-6xl">
          <p data-reveal className="text-eyebrow text-accent">
            {t.success.eyebrow}
          </p>
          <div className="mt-6 flex flex-wrap items-end justify-between gap-6">
            <h2
              id="stories-heading"
              data-reveal
              className="font-display font-medium text-display-lg max-w-[18ch]"
            >
              {t.success.heading}
              <span className="text-accent">.</span>
            </h2>
            <div data-reveal className="flex gap-2">
              <button
                type="button"
                onClick={() => scrollByCard(-1)}
                aria-label="Previous story"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-line transition-colors hover:border-accent hover:text-accent"
              >
                ←
              </button>
              <button
                type="button"
                onClick={() => scrollByCard(1)}
                aria-label="Next story"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-line transition-colors hover:border-accent hover:text-accent"
              >
                →
              </button>
            </div>
          </div>
        </div>
      </div>

      <div ref={trackRef} data-reveal className="work-track mt-14 px-[var(--gutter)]">
        {stories.map((story, i) => (
          <article
            key={story.slug}
            className="work-card group w-[84vw] shrink-0 sm:w-[58vw] lg:w-[38vw]"
          >
            <div
              className="relative aspect-[16/10] overflow-hidden rounded-sm"
              style={{ border: "1px solid var(--color-line-soft)" }}
            >
              <Image
                src={story.entry!.image.src}
                alt={story.entry!.image.alt}
                fill
                sizes="(max-width: 640px) 84vw, (max-width: 1024px) 58vw, 38vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <span
                className="absolute left-4 top-4 rounded-full px-3 py-1 text-eyebrow"
                style={{
                  background: "rgba(12, 11, 10, 0.65)",
                  color: "var(--color-dark-text)",
                }}
              >
                {String(i + 1).padStart(2, "0")} / {String(stories.length).padStart(2, "0")}
              </span>
            </div>
            <h3 className="font-display text-display-md mt-6 max-w-[22ch] font-medium leading-snug">
              {story.result}
              <span className="text-accent">.</span>
            </h3>
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-text-dim">
              {story.detail}
            </p>
            <p
              className="mt-4 border-t pt-4 text-sm font-medium"
              style={{ borderColor: "var(--color-line-soft)" }}
            >
              {story.entry!.title}
              <span className="text-text-dim">
                {" "}
                — {story.entry!.location}
                {story.entry!.date ? ` · ${story.entry!.date}` : ""}
              </span>
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
