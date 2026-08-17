import { cn } from "@/lib/utils";

interface GlassWellProps {
  src?: string;
  alt: string;
  /** Shown when there is no image — a lucide glyph or an initial. */
  fallback?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  /** Fills the well edge-to-edge instead of insetting the mark. */
  cover?: boolean;
}

/**
 * A slot cut into the glass. Lighting is inverted against GlassPane — inset
 * shadow at the top, highlight at the bottom — so it reads as sunk, not raised.
 * Used for company logos, book covers, and the avatar.
 */
export const GlassWell = ({ src, alt, fallback, className, style, cover }: GlassWellProps) => (
  <div className={cn("glass-well flex shrink-0 items-center justify-center", className)} style={style}>
    {src ? (
      <img
        src={src}
        alt={alt}
        loading="lazy"
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
