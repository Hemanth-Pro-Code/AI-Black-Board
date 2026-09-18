import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "BlackBoard AI",
    short_name: "BlackBoard AI",
    description:
      "AI-powered digital blackboard for handwriting, mathematical problem solving, OCR, brainstorming, and intelligent handwritten responses.",
    start_url: "/board?source=pwa",
    scope: "/",
    display: "standalone",
    background_color: "#07251c",
    theme_color: "#0b3d2e",
    orientation: "any",
    categories: ["education", "productivity", "utilities"],
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
