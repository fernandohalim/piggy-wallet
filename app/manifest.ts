import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Piggy Wallet",
    short_name: "Piggy Wallet",
    description: "A simple offline-first expense tracker.",
    start_url: "/",
    display: "standalone",
    background_color: "#FAF7F2",
    theme_color: "#0E9F6E",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}