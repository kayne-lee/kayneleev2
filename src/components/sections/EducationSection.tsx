import { education } from "@/data/portfolio";

/** Fraction of the degree completed today. A real, live number. */
const degreeProgress = () => {
  const start = new Date(education.startYear, 8).getTime(); // September
  const end = new Date(education.endYear, 5).getTime(); // June
  return Math.min(100, Math.max(0, ((Date.now() - start) / (end - start)) * 100));
};

export const EducationSection = () => {
  const progress = Math.round(degreeProgress());

  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-0.5">
        <h3 className="font-display text-2xl font-semibold leading-tight tracking-[-0.025em] text-ink sm:text-[1.75rem]">
          {education.degree}
        </h3>
        <span className="text-sm tabular-nums text-ink-3">
          {education.start} — {education.end}
        </span>
      </div>
      <p className="mt-1 text-[0.9375rem] font-medium text-ink">{education.school}</p>

      <div className="mt-5 max-w-md">
        <div
          className="meter"
          role="progressbar"
          aria-label="Degree progress"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress}
        >
          <span style={{ width: `${progress}%` }} />
        </div>
        <div className="mt-1.5 flex justify-between text-[0.8125rem] tabular-nums text-ink-3">
          <span>{education.startYear}</span>
          <span>{progress}% complete</span>
          <span>{education.endYear}</span>
        </div>
      </div>

      <div className="mt-10 grid gap-10 border-t border-ink/10 pt-8 sm:grid-cols-2">
        <div>
          <h4 className="font-display text-lg font-semibold tracking-[-0.02em] text-ink">Coursework</h4>
          <ul className="mt-3 space-y-1.5 text-[0.9688rem] text-ink-2">
            {education.coursework.map((course) => (
              <li key={course}>{course}</li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-display text-lg font-semibold tracking-[-0.02em] text-ink">Honors & awards</h4>
          <ul className="mt-3 space-y-2.5 text-[0.9688rem] leading-snug text-ink-2">
            {education.honors.map((honor) => (
              <li key={honor} className="flex gap-3">
                <span className="mt-[0.5em] h-1.5 w-1.5 shrink-0 rounded-full bg-coral" aria-hidden />
                {honor}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
