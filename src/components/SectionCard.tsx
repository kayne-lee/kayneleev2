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

  return (
    <Card
      onClick={onClick}
      className="block-3d group relative h-full cursor-pointer border border-border bg-card rounded-[24px]"
    >
      <div className="flex h-full flex-col p-5 md:p-6 lg:p-7">
        <div className="mb-4 flex items-start justify-between md:mb-5">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent/15 text-accent shadow-[inset_0_1px_0_0_hsl(0_0%_100%/0.18),0_8px_16px_-8px_hsl(var(--accent)/0.55)] transition-smooth group-hover:-translate-y-0.5 group-hover:scale-105 md:h-12 md:w-12">
            <Icon className="h-6 w-6 md:h-7 md:w-7" />
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
        
        <h2 className="mb-2 mt-auto text-lg font-serif font-semibold text-foreground md:text-xl xl:text-2xl">
          {title}
        </h2>

        <div className="space-y-1">
          <div className="text-2xl font-serif font-bold text-primary md:text-3xl xl:text-4xl">
            {metric}
          </div>
          <p className="text-sm text-muted-foreground uppercase tracking-wide">
            {metricLabel}
          </p>
        </div>
      </div>
    </Card>
  );
};
