"use client";

import { useRef } from "react";
import { site } from "@/content/site";
import SectionHeading from "@/components/dom/ui/SectionHeading";
import { useSectionTrigger } from "./useSectionTrigger";

export default function ContactSection() {
  const ref = useRef<HTMLElement>(null);
  useSectionTrigger("contact", ref);

  return (
    <section
      ref={ref}
      id="contact"
      aria-labelledby="contact-heading"
      className="relative flex min-h-screen flex-col justify-center px-6 md:px-12 lg:px-24 py-[var(--space-section-y)]"
    >
      <div className="mx-auto w-full max-w-6xl text-center">
        <div data-reveal>
          <SectionHeading eyebrow="Contact" id="contact-heading" size="xl" className="mx-auto">
            Let’s raise the curtain
          </SectionHeading>
        </div>

        <p
          data-reveal
          className="mx-auto mt-10 max-w-xl text-[length:var(--text-body-lg)] text-cream-dim leading-relaxed"
        >
          Tell us about your next event — we’ll turn it into something
          unique, distinctive, one of a kind.
        </p>

        <div
          data-reveal
          className="mt-14 flex flex-col items-center gap-6 sm:flex-row sm:justify-center"
        >
          <a
            href={site.contact.emailHref}
            className="rounded-sm bg-gold px-8 py-4 font-medium text-ink transition-colors hover:bg-gold-bright"
            style={{ color: "var(--color-ink)" }}
          >
            {site.contact.email}
          </a>
          <a
            href={site.contact.phoneHref}
            className="rounded-sm border border-gold-dim px-8 py-4 font-medium text-cream transition-colors hover:border-gold hover:text-gold-bright"
          >
            {site.contact.phone}
          </a>
        </div>

        <p data-reveal className="mt-10 text-sm text-cream-dim">
          {site.contact.location}
        </p>
      </div>

      <footer className="mx-auto mt-24 w-full max-w-6xl border-t border-cream/10 pt-8">
        <div className="flex flex-col items-center justify-between gap-4 text-sm text-cream-dim sm:flex-row">
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
                  className="transition-colors hover:text-gold-bright"
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
