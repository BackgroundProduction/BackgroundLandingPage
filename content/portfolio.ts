export type PortfolioCategory =
  | "Sports Championship"
  | "Business Conference"
  | "Music Awards"
  | "Awards Ceremony"
  | "Government Ceremony"
  | "Music Concert"
  | "Music Competition"
  | "Memorial Concert"
  | "Opening Event"
  | "Corporate Event";

export interface PortfolioEntry {
  slug: string;
  title: string;
  category: PortfolioCategory;
  location: string;
  date?: string;
  description?: string;
  image: {
    src: string;
    alt: string;
    /** true while placeholder art is in use — query this to find images still needing real photography */
    isPlaceholder: boolean;
  };
}

export const portfolio: PortfolioEntry[] = [
  {
    slug: "european-shooting-championship-2026",
    title: "European Shooting Championship",
    category: "Sports Championship",
    location: "Yerevan, Armenia",
    date: "2026",
    image: {
      src: "/images/portfolio/placeholder-sports.svg",
      alt: "European Shooting Championship, Yerevan 2026",
      isPlaceholder: true,
    },
  },
  {
    slug: "asian-regional-forum-2025",
    title: "Asian Regional Forum on Investment Management of Foreign Exchange Reserves",
    category: "Business Conference",
    location: "Dilijan, Armenia",
    date: "October 8–10, 2025",
    image: {
      src: "/images/portfolio/placeholder-conference.svg",
      alt: "Asian Regional Forum 2025 in Dilijan",
      isPlaceholder: true,
    },
  },
  {
    slug: "european-karate-championships-60",
    title: "60th European Karate Senior Championships",
    category: "Sports Championship",
    location: "Yerevan, Armenia",
    date: "2025",
    image: {
      src: "/images/portfolio/placeholder-sports.svg",
      alt: "60th European Karate Senior Championships in Yerevan",
      isPlaceholder: true,
    },
  },
  {
    slug: "khazer-music-awards-2025",
    title: "“Khazer” Armenian Music Awards",
    category: "Music Awards",
    location: "Yerevan, Armenia",
    date: "2025",
    image: {
      src: "/images/portfolio/placeholder-awards.svg",
      alt: "Khazer Armenian Music Awards 2025 ceremony",
      isPlaceholder: true,
    },
  },
  {
    slug: "ebrd-2024-annual-meeting",
    title: "EBRD Annual Meeting and Business Forum",
    category: "Business Conference",
    location: "Yerevan, Armenia",
    date: "2024",
    image: {
      src: "/images/portfolio/placeholder-conference.svg",
      alt: "EBRD 2024 Annual Meeting and Business Forum",
      isPlaceholder: true,
    },
  },
  {
    slug: "hero-of-our-times-2023",
    title: "“The Hero of Our Times” Awards",
    category: "Awards Ceremony",
    location: "Yerevan, Armenia",
    date: "2023",
    image: {
      src: "/images/portfolio/placeholder-awards.svg",
      alt: "The Hero of Our Times awards ceremony 2023",
      isPlaceholder: true,
    },
  },
  {
    slug: "yerevan-mayor-inauguration",
    title: "Official Inauguration Ceremony of the Mayor of Yerevan",
    category: "Government Ceremony",
    location: "Yerevan, Armenia",
    image: {
      src: "/images/portfolio/placeholder-ceremony.svg",
      alt: "Official inauguration ceremony of the new mayor of Yerevan",
      isPlaceholder: true,
    },
  },
  {
    slug: "international-jazz-day-concert",
    title: "Jazz Concert for International Jazz Day",
    category: "Music Concert",
    location: "Yerevan, Armenia",
    image: {
      src: "/images/portfolio/placeholder-concert.svg",
      alt: "Jazz concert dedicated to International Jazz Day",
      isPlaceholder: true,
    },
  },
  {
    slug: "european-weightlifting-championships",
    title: "European Weightlifting Championships",
    category: "Sports Championship",
    location: "Yerevan, Armenia",
    description: "Opening ceremony, competition days and the Federation Congress.",
    image: {
      src: "/images/portfolio/placeholder-sports.svg",
      alt: "European Weightlifting Championships opening ceremony",
      isPlaceholder: true,
    },
  },
  {
    slug: "junior-eurovision-20th",
    title: "20th Anniversary of “Junior Eurovision” Song Contest",
    category: "Music Competition",
    location: "Yerevan, Armenia",
    image: {
      src: "/images/portfolio/placeholder-concert.svg",
      alt: "20th anniversary of Junior Eurovision song contest",
      isPlaceholder: true,
    },
  },
  {
    slug: "arthur-grigoryan-memorial-concert",
    title: "Concert in Memory of Arthur Grigoryan",
    category: "Memorial Concert",
    location: "Yerevan, Armenia",
    image: {
      src: "/images/portfolio/placeholder-concert.svg",
      alt: "Memorial concert dedicated to Arthur Grigoryan",
      isPlaceholder: true,
    },
  },
  {
    slug: "altezza-opening-ceremony",
    title: "Altezza Opening Ceremony",
    category: "Opening Event",
    location: "Yerevan, Armenia",
    image: {
      src: "/images/portfolio/placeholder-ceremony.svg",
      alt: "Altezza opening ceremony",
      isPlaceholder: true,
    },
  },
  {
    slug: "gyumri-beer-factory-pavilion",
    title: "Gyumri Beer Factory Pavilion",
    category: "Corporate Event",
    location: "Gyumri, Armenia",
    image: {
      src: "/images/portfolio/placeholder-corporate.svg",
      alt: "Setup of Gyumri beer factory pavilion",
      isPlaceholder: true,
    },
  },
];
