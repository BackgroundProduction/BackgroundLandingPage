"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { useContent } from "@/components/dom/LocaleProvider";
import CleanYouTube from "@/components/dom/ui/CleanYouTube";
import { useReveal } from "./useReveal";

export default function PortfolioSection() {
  const ref = useRef<HTMLElement>(null);
  const { t } = useContent();
  useReveal(ref);

  /* Every clip used to autoplay at once. Measured on this page, one playing
     clip runs at ~120fps but any two collapse the section to ~31fps — the GPU
     decodes one stream in hardware and falls back to software for the rest.
     So exactly one plays: the card nearest the centre of the viewport, which
     is the one the reader is looking at. Selection is driven by scroll rather
     than IntersectionObserver, because a fully visible card sliding sideways
     in the carousel never changes its intersection ratio. */
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const vids = Array.from(
      root.querySelectorAll<HTMLVideoElement>("video[data-card-video]")
    );
    if (!vids.length) return;

    let current: HTMLVideoElement | null = null;
    let queued = false;

    /* How much of a card is on screen, 0..1 — the carousel scrolls sideways,
       so horizontal coverage is what decides which card is "the" card. */
    const shown = (v: HTMLVideoElement) => {
      const r = v.getBoundingClientRect();
      if (r.bottom <= 0 || r.top >= window.innerHeight || r.width === 0) return 0;
      const vis = Math.min(r.right, window.innerWidth) - Math.max(r.left, 0);
      return Math.max(0, vis) / r.width;
    };

    const pick = () => {
      queued = false;
      // most-visible card wins; ties go to the leftmost, so the lead card
      // plays when the carousel is at its start rather than the one that
      // happens to sit nearer the middle of the screen
      let best: HTMLVideoElement | null = null;
      let bestScore = 0.6; // must be mostly on screen to take over
      for (const v of vids) {
        const s = shown(v);
        if (s > bestScore + 0.05) {
          bestScore = s;
          best = v;
        }
      }

      // hysteresis: keep the running clip unless it has clearly lost ground,
      // so a small scroll nudge can't stop playback mid-frame
      if (current && best !== current && shown(current) > 0.5) best = current;

      if (best !== current) {
        for (const v of vids) if (v !== best && !v.paused) v.pause();
        current = best;
      }
      if (current?.paused)
        void current.play().catch(() => {
          /* autoplay blocked — the poster stays, which is the fallback */
        });
    };

    const onScroll = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(pick);
    };

    // The browser pauses every video while the tab is hidden and never
    // resumes them. Re-pick on return — directly, not via onScroll, because
    // requestAnimationFrame is suspended in a hidden tab and the queued
    // callback would be dropped.
    const onVisible = () => {
      if (document.hidden) return;
      current = null; // everything was paused behind our back
      pick();
    };

    pick();
    const track = root.querySelector(".work-track");
    track?.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      track?.removeEventListener("scroll", onScroll);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      document.removeEventListener("visibilitychange", onVisible);
      vids.forEach((v) => v.pause());
    };
  }, [t.portfolio]);

  return (
    <section
      ref={ref}
      id="work"
      aria-labelledby="work-heading"
      className="py-[var(--space-section-y)]"
    >
      <div className="px-[var(--gutter)]">
        <div className="mx-auto max-w-6xl">
          <p data-reveal className="text-eyebrow text-accent">
            {t.work.eyebrow}
          </p>
          <div className="mt-6 flex flex-wrap items-end justify-between gap-6">
            <h2
              id="work-heading"
              data-reveal
              className="font-display font-bold uppercase text-display-lg max-w-[18ch]"
            >
              {t.work.heading}
              <span className="text-accent">.</span>
            </h2>
            <p data-reveal className="text-sm text-text-dim">
              {t.ui.dragSideways}
            </p>
          </div>
        </div>
      </div>

      {/* horizontal carousel — full-bleed, snap-scrolls */}
      <div data-reveal className="work-track mt-14 px-[var(--gutter)]">
        {t.portfolio.map((entry, i) => (
          <article
            key={entry.slug}
            className="work-card group w-[78vw] shrink-0 sm:w-[46vw] lg:w-[30vw]"
          >
            <div
              data-clip
              className="relative aspect-[4/3] overflow-hidden rounded-sm"
              style={{ border: "1px solid var(--color-line-soft)" }}
            >
              {/* media priority: YouTube > local clip > still image.
                  A 16:9 iframe needs ~133% width to cover a 4:3 card. */}
              {entry.youtube ? (
                <CleanYouTube
                  id={entry.youtube}
                  coverWidth="133.4%"
                  start={entry.youtubeStart ?? undefined}
                />
              ) : entry.video ? (
                <video
                  data-card-video
                  src={entry.video}
                  poster={entry.image.src}
                  loop
                  muted
                  playsInline
                  preload="metadata"
                  aria-label={entry.image.alt}
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
              ) : (
                <Image
                  src={entry.image.src}
                  alt={entry.image.alt}
                  fill
                  sizes="(max-width: 640px) 78vw, (max-width: 1024px) 46vw, 30vw"
                  // `position` is the focal point: these cards are 4:3, so a
                  // portrait photo loses its top and bottom to the crop
                  style={{ objectPosition: entry.image.position }}
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
              )}
              <span
                className="absolute left-4 top-4 rounded-full px-3 py-1 text-eyebrow"
                style={{
                  background: "rgba(12, 11, 10, 0.65)",
                  color: "var(--color-dark-text)",
                }}
              >
                {entry.category}
              </span>
            </div>
            <div className="mt-4 flex items-baseline gap-4">
              <span className="font-display text-sm text-text-dim">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="font-display text-xl font-medium leading-snug">
                  {entry.title}
                </h3>
                <p className="mt-1 text-sm text-text-dim">
                  {entry.location}
                  {entry.date ? ` · ${entry.date}` : ""}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
