import { GlassPane } from "@/components/glass/GlassPane";
import { GlassWell } from "@/components/glass/GlassWell";
import { hobbies } from "@/data/portfolio";

export const HobbiesSection = () => (
  <div className="grid gap-4 md:grid-cols-2">
    {hobbies.map((hobby) => (
      <GlassPane key={hobby.id} depth={3} className="flex gap-4 p-4 sm:p-5">
        <GlassWell src={hobby.image} alt="" cover className="h-14 w-14 rounded-2xl" />
        <div className="min-w-0">
          <h3 className="font-display text-base font-semibold tracking-[-0.02em] text-ink">{hobby.title}</h3>
          <p className="mt-1.5 max-w-[60ch] text-[0.9375rem] leading-relaxed text-ink-2">{hobby.description}</p>
        </div>
      </GlassPane>
    ))}
  </div>
);
