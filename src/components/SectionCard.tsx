import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

interface SectionCardProps {
  title: string;
  metric: string;
  metricLabel: string;
  icon: LucideIcon;
  itemCount: number;
  images?: (string | null)[];
  onClick: () => void;
}

export const SectionCard = ({ title, metric, metricLabel, icon, itemCount, images, onClick }: SectionCardProps) => {
  const Icon = icon;
  const imageCount = images ? Math.min(images.length, 5) : Math.min(itemCount, 5);

  // Adaptive metric sizing: big punchy numbers, smaller for long phrases so
  // the text always fits inside the fixed-height tile.
  const metricSizeClass =
    metric.length <= 4
      ? "text-2xl md:text-3xl"
      : metric.length <= 9
        ? "text-xl md:text-2xl"
        : "text-base md:text-lg";

  return (
    <Card
      onClick={onClick}
      className="block-3d group relative h-full cursor-pointer border border-border bg-card rounded-[28px]"
    >
      <div className="flex h-full min-h-0 flex-col overflow-hidden p-4 md:p-5 lg:p-6">
        <div className="mb-2 flex items-start justify-between md:mb-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent/15 text-accent shadow-[inset_0_1px_0_0_hsl(0_0%_100%/0.18),0_8px_16px_-8px_hsl(var(--accent)/0.55)] transition-smooth group-hover:-translate-y-0.5 group-hover:scale-105 md:h-11 md:w-11">
            <Icon className="h-5 w-5 md:h-6 md:w-6" />
          </div>
          
          {/* Cascaded Images */}
          <div className="flex items-center -space-x-2 sm:-space-x-3">
            {Array.from({ length: imageCount }).map((_, i) => (
              <div
                key={i}
                className="relative h-6 w-6 overflow-hidden rounded-full border-2 border-card shadow-md sm:h-7 sm:w-7 lg:h-8 lg:w-8"
                style={{ zIndex: imageCount - i }}
              >
                {images && images[i] ? (
                  <img 
                    src={images[i]!} 
                    alt={`${title} ${i + 1}`}
                    className="w-full h-full object-contain bg-accent/10"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-accent/40 to-accent/60 flex items-center justify-center">
                    <span className="text-xs text-accent font-bold">{i + 1}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        <h2 className="mb-1 mt-auto text-base font-serif font-semibold leading-tight text-foreground md:text-lg xl:text-xl">
          {title}
        </h2>

        <div className="min-w-0 space-y-0.5">
          <div className={`font-serif font-bold leading-tight break-words text-primary ${metricSizeClass}`}>
            {metric}
          </div>
          <p className="text-xs leading-tight text-muted-foreground uppercase tracking-wide">
            {metricLabel}
          </p>
        </div>
      </div>
    </Card>
  );
};
