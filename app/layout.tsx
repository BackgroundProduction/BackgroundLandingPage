import { grotesk, inter, notoArmenian } from "@/lib/fonts";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="hy"
      className={`${grotesk.variable} ${inter.variable} ${notoArmenian.variable} h-full antialiased`}
    >
      <body className="min-h-full grain">{children}</body>
    </html>
  );
}
