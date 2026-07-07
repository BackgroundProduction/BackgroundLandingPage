import type { Metadata } from "next";
import HomePage from "@/components/dom/HomePage";
import { locales } from "@/content";

export const metadata: Metadata = {
  title: locales.en.meta.title,
  description: locales.en.meta.description,
  alternates: {
    languages: { hy: "/", en: "/en" },
  },
};

export default function Page() {
  // wrapping div carries the English lang attribute; the root <html> is hy
  return (
    <div lang="en">
      <HomePage locale="en" />
    </div>
  );
}
