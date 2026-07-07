"use client";

import { useRef } from "react";
import { site } from "@/content/site";
import { useReveal } from "./useReveal";

export default function ContactSection() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);

  return (
    <section
      ref={ref}
      id="contact"
      aria-labelledby="contact-heading"
      className="theme-dark"
    >
      {/* final CTA */}
      <div className="px-[var(--gutter)] py-[var(--space-section-y)] text-center">
        <p data-reveal className="text-eyebrow text-accent">
          Contact
        </p>
        <h2
          id="contact-heading"
          data-reveal
          className="font-display font-medium text-display-xl mx-auto mt-8 max-w-[16ch]"
        >
          Ready to raise the curtain<span className="text-accent">?</span>
        </h2>
        <p data-reveal className="dim mx-auto mt-8 max-w-md text-[length:var(--text-body-lg)] leading-relaxed">
          Tell us the occasion, the date and the ambition — we take it from
          there.
        </p>
        <div data-reveal className="mt-12 flex flex-wrap items-center justify-center gap-4">
          <a
            href={site.contact.emailHref}
            className="rounded-full px-8 py-4 font-medium transition-transform hover:scale-[1.03]"
            style={{ background: "var(--color-accent)", color: "#fff" }}
          >
            {site.contact.email}
          </a>
          <a
            href={site.contact.phoneHref}
            className="rounded-full border px-8 py-4 font-medium transition-colors hover:text-accent"
            style={{ borderColor: "rgba(240, 238, 233, 0.25)" }}
          >
            {site.contact.phone}
          </a>
        </div>
      </div>

      {/* footer */}
      <footer
        className="px-[var(--gutter)] pb-10 pt-14"
        style={{ borderTop: "1px solid rgba(240, 238, 233, 0.12)" }}
      >
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-4">
          <div>
            <p className="font-display text-lg font-medium">
              Background<span className="text-accent">.</span>
            </p>
            <p className="dim mt-3 text-sm leading-relaxed">
              Full-service event production — physical, hybrid and virtual.
            </p>
          </div>
          <nav aria-label="Footer navigation">
            <p className="text-eyebrow dim">Menu</p>
            <ul className="mt-4 space-y-2 text-sm">
              {site.nav.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="transition-colors hover:text-accent">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div>
            <p className="text-eyebrow dim">Studio</p>
            <ul className="mt-4 space-y-2 text-sm">
              <li>{site.contact.location}</li>
              <li>
                <a
                  href={site.contact.emailHref}
                  className="transition-colors hover:text-accent"
                >
                  {site.contact.email}
                </a>
              </li>
              <li>
                <a
                  href={site.contact.phoneHref}
                  className="transition-colors hover:text-accent"
                >
                  {site.contact.phone}
                </a>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-eyebrow dim">Follow</p>
            <ul className="mt-4 space-y-2 text-sm">
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
        </div>
        <p className="dim mx-auto mt-14 max-w-6xl text-xs">
          © {new Date().getFullYear()} {site.name}
        </p>
      </footer>
    </section>
  );
}
