import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { DotCanvas } from "@/components/DotCanvas";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Aarnav Noble — Software Engineer",
  description: "Software engineer building intelligent systems. ML, full-stack, and everything in between.",
  metadataBase: new URL("https://aarnavnoble.com"),
  openGraph: {
    title: "Aarnav Noble",
    description: "Software engineer building intelligent systems. ML, full-stack, and everything in between.",
    type: "website",
    siteName: "Aarnav Noble",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aarnav Noble",
    description: "Software engineer building intelligent systems.",
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <DotCanvas />
        {children}
      </body>
    </html>
  );
}
