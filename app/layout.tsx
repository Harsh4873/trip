import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://harsh.bet"),
  title: "New Mexico Roadbook · Aug 8–15, 2026",
  description:
    "A researched, day-by-day roadbook for Taos, Santa Fe, Albuquerque, and Palo Duro—with vegetarian food, realistic drive pacing, and shared checklists.",
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
    title: "New Mexico Roadbook · 2026",
    description: "Eight days across Taos, Santa Fe, Albuquerque, and Palo Duro.",
    url: "https://harsh.bet/trip/",
    siteName: "New Mexico Roadbook",
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
