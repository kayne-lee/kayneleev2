import { cn } from "@/lib/utils";
import type { Picture } from "@/assets/images";

interface MarkProps {
  /** A build-time optimized image from `@/assets/images`. */
  image: Picture;
  alt?: string;
  className?: string;
  /** Fills the box edge-to-edge (photos, covers) instead of insetting a logo. */
  cover?: boolean;
  /**
   * CSS width of the rendered box, e.g. "56px". Tells the browser which srcset
   * candidate to pick — without it, it assumes 100vw and fetches the largest.
   */
  sizes: string;
}

/** A logo tile, or with `cover`, a photo. Everything below the hero is lazy. */
export const Mark = ({ image, alt = "", className, cover, sizes }: MarkProps) => (
  <span className={cn("mark", className)}>
    <img
      src={image.img.src}
      srcSet={image.sources.webp}
      sizes={sizes}
      width={image.img.w}
      height={image.img.h}
      alt={alt}
      loading="lazy"
      decoding="async"
      className={cn("h-full w-full", cover ? "object-cover" : "object-contain p-[12%]")}
    />
  </span>
);
