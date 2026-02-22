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
      className="group relative h-full overflow-hidden cursor-pointer transition-smooth hover:shadow-lg hover:-translate-y-1 border-border bg-card rounded-[24px]"
    >
      <div className="flex h-full flex-col p-4 md:p-4 lg:p-5 xl:p-6">
        <div className="mb-4 flex items-start justify-between md:mb-5">
          <div className="text-accent transition-smooth group-hover:scale-110">
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
        
        <h2 className="mb-2 text-lg font-serif font-semibold text-foreground md:text-xl xl:text-2xl">
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
      
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-accent transform scale-x-0 group-hover:scale-x-100 transition-smooth origin-left" />
    </Card>
  );
};
