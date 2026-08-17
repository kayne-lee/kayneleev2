import { forwardRef, type CSSProperties, type ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { GlassPane } from "@/components/glass/GlassPane";
import { cn } from "@/lib/utils";

interface SectionCardProps {
  /** Mono label. Carries the count, so it does real work. */
  eyebrow: string;
  title: string;
  /** The tile's data expression — differs per section. */
  children: ReactNode;
  settleIndex: number;
  className?: string;
  style?: CSSProperties;
  onClick: () => void;
}

/**
 * Shared tile chrome: eyebrow, title, then the preview filling whatever is
 * left. Every tile keeps this rhythm — label, name, evidence — so seven
 * different previews still scan as one grid.
 */
export const SectionCard = forwardRef<HTMLDivElement, SectionCardProps>(function SectionCard(
  { eyebrow, title, children, settleIndex, className, style, onClick },
  ref,
) {
  return (
    <GlassPane
      ref={ref}
      as="button"
      interactive
      frost
      settleIndex={settleIndex}
      style={style}
      onClick={onClick}
      aria-label={`Open ${title}`}
      className={cn(
        "group flex h-full w-full min-w-0 flex-col overflow-hidden p-4 text-left lg:p-5",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="eyebrow">{eyebrow}</span>
        <ArrowUpRight
          className="h-4 w-4 shrink-0 text-ink-3 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[hsl(var(--accent))]"
          aria-hidden
        />
      </div>

      <h2 className="mt-1 font-display text-[1.0625rem] font-semibold leading-[1.15] tracking-[-0.025em] text-ink lg:text-[1.1875rem]">
        {title}
      </h2>

      {/* Previews own their own vertical distribution — a 2x2 hero and a
          1x1 tile need very different answers to the same empty space. */}
      <div className="mt-2 flex min-h-0 flex-1 flex-col overflow-hidden">{children}</div>
    </GlassPane>
  );
});
