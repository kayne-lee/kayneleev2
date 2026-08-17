import { cn } from "@/lib/utils";

interface GlassChipProps {
  children: React.ReactNode;
  href?: string;
  className?: string;
  /** Mono + uppercase + tracked — for data, not for prose. */
  mono?: boolean;
}

/** Small pill of glass. Contact links, tech tags, date ranges. */
export const GlassChip = ({ children, href, className, mono = true }: GlassChipProps) => {
  const classes = cn(
    "glass-chip",
    mono ? "font-mono text-[0.6875rem] uppercase tracking-[0.08em]" : "text-sm",
    className,
  );

  if (href) {
    return (
      <a
        href={href}
        target={href.startsWith("http") ? "_blank" : undefined}
        rel={href.startsWith("http") ? "noreferrer" : undefined}
        className={classes}
      >
        {children}
      </a>
    );
  }

  return <span className={classes}>{children}</span>;
};
