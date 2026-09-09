"use client";

import dynamic from "next/dynamic";
import { LocaleProvider, useContent } from "@/components/dom/LocaleProvider";
import type { Locale } from "@/content";
// statically imported so the whole page server-renders (SEO, both locales);
// the provider itself only touches window inside useEffect, so SSR is safe
import SmoothScrollProvider from "@/components/dom/SmoothScrollProvider";
import Header from "@/components/dom/Header";
import ScrollProgress from "@/components/dom/ui/ScrollProgress";
import HeroSection from "@/components/dom/sections/HeroSection";
import AboutSection from "@/components/dom/sections/AboutSection";
import PrinciplesSection from "@/components/dom/sections/PrinciplesSection";
// import MarqueeStrip from "@/components/dom/sections/MarqueeStrip";
import SuccessStoriesSection from "@/components/dom/sections/SuccessStoriesSection";
import PortfolioSection from "@/components/dom/sections/PortfolioSection";
import ServicesSection from "@/components/dom/sections/ServicesSection";
import ProcessSection from "@/components/dom/sections/ProcessSection";
import FaqSection from "@/components/dom/sections/FaqSection";
import ContactSection from "@/components/dom/sections/ContactSection";

// The WebGL rig is client-only. It is mounted here, outside every section,
// as a fixed backdrop at a negative z-index: inside the hero section it sat
// in that section's stacking context and painted over the plain text of
// later sections while its stars ride the scroll.
const HeroStage = dynamic(() => import("@/components/dom/sections/HeroStage"), { ssr: false });

function SkipLink() {
  const { t } = useContent();
  return (
    <a href="#about" className="skip-link">
      {t.ui.skipToContent}
    </a>
  );
}

export default function HomePage({ locale }: { locale: Locale }) {
  return (
    <LocaleProvider locale={locale}>
      <SmoothScrollProvider>
        <SkipLink />
        <Header />
        <ScrollProgress />
        <HeroStage />
        {/* main lets pointer events fall through to the rig over the hero;
            every other section opts back in through the wrapper */}
        <main className="pointer-events-none relative isolate">
          <HeroSection />
          <div className="pointer-events-auto">
            <AboutSection />
            <PrinciplesSection />
            {/* <MarqueeStrip /> */}
            <SuccessStoriesSection />
            <PortfolioSection />
            <ServicesSection />
            <ProcessSection />
            <FaqSection />
            <ContactSection />
          </div>
        </main>
      </SmoothScrollProvider>
    </LocaleProvider>
  );
}
