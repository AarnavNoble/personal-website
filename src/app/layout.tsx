import type { Metadata } from "next";
import localFont from "next/font/local";
import { Instrument_Serif, Julius_Sans_One, DM_Mono } from "next/font/google";
import "./globals.css";
import { DotCanvas } from "@/components/DotCanvas";
import { CommandPalette } from "@/components/CommandPalette";
import { ScrollReveal } from "@/components/ScrollReveal";

const aspekta = localFont({
  src: "../fonts/Aspekta.woff2",
  variable: "--font-sans",
  weight: "100 900",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const juliusSansOne = Julius_Sans_One({
  variable: "--font-label",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const dmMono = DM_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Aarnav Noble | Computer Engineer",
  description: "Computer engineer building intelligent systems. ML, infrastructure, and everything in between.",
  metadataBase: new URL("https://aarnavnoble.com"),
  openGraph: {
    title: "Aarnav Noble",
    description: "Computer engineer building intelligent systems. ML, full-stack, and everything in between.",
    type: "website",
    siteName: "Aarnav Noble",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aarnav Noble",
    description: "Computer engineer building intelligent systems.",
  },
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${aspekta.variable} ${instrumentSerif.variable} ${juliusSansOne.variable} ${dmMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <DotCanvas />
        <ScrollReveal />
        <CommandPalette />
        {children}
      </body>
    </html>
  );
}
