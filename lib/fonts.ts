import { Space_Grotesk, Inter, Noto_Sans_Armenian } from "next/font/google";

export const grotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-grotesk",
  weight: "variable",
  display: "swap",
});

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

/* Space Grotesk and Inter have no Armenian glyphs — Noto Sans Armenian sits
   after them in the font stacks so Armenian text renders consistently. */
export const notoArmenian = Noto_Sans_Armenian({
  subsets: ["armenian"],
  variable: "--font-armenian",
  weight: "variable",
  display: "swap",
});
