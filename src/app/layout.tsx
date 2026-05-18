import type { Metadata } from "next";
import { Sora, Bebas_Neue } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  weight: ["300", "400", "600"],
});

const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  variable: "--font-bebas",
  weight: "400",
});

export const metadata: Metadata = {
  title: "Wavy Studios",
  description: "Studio de Design e Tecnologia",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt" className="dark">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className={`${sora.variable} ${bebasNeue.variable} font-sans`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
