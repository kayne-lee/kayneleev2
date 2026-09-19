import { cn } from "@/lib/utils";
import type { Picture } from "@/assets/images";

interface GlassWellProps {
  /** A build-time optimized image from `@/assets/images`. */
  image?: Picture;
  alt: string;
  /** Shown when there is no image — a lucide glyph or an initial. */
  fallback?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  /** Fills the well edge-to-edge instead of insetting the mark. */
  cover?: boolean;
  /**
   * CSS width of the rendered box, e.g. "40px". Tells the browser which srcset
   * candidate to pick — without it, it assumes 100vw and fetches the largest.
   */
  sizes?: string;
  /**
   * Set on images above the fold. `loading="lazy"` on an in-viewport image does
   * not defer anything and costs it priority, so the tile grid opts out.
   */
  eager?: boolean;
}

/**
 * A slot cut into the glass. Lighting is inverted against GlassPane — inset
 * shadow at the top, highlight at the bottom — so it reads as sunk, not raised.
 * Used for company logos, book covers, and the avatar.
 */
export const GlassWell = ({
  image,
  alt,
  fallback,
  className,
  style,
  cover,
  sizes,
  eager,
}: GlassWellProps) => (
  <div className={cn("glass-well flex shrink-0 items-center justify-center", className)} style={style}>
    {image ? (
      <img
        src={image.img.src}
        srcSet={image.sources.webp}
        sizes={sizes}
        width={image.img.w}
        height={image.img.h}
        alt={alt}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        className={cn(
          "h-full w-full",
          cover
            ? "object-cover"
            : // Logos: the source art is a mark on solid white.
              "object-contain p-[14%] mix-blend-multiply",
        )}
      />
    ) : (
      <span className="text-ink-3">{fallback}</span>
    )}
  </div>
);
