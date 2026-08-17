import { forwardRef, useCallback, useRef, type CSSProperties, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type Depth = 1 | 2 | 3;

interface GlassPaneProps {
  children: ReactNode;
  /** 1 = frame, 2 = tile (default), 3 = card inside an opened tile. */
  depth?: Depth;
  /** Adds hover lift + the pointer-tracked specular highlight. */
  interactive?: boolean;
  /** Real backdrop blur. Only for surfaces with something sharp behind them
      — the frame, the header, the opened panel. Nesting these is what makes
      the compositor fall over. */
  frost?: boolean;
  /** Index in the load sequence; panes settle 60ms apart. */
  settleIndex?: number;
  className?: string;
  style?: CSSProperties;
  as?: "div" | "button" | "article";
  onClick?: () => void;
  "aria-label"?: string;
}

const DEPTH_CLASS: Record<Depth, string> = {
  1: "glass glass-1",
  2: "glass",
  3: "glass glass-3",
};

/**
 * The one surface every element on this site is made of.
 *
 * Depth is the whole design: with no color behind the glass, a pane only
 * reads as a pane because it is measurably lighter than what it sits on.
 * Never nest the same depth inside itself.
 */
export const GlassPane = forwardRef<HTMLDivElement, GlassPaneProps>(function GlassPane(
  { children, depth = 2, interactive, frost, settleIndex, className, style, as = "div", onClick, ...rest },
  ref,
) {
  const localRef = useRef<HTMLElement | null>(null);

  /**
   * Move the specular highlight to the pointer. Written straight to CSS
   * custom properties so it never round-trips through React state — this
   * fires on every pointermove.
   */
  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      if (!interactive) return;
      const node = localRef.current;
      if (!node) return;
      const rect = node.getBoundingClientRect();
      node.style.setProperty("--mx", `${event.clientX - rect.left}px`);
      node.style.setProperty("--my", `${event.clientY - rect.top}px`);
      node.style.setProperty("--sheen", "1");
    },
    [interactive],
  );

  const handlePointerLeave = useCallback(() => {
    localRef.current?.style.setProperty("--sheen", "0");
  }, []);

  const Tag = as as "div";

  return (
    <Tag
      ref={(node: HTMLDivElement | null) => {
        localRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      }}
      className={cn(
        DEPTH_CLASS[depth],
        frost && "glass-frost",
        interactive && "glass-interactive",
        settleIndex !== undefined && "settle",
        className,
      )}
      style={{
        ...(settleIndex !== undefined
          ? ({ "--settle-delay": `${settleIndex * 60}ms` } as CSSProperties)
          : null),
        ...style,
      }}
      onPointerMove={interactive ? handlePointerMove : undefined}
      onPointerLeave={interactive ? handlePointerLeave : undefined}
      onClick={onClick}
      {...rest}
    >
      {children}
    </Tag>
  );
});
