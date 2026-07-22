import type { Metadata } from "next";
import HomePage from "@/components/dom/HomePage";
import { locales } from "@/content";

export const metadata: Metadata = {
  title: locales.en.meta.title,
  description: locales.en.meta.description,
};

export default function Page() {
  return <HomePage locale="en" />;
}
