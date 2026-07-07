import type { Metadata } from "next";
import HomePage from "@/components/dom/HomePage";
import { locales } from "@/content";

export const metadata: Metadata = {
  title: locales.hy.meta.title,
  description: locales.hy.meta.description,
  alternates: {
    languages: { hy: "/", en: "/en" },
  },
};

export default function Page() {
  return <HomePage locale="hy" />;
}
