"use client";

import { useRef } from "react";
import { site } from "@/content/site";
import { useReveal } from "./useReveal";

export default function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref, true);

  return (
    <section
      ref={ref}
      id="top"
      aria-label="Introduction"
      className="flex min-h-[92vh] flex-col items-center justify-center px-[var(--gutter)] pt-32 pb-16 text-center"
    >
      <p data-reveal className="text-eyebrow text-text-dim">
        Event production — Yerevan, Armenia
      </p>
      <h1
        data-reveal
        className="font-display font-medium text-display-xl mx-auto mt-10 max-w-[18ch]"
      >
        We produce events that move people — and make brands unforgettable
        <span className="text-accent">.</span>
      </h1>
      <p
        data-reveal
        className="mx-auto mt-10 max-w-xl text-[length:var(--text-body-lg)] leading-relaxed text-text-dim"
      >
        For institutions and brands whose occasions deserve more than an
        agenda — from state ceremonies to continental championships, produced
        end to end.
      </p>
      <div data-reveal className="mt-12 flex flex-wrap items-center justify-center gap-4">
        <a
          href={site.contact.emailHref}
          className="rounded-full px-8 py-4 font-medium text-white transition-transform hover:scale-[1.03]"
          style={{ background: "var(--color-ink)" }}
        >
          Start a project
        </a>
        <a
          href="#work"
          className="rounded-full border border-line px-8 py-4 font-medium transition-colors hover:border-accent hover:text-accent"
        >
          See the work
        </a>
      </div>
    </section>
  );
}
