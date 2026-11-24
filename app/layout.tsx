import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#5c4a3c" },
    { media: "(prefers-color-scheme: dark)", color: "#221c16" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL("https://harsh.bet"),
  manifest: "/trip/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/trip/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/trip/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/trip/apple-touch-icon.png",
  },
  appleWebApp: {
    title: "Trip roadbook",
    statusBarStyle: "default",
  },
  title: "Trip roadbook · PIN required",
  description: "Private trip notes. PIN required.",
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
    title: "Trip roadbook · PIN required",
    description: "Private trip planner. PIN required.",
    url: "https://harsh.bet/trip/",
    siteName: "Trip roadbook",
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
      <head>
        <meta name="robots" content="noindex,nofollow" />
      </head>
      <body>{children}</body>
    </html>
  );
}
