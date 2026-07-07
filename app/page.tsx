"use client";

import dynamic from "next/dynamic";
import Header from "@/components/dom/Header";
import ScrollProgress from "@/components/dom/ui/ScrollProgress";
import HeroSection from "@/components/dom/sections/HeroSection";
import AboutSection from "@/components/dom/sections/AboutSection";
import PrinciplesSection from "@/components/dom/sections/PrinciplesSection";
import PortfolioSection from "@/components/dom/sections/PortfolioSection";
import ServicesSection from "@/components/dom/sections/ServicesSection";
import ProcessSection from "@/components/dom/sections/ProcessSection";
import FaqSection from "@/components/dom/sections/FaqSection";
import ContactSection from "@/components/dom/sections/ContactSection";

// Scroll system touches window — client-only.
const SmoothScrollProvider = dynamic(
  () => import("@/components/dom/SmoothScrollProvider"),
  { ssr: false }
);

export default function Home() {
  return (
    <SmoothScrollProvider>
      <a href="#about" className="skip-link">
        Skip to content
      </a>
      <Header />
      <ScrollProgress />
      <main className="relative">
        <HeroSection />
        <AboutSection />
        <PrinciplesSection />
        <PortfolioSection />
        <ServicesSection />
        <ProcessSection />
        <FaqSection />
        <ContactSection />
      </main>
    </SmoothScrollProvider>
  );
}
