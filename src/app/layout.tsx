import type { Metadata, Viewport } from "next";
import { Chakra_Petch, Oxanium, Silkscreen } from "next/font/google";
import { profile } from "@/data/profile";
import { ThemeScript } from "@/components/ThemeScript";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SmoothScroll } from "@/components/Lazy";
import { SceneRoot } from "@/components/scene/SceneRoot";
import "./globals.css";

// Oxanium: angular, game-UI headlines. Chakra Petch: squared "tech" body text with a
// real italic. Silkscreen: pixel font for short HUD labels only.
const heading = Oxanium({ variable: "--font-heading", subsets: ["latin"] });
const body = Chakra_Petch({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  preload: false,
});
const pixel = Silkscreen({ variable: "--font-px", subsets: ["latin"], weight: ["400", "700"], preload: false });

export const metadata: Metadata = {
  metadataBase: new URL(profile.siteUrl),
  title: { default: profile.seoTitle, template: `%s · ${profile.name}` },
  description: profile.seoDescription,
  authors: [{ name: profile.name, url: profile.siteUrl }],
  creator: profile.name,
  keywords: [profile.name, "Frontend Developer", "React", "Next.js", "TypeScript", "Three.js", "Portfolio", "Pune"],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: profile.name,
    title: profile.seoTitle,
    description: profile.seoDescription,
    locale: "en_IN",
  },
  twitter: { card: "summary_large_image", title: profile.seoTitle, description: profile.seoDescription },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f2ede4" },
    { media: "(prefers-color-scheme: dark)", color: "#0c0b0a" },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${heading.variable} ${body.variable} ${pixel.variable}`}
    >
      <head>
        <ThemeScript />
      </head>
      <body className="min-h-dvh bg-bg text-fg antialiased">
        <SceneRoot />
        <SmoothScroll />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
