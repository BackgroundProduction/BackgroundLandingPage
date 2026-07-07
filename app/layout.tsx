import type { Metadata } from "next";
import { grotesk, inter } from "@/lib/fonts";
import { site } from "@/content/site";
import "./globals.css";

export const metadata: Metadata = {
  title: `${site.name} — Event Production & Management`,
  description: site.description,
  openGraph: {
    title: `${site.name} — Event Production & Management`,
    description: site.description,
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${grotesk.variable} ${inter.variable} h-full antialiased`}>
      <body className="min-h-full grain">{children}</body>
    </html>
  );
}
