import type { MDXComponents } from "mdx/types";
import Image, { type ImageProps } from "next/image";
import TextBlock from "@/components/TextBlock";
import VideoEmbed from "@/components/VideoEmbed";

// Components available in every .mdx file without importing them
const components: MDXComponents = {
  Image: ({ alt, ...props }: ImageProps) => (
    <Image
      sizes="(min-width: 1280px) 1200px, 100vw"
      alt={alt}
      // Animated GIFs can't be optimized; serve them as-is
      unoptimized={String(props.src).endsWith(".gif")}
      {...props}
    />
  ),
  TextBlock,
  VideoEmbed,
  a: ({ href = "", ...props }) =>
    /^https?:\/\//.test(href) ? (
      <a href={href} target="_blank" rel="noreferrer" {...props} />
    ) : (
      <a href={href} {...props} />
    ),
};

export function useMDXComponents(): MDXComponents {
  return components;
}
