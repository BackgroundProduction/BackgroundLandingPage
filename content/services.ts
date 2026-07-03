export type ServiceMotif = "film-reel" | "instrument" | "conference" | "ceremony";

export interface ServiceEntry {
  slug: string;
  title: string;
  description: string;
  motif: ServiceMotif;
}

export const services: ServiceEntry[] = [
  {
    slug: "music-film-production",
    title: "Music & Film Production",
    description:
      "Professional music and movie producing — from concept and score to final cut, crafted with cinematic precision.",
    motif: "film-reel",
  },
  {
    slug: "concerts-grand-openings",
    title: "Concerts & Grand Openings",
    description:
      "Concerts, grand openings and anniversaries staged as unforgettable spectacles — lighting, sound and emotion in perfect sync.",
    motif: "instrument",
  },
  {
    slug: "conferences-forums",
    title: "Conferences & Forums",
    description:
      "Corporate events, dinner galas, conferences and international forums — physical, hybrid and virtual — executed flawlessly end to end.",
    motif: "conference",
  },
  {
    slug: "government-private-events",
    title: "Government & Private Events",
    description:
      "State ceremonies, official inaugurations and private celebrations handled with discretion, protocol and grandeur.",
    motif: "ceremony",
  },
];
