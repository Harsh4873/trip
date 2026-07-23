import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#1c5138" },
    { media: "(prefers-color-scheme: dark)", color: "#12321f" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL("https://harsh.bet"),
  title: "New Mexico Road Trip · Aug 8–15, 2026",
  description:
    "Day-by-day schedule, a vegetarian food and attraction lookup, and shared checklists for the Aug 8–15, 2026 drive through Taos, Santa Fe, Albuquerque, and Palo Duro.",
  alternates: {
    canonical: "/trip/",
  },
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
      noarchive: true,
      nosnippet: true,
    },
  },
  openGraph: {
    title: "New Mexico Road Trip · 2026",
    description: "Eight days across Taos, Santa Fe, Albuquerque, and Palo Duro.",
    url: "https://harsh.bet/trip/",
    siteName: "New Mexico Road Trip",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
