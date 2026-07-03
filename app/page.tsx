"use client";

import dynamic from "next/dynamic";
import Header from "@/components/dom/Header";
import ScrollProgress from "@/components/dom/ui/ScrollProgress";
import HeroSection from "@/components/dom/sections/HeroSection";
import AboutSection from "@/components/dom/sections/AboutSection";
import ServicesSection from "@/components/dom/sections/ServicesSection";
import PortfolioSection from "@/components/dom/sections/PortfolioSection";
import ContactSection from "@/components/dom/sections/ContactSection";

// Scroll system and WebGL canvas both touch window — client-only.
const SmoothScrollProvider = dynamic(
  () => import("@/components/dom/SmoothScrollProvider"),
  { ssr: false }
);
const Stage = dynamic(() => import("@/components/dom/Stage"), { ssr: false });

export default function Home() {
  return (
    <SmoothScrollProvider>
      <a href="#about" className="skip-link">
        Skip to content
      </a>
      <Stage />
      <Header />
      <ScrollProgress />
      <main className="relative z-10">
        <HeroSection />
        <AboutSection />
        <ServicesSection />
        <PortfolioSection />
        <ContactSection />
      </main>
    </SmoothScrollProvider>
  );
}
