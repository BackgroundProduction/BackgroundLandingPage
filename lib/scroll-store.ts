import { create } from "zustand";

export type SectionId = "hero" | "about" | "services" | "portfolio" | "contact";

export const SECTION_ORDER: SectionId[] = [
  "hero",
  "about",
  "services",
  "portfolio",
  "contact",
];

interface ScrollState {
  activeSection: SectionId;
  /** 0–1 progress within the active section */
  sectionProgress: number;
  /** per-section progress map — CameraRig blends between adjacent sections */
  progress: Record<SectionId, number>;
  /** which service card is in focus inside the Services section */
  activeServiceIndex: number;
  setSectionProgress: (section: SectionId, progress: number) => void;
  setActiveServiceIndex: (i: number) => void;
}

/**
 * Bridge between GSAP's imperative ScrollTrigger callbacks and R3F's useFrame.
 * 3D code reads via useScrollStore.getState() inside useFrame (no subscription),
 * so 60fps scroll updates never re-render the React tree.
 */
export const useScrollStore = create<ScrollState>((set) => ({
  activeSection: "hero",
  sectionProgress: 0,
  progress: { hero: 0, about: 0, services: 0, portfolio: 0, contact: 0 },
  activeServiceIndex: 0,
  setSectionProgress: (section, progress) =>
    set((state) => {
      const next = { ...state.progress, [section]: progress };
      // active = last section with progress started but not finished, else deepest started
      let active: SectionId = "hero";
      for (const id of SECTION_ORDER) {
        if (next[id] > 0) active = id;
      }
      return { progress: next, activeSection: active, sectionProgress: next[active] };
    }),
  setActiveServiceIndex: (activeServiceIndex) => set({ activeServiceIndex }),
}));
