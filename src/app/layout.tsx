import type { Metadata, Viewport } from "next";
import { Syne, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/providers/Providers";
import { siteUrl } from "@/lib/site";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Dhruv Singh — AI Engineer",
    template: "%s · Dhruv Singh",
  },
  description:
    "AI Engineer building production-ready AI systems and scalable full-stack applications. B.Tech AI & ML, Infosys Springboard intern. GenAI, Computer Vision, and systems that scale.",
  keywords: [
    "Dhruv Singh",
    "AI Engineer",
    "Machine Learning Engineer",
    "Deep Learning",
    "Computer Vision",
    "YOLOv8",
    "Generative AI",
    "Full Stack Developer",
    "Next.js",
    "FastAPI",
  ],
  authors: [{ name: "Dhruv Singh" }],
  creator: "Dhruv Singh",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Dhruv Singh",
    title: "Dhruv Singh — AI Engineer",
    description:
      "AI Engineer building production-ready AI systems and scalable full-stack applications.",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Dhruv Singh — AI Engineer" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dhruv Singh — AI Engineer",
    description:
      "AI Engineer building production-ready AI systems and scalable full-stack applications.",
    images: ["/og.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport: Viewport = {
      themeColor: "#050505",
  width: "device-width",
  initialScale: 1,
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${syne.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} noise antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
