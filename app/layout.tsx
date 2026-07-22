import { grotesk, inter, notoArmenian, serifDisplay } from "@/lib/fonts";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${grotesk.variable} ${inter.variable} ${notoArmenian.variable} ${serifDisplay.variable} h-full antialiased`}
    >
      <body className="min-h-full grain">{children}</body>
    </html>
  );
}
