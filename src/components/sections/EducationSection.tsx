import {
  Award,
  Binary,
  BookOpen,
  Boxes,
  Code,
  Cpu,
  Database,
  Medal,
  Network,
  SquareTerminal,
  Trophy,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { education } from "@/data/portfolio";

const START = new Date(education.startYear, 8).getTime(); // September
const END = new Date(education.endYear, 5).getTime(); // June

/** Where a date falls along the degree, 0–100. */
const along = (time: number) => Math.min(100, Math.max(0, ((time - START) / (END - START)) * 100));

/** One mark per academic year (each September), then graduation. */
const YEAR_MARKS = [
  ...Array.from({ length: education.endYear - education.startYear }, (_, i) => ({
    label: i === 0 ? `Sep ${education.startYear}` : String(education.startYear + i),
    at: along(new Date(education.startYear + i, 8).getTime()),
  })),
  { label: `Jun ${education.endYear}`, at: 100 },
];

/** A glyph per course. Anything not listed falls back to a book. */
const COURSE_ICONS: Record<string, LucideIcon> = {
  "Data Structures & Algorithms": Binary,
  "Computer Architecture": Cpu,
  "Operating Systems": SquareTerminal,
  "Object-Oriented Programming": Boxes,
  "Software Development": Code,
  "Database Systems": Database,
  "Computer Networks": Network,
};

/** Cycled through the honors, in order. */
const HONOR_ICONS: LucideIcon[] = [Award, Medal, Trophy];

/**
 * Fills the sheet top to bottom: the degree set plainly in type over a
 * year-by-year timeline, then coursework tiles beside the honors, both
 * stretching to use whatever height is left.
 */
export const EducationSection = () => {
  const now = along(Date.now());
  const progress = Math.round(now);

  return (
    <div className="flex flex-1 flex-col gap-7 lg:gap-9">
      <div>
        <p className="text-base font-medium text-ink-3 sm:text-lg">{education.school}</p>
        <h3 className="mt-1 font-display text-[2.25rem] font-black leading-[0.95] tracking-[-0.01em] text-ink [font-stretch:75%] sm:text-[3.5rem]">
          {education.degree}
        </h3>

        {/* The degree as a line: a tick for each academic year, filled up to today. */}
        <div
          className="relative mt-12 sm:mt-14"
          role="img"
          aria-label={`${education.start} to ${education.end}, ${progress}% complete`}
        >
          <span
            className="absolute bottom-full mb-2.5 -translate-x-1/2 whitespace-nowrap text-sm font-semibold text-ink"
            style={{ left: `${now}%` }}
          >
            Now, {progress}%
          </span>

          <div className="relative h-[3px] bg-ink/15">
            <span className="absolute inset-y-0 left-0 bg-ink" style={{ width: `${now}%` }} />
            {YEAR_MARKS.map((mark) => (
              <span
                key={mark.label}
                className="absolute top-1/2 h-3 w-[3px] -translate-x-1/2 -translate-y-1/2 bg-ink"
                style={{ left: `${mark.at}%`, opacity: mark.at <= now ? 1 : 0.25 }}
              />
            ))}
            <span
              className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet ring-4 ring-chalk"
              style={{ left: `${now}%` }}
            />
          </div>

          <div className="relative mt-3 h-5 text-sm tabular-nums text-ink-3">
            {YEAR_MARKS.map((mark, index) => {
              const first = index === 0;
              const last = index === YEAR_MARKS.length - 1;
              return (
                <span
                  key={mark.label}
                  className={
                    first
                      ? "absolute left-0"
                      : last
                        ? "absolute right-0"
                        : "absolute hidden -translate-x-1/2 sm:block"
                  }
                  style={first || last ? undefined : { left: `${mark.at}%` }}
                >
                  {mark.label}
                </span>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid flex-1 gap-4 lg:grid-cols-5 lg:gap-5">
        <section className="flex flex-col rounded-[1.75rem] bg-white p-5 shadow-[0_0_0_1px_hsl(var(--ink-1)/0.07)] sm:p-6 lg:col-span-3">
          <h3 className="flex items-center gap-2.5 font-display text-xl font-semibold tracking-[-0.01em] text-ink">
            <BookOpen className="h-5 w-5 text-violet" aria-hidden />
            Coursework
          </h3>
          <ul className="mt-4 grid flex-1 auto-rows-fr gap-2 sm:grid-cols-2">
            {education.coursework.map((course) => {
              const Icon = COURSE_ICONS[course] ?? BookOpen;
              return (
                <li key={course} className="flex items-center gap-3 rounded-2xl bg-chalk px-3 py-2.5">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-periwinkle/60 text-ink">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <span className="text-[0.9375rem] font-medium leading-snug text-ink">{course}</span>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="flex flex-col rounded-[1.75rem] bg-white p-5 shadow-[0_0_0_1px_hsl(var(--ink-1)/0.07)] sm:p-6 lg:col-span-2">
          <h3 className="flex items-center gap-2.5 font-display text-xl font-semibold tracking-[-0.01em] text-ink">
            <Trophy className="h-5 w-5 text-coral" aria-hidden />
            Honors & awards
          </h3>
          <ul className="mt-4 grid flex-1 auto-rows-fr gap-2">
            {education.honors.map((honor, index) => {
              const Icon = HONOR_ICONS[index % HONOR_ICONS.length];
              return (
                <li key={honor} className="flex items-center gap-3 rounded-2xl bg-chalk px-3 py-2.5">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-peach text-ink">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <span className="text-[0.9375rem] font-medium leading-snug text-ink">{honor}</span>
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </div>
  );
};
