import type { MetadataRoute } from "next";
import { brand } from "@/config/brand";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${brand.name.fa} | ${brand.name.en}`,
    short_name: brand.name.fa,
    start_url: "/fa",
    display: "standalone",
    background_color: brand.themeColor.dark,
    theme_color: brand.themeColor.light,
    lang: "fa",
    dir: "rtl",
    icons: [{ src: brand.logo.icon.src, sizes: "any", type: "image/svg+xml", purpose: "any" }],
  };
}
