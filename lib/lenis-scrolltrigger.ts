import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/**
 * Single-RAF scroll system: the GSAP ticker is the only clock.
 * Lenis has autoRaf disabled and is driven exclusively from gsap.ticker —
 * this must remain the ONE lenis.raf() call site in the codebase, otherwise
 * scroll speed compounds (the classic double-RAF bug).
 */
export function createSmoothScroll(): { lenis: Lenis; destroy: () => void } {
  const lenis = new Lenis({
    autoRaf: false,
    duration: 0.9,
    smoothWheel: true,
    // keep native touch scrolling — Lenis synthetic touch fights iOS overscroll
    syncTouch: false,
  });

  lenis.on("scroll", ScrollTrigger.update);

  const tick = (time: number) => {
    lenis.raf(time * 1000);
  };
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);

  ScrollTrigger.scrollerProxy(document.body, {
    scrollTop(value) {
      if (arguments.length && value != null) {
        lenis.scrollTo(value, { immediate: true });
      }
      return lenis.animatedScroll ?? window.scrollY;
    },
    getBoundingClientRect() {
      return {
        top: 0,
        left: 0,
        width: window.innerWidth,
        height: window.innerHeight,
      };
    },
    pinType: document.body.style.transform ? "transform" : "fixed",
  });

  const onRefresh = () => lenis.resize();
  ScrollTrigger.addEventListener("refresh", onRefresh);

  const resizeObserver = new ResizeObserver(() => {
    lenis.resize();
    ScrollTrigger.refresh();
  });
  resizeObserver.observe(document.body);

  ScrollTrigger.refresh();

  return {
    lenis,
    destroy() {
      resizeObserver.disconnect();
      ScrollTrigger.removeEventListener("refresh", onRefresh);
      gsap.ticker.remove(tick);
      lenis.destroy();
    },
  };
}
