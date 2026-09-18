import type { Metadata, Viewport } from "next";
import { Caveat } from "next/font/google";
import "./globals.css";
import PWAProvider from "@/components/PWA/PWAProvider";
import InstallPrompt from "@/components/PWA/InstallPrompt";

const caveat = Caveat({
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#0b3d2e",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "BlackBoard AI - Smart Digital Blackboard",
  description:
    "AI-powered digital blackboard for handwriting, mathematical problem solving, OCR, brainstorming, and intelligent handwritten responses.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "BlackBoard AI",
  },
  icons: {
    icon: [
      { url: "/icons/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      {
        url: "/icons/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={caveat.className}>
        <PWAProvider>
          <InstallPrompt />
          {children}
        </PWAProvider>
      </body>
    </html>
  );
}