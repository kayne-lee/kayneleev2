import { GlassPane } from "@/components/glass/GlassPane";
import { GlassChip } from "@/components/glass/GlassChip";
import { education } from "@/data/portfolio";

export const EducationSection = () => (
  <div className="space-y-4">
    <GlassPane depth={3} className="p-5 sm:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <span className="font-mono text-[0.6875rem] uppercase tracking-[0.1em] text-ink-2">
          {education.school}
        </span>
        <span className="font-mono text-[0.6875rem] uppercase tracking-[0.08em] text-ink-3">
          {education.start} — {education.end}
        </span>
      </div>

      <h3 className="mt-1 font-display text-xl font-semibold tracking-[-0.02em] text-ink sm:text-2xl">
        {education.degree}
      </h3>

      <p className="eyebrow mt-6">Coursework</p>
      <ul className="mt-2 grid grid-cols-1 gap-x-6 gap-y-1.5 text-[0.9375rem] text-ink-2 sm:grid-cols-2">
        {education.coursework.map((course) => (
          <li key={course} className="flex gap-2.5">
            <span className="mt-[0.6em] h-px w-2.5 shrink-0 bg-ink-3/50" aria-hidden />
            {course}
          </li>
        ))}
      </ul>
    </GlassPane>

    <GlassPane depth={3} className="p-5 sm:p-6">
      <p className="eyebrow">Honors & awards</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {education.honors.map((honor) => (
          <GlassChip key={honor} mono={false} className="text-[0.9375rem] text-ink-2">
            {honor}
          </GlassChip>
        ))}
      </div>
    </GlassPane>
  </div>
);
