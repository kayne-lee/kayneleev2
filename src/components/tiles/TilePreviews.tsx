import { GlassWell } from "@/components/glass/GlassWell";
import { current, education, experience, extracurriculars, hobbies, projects } from "@/data/portfolio";

/**
 * The seven tile previews.
 *
 * Kept in one module on purpose: they have to read as a single system across
 * the grid, and that is far easier to hold when they sit next to each other.
 * Each one shows the section's actual data — never a decorative stat.
 *
 * Every preview fills its tile. A 2x2 hero and a 1x1 tile get very different
 * answers to the same empty space, so each one distributes its own height.
 */

/** Fraction of the degree completed today. A real, live number. */
const degreeProgress = () => {
  const start = new Date(education.startYear, 8).getTime(); // September
  const end = new Date(education.endYear, 11).getTime(); // December
  const now = Date.now();
  return Math.min(100, Math.max(0, ((now - start) / (end - start)) * 100));
};

/* ---- Experience — the hero tile -----------------------------------------
   A real timeline, newest first. The tile is 2x2, so it earns a full list
   rather than a row of thumbnails floating in dead space. */
export const ExperiencePreview = () => (
  <ul className="flex h-full flex-col justify-between gap-1">
    {experience.map((job) => (
      <li key={job.id} className="flex min-w-0 items-center gap-3">
        <GlassWell src={job.image} alt="" className="h-9 w-9 rounded-xl lg:h-10 lg:w-10" />

        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-1.5 truncate text-sm font-medium text-ink">
            {job.company}
            {job.current && <span className="live-dot" aria-label="Current" />}
          </p>
          <p className="truncate text-[0.8125rem] leading-tight text-ink-3">{job.title}</p>
        </div>

        <span className="shrink-0 font-mono text-[0.625rem] tabular-nums text-ink-3">
          {job.shortPeriod}
        </span>
      </li>
    ))}
  </ul>
);

/* ---- Education ----------------------------------------------------------- */
export const EducationPreview = () => (
  <div className="flex h-full flex-col justify-end gap-2">
    <p className="truncate text-sm font-medium leading-tight text-ink">{education.degree}</p>
    <p className="truncate text-[0.8125rem] leading-tight text-ink-3">{education.school}</p>

    <div className="glass-meter">
      <span style={{ width: `${degreeProgress()}%` }} />
    </div>

    <div className="flex items-baseline justify-between font-mono text-[0.625rem] tracking-[0.08em] text-ink-3">
      <span>{education.startYear}</span>
      <span>{education.endYear}</span>
    </div>
  </div>
);

/* ---- Tech stack — the tall tile ------------------------------------------ */
const LATTICE = [
  "logos:python",
  "logos:typescript-icon",
  "logos:react",
  "logos:pytorch-icon",
  "logos:java",
  "logos:docker-icon",
  "logos:aws",
  "logos:postgresql",
  "logos:kubernetes",
];

export const TechStackPreview = () => (
  <div className="flex h-full flex-col justify-end gap-3">
    <div className="grid flex-1 grid-cols-3 grid-rows-3 gap-1.5">
      {LATTICE.map((slug) => (
        <div key={slug} className="glass-well flex items-center justify-center rounded-lg">
          <img
            src={`https://api.iconify.design/${slug}.svg`}
            alt=""
            loading="lazy"
            className="h-7 w-7 object-contain lg:h-8 lg:w-8"
          />
        </div>
      ))}
    </div>
    <p className="font-mono text-[0.625rem] uppercase tracking-[0.1em] text-ink-3">
      <span className="text-ink-2">20+</span> technologies
    </p>
  </div>
);

/* ---- Projects -----------------------------------------------------------
   Screenshots crop into mush at thumbnail size, so this names them and
   counts the stack instead. */
export const ProjectsPreview = () => (
  <ul className="flex h-full flex-col justify-end gap-1">
    {projects.map((project) => (
      <li key={project.id} className="flex min-w-0 items-baseline gap-2">
        <span className="min-w-0 flex-1 truncate text-[0.8125rem] font-medium leading-tight text-ink">
          {project.short}
        </span>
        <span className="shrink-0 font-mono text-[0.625rem] uppercase tracking-[0.08em] text-ink-3">
          {project.tech[0]}
        </span>
      </li>
    ))}
  </ul>
);

/* ---- Now — the only tile that feels live --------------------------------- */
export const NowPreview = () => (
  <div className="flex h-full flex-col justify-center gap-2.5">
    <ul className="space-y-1.5">
      {current.projects.map((project, index) => (
        <li key={project.id} className="flex min-w-0 items-center gap-2">
          {/* Same 12px box either way, so both rows share a text edge. */}
          {index === 0 ? (
            <span className="live-dot" aria-hidden />
          ) : (
            <span className="flex h-3 w-3 shrink-0 items-center justify-center" aria-hidden>
              <span className="h-1.5 w-1.5 rounded-full bg-ink-3/40" />
            </span>
          )}
          <p className="min-w-0 truncate text-[0.8125rem] font-medium leading-tight text-ink">
            {project.title}
          </p>
        </li>
      ))}
    </ul>

    <div className="space-y-1.5">
      {current.books.map((book) => (
        <div key={book.id} className="flex items-center gap-2">
          <span className="w-20 shrink-0 truncate font-mono text-[0.5625rem] uppercase tracking-[0.08em] text-ink-3">
            {book.shortTitle}
          </span>
          <div className="glass-meter flex-1">
            <span style={{ width: `${book.progress}%` }} />
          </div>
          <span className="font-mono text-[0.5625rem] tabular-nums text-ink-3">{book.progress}%</span>
        </div>
      ))}
    </div>
  </div>
);

/* ---- Extracurriculars ---------------------------------------------------
   Horizontal, and the marks grow with the tile — stacked two-line rows do not
   fit a short 1x1, and a fixed size leaves a void on a tall one. */
export const ExtracurricularsPreview = () => (
  <ul className="flex h-full items-stretch gap-2">
    {extracurriculars.map((activity) => (
      <li key={activity.id} className="flex min-w-0 flex-1 flex-col justify-end gap-2">
        <div className="relative min-h-0 w-full max-w-[3.75rem] flex-1">
          <GlassWell src={activity.image} alt="" className="h-full w-full rounded-xl" />
          {/* `.live-dot` sets its own `position: relative` for the pulse
              ring, so the wrapper carries the placement. */}
          {activity.current && (
            <span className="absolute -right-0.5 -top-0.5" aria-label="Current">
              <span className="live-dot" />
            </span>
          )}
        </div>
        <div className="min-w-0">
          <p className="truncate text-[0.8125rem] font-medium leading-tight text-ink">
            {activity.organization}
          </p>
          <p className="truncate font-mono text-[0.5625rem] uppercase tracking-[0.08em] text-ink-3">
            {activity.shortPeriod}
          </p>
        </div>
      </li>
    ))}
  </ul>
);

/* ---- Hobbies — a filmstrip ----------------------------------------------- */
export const HobbiesPreview = () => (
  <div className="flex h-full items-stretch gap-1.5 sm:gap-2">
    {hobbies.map((hobby) => (
      <GlassWell key={hobby.id} src={hobby.image} alt="" cover className="h-full flex-1 rounded-xl" />
    ))}
  </div>
);
