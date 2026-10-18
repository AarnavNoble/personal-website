import type { Metadata } from "next";
import { Mona_Sans, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./site.css";
import { CommandPalette } from "@/components/CommandPalette";
import { SiteNav, SiteFooter } from "@/components/dither/SiteChrome";

const mona = Mona_Sans({ subsets: ["latin"], variable: "--font-mona", display: "swap" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-gmono", display: "swap" });

export const metadata: Metadata = {
  title: "Aarnav Noble | Computer Engineer",
  description: "Computer engineer at Waterloo building inference servers, agent observability and the infrastructure under them.",
  metadataBase: new URL("https://aarnavnoble.com"),
  openGraph: {
    title: "Aarnav Noble",
    description: "Computer engineer at Waterloo building inference servers, agent observability and the infrastructure under them.",
    type: "website",
    siteName: "Aarnav Noble",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aarnav Noble",
    description: "Computer engineer building inference and infrastructure.",
  },
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${mona.variable} ${mono.variable}`}>
      <body className="dr">
        <CommandPalette />
        <SiteNav />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
