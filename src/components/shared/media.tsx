import Image, { type ImageProps } from "next/image";

/** next/image wrapper: SVG placeholders skip the optimizer, raster images get full optimization. */
export function Media(props: ImageProps) {
  const isSvg = typeof props.src === "string" && props.src.endsWith(".svg");
  return <Image {...props} unoptimized={isSvg || props.unoptimized} />;
}
