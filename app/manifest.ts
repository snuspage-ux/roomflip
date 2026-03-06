import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "RoomFlip — AI Interior Design",
    short_name: "RoomFlip",
    description: "Upload a photo of your room and AI redesigns it in 15+ stunning styles. Completely free.",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a0f",
    theme_color: "#6366f1",
    icons: [
      { src: "/favicon.ico", sizes: "any", type: "image/x-icon" },
    ],
  };
}
