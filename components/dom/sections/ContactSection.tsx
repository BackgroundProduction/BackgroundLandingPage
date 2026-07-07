"use client";

import { useRef } from "react";
import { site } from "@/content/site";
import { useSectionTrigger } from "./useSectionTrigger";

export default function ContactSection() {
  const ref = useRef<HTMLElement>(null);
  useSectionTrigger("contact", ref);

  return (
    <section
      ref={ref}
      id="contact"
      aria-labelledby="contact-heading"
      className="relative flex min-h-screen flex-col justify-between px-[var(--gutter)] pt-[var(--space-section-y)] pb-10"
    >
      {/* ambient glow behind the closing statement */}
      <div
        aria-hidden="true"
        className="glow-amber pointer-events-none absolute left-1/2 top-1/3 h-[40rem] w-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full"
      />

      <div className="mx-auto w-full max-w-7xl">
        <p data-reveal className="text-eyebrow text-accent">
          04 — Contact
        </p>
        <h2
          id="contact-heading"
          data-reveal
          className="font-display font-medium text-display-xl mt-10 max-w-[12ch]"
        >
          Let’s raise the curtain<span className="text-accent">.</span>
        </h2>
        <p
          data-reveal
          className="mt-10 max-w-md text-[length:var(--text-body-lg)] leading-relaxed text-text-dim"
        >
          Tell us about your next event — we’ll turn it into something unique,
          distinctive, one of a kind.
        </p>

        <div data-reveal className="mt-14 flex flex-wrap items-center gap-4">
          <a
            href={site.contact.emailHref}
            className="rounded-full bg-accent px-8 py-4 font-medium transition-transform hover:scale-[1.03]"
            style={{ color: "var(--color-ink)" }}
          >
            {site.contact.email}
          </a>
          <a
            href={site.contact.phoneHref}
            className="rounded-full border border-line px-8 py-4 font-medium text-text transition-colors hover:border-accent hover:text-accent"
          >
            {site.contact.phone}
          </a>
          <span className="text-sm text-text-dim">{site.contact.location}</span>
        </div>
      </div>

      <footer
        className="mx-auto mt-28 w-full max-w-7xl border-t pt-8"
        style={{ borderColor: "var(--color-line)" }}
      >
        <div className="flex flex-col items-start justify-between gap-4 text-sm text-text-dim sm:flex-row sm:items-center">
          <p>
            © {new Date().getFullYear()} {site.name}
          </p>
          <ul className="flex gap-6">
            {site.social.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-accent"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </footer>
    </section>
  );
}
