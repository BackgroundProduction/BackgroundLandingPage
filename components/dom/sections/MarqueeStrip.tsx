"use client";

import { useContent } from "@/components/dom/LocaleProvider";
import Marquee from "@/components/dom/ui/Marquee";

/** Infinite event-type ticker used as a section divider. */
export default function MarqueeStrip() {
  const { t } = useContent();
  return <Marquee items={t.marquee} />;
}
