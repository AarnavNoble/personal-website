import type { Metadata } from "next";
import { Syne, DM_Sans, Geist_Mono } from "next/font/google";
import "./globals.css";
import { DotCanvas } from "@/components/DotCanvas";
import { CommandPalette } from "@/components/CommandPalette";
import { ScrollReveal } from "@/components/ScrollReveal";

const syne = Syne({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const dmSans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
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
      className={`${syne.variable} ${dmSans.variable} ${geistMono.variable} h-full antialiased`}
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
