import type { Metadata, Viewport } from "next";
import { Bebas_Neue, DM_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/ui/Navigation";
import CustomCursor from "@/components/ui/CustomCursor";
import SmoothScroll from "@/components/ui/SmoothScroll";

// ─── Fonts ────────────────────────────────────────────────────────────────────

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

// ─── Metadata ─────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  metadataBase: new URL("https://atulparmar.dev"),
  title: "Atul Parmar | Full Stack Developer",
  description:
    "Portfolio of Atul Parmar — Full Stack Developer and AI Engineer at IIIT Guwahati. Building systems that think, interfaces that feel, experiences that last.",
  openGraph: {
    title: "Atul Parmar | Full Stack Developer",
    description:
      "Full Stack Developer & AI Engineer building production-grade applications with React, Next.js, Node.js, and LangChain.",
    url: "https://atulparmar.dev",
    siteName: "Atul Parmar Portfolio",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Atul Parmar — Full Stack Developer",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Atul Parmar | Full Stack Developer",
    description: "Full Stack Developer & AI Engineer at IIIT Guwahati.",
    images: ["/images/og-image.jpg"],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#001D39",
  width: "device-width",
  initialScale: 1,
};

// ─── Root layout ──────────────────────────────────────────────────────────────

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`h-full antialiased ${bebasNeue.variable} ${dmSans.variable} ${jetbrainsMono.variable}`}
    >
      <body
        suppressHydrationWarning
        style={{
          minHeight: "100vh",
          backgroundColor: "#001D39",
          color: "#BDD8E9",
          overflowX: "hidden",
        }}
      >
        <SmoothScroll>
          <CustomCursor />
          <Navigation />
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
