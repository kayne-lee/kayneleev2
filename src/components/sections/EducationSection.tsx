import { education } from "@/data/portfolio";

const START = new Date(education.startYear, 8).getTime(); // September
const END = new Date(education.endYear, 5).getTime(); // June

/** Where a date falls along the degree, 0–100. */
const along = (time: number) => Math.min(100, Math.max(0, ((time - START) / (END - START)) * 100));

export const EducationSection = () => {
  const now = along(Date.now());
  const progress = Math.round(now);

  return (
    <div>
      <div>
        <h3>{education.degree}</h3>
        <p className="em">
          {education.school} · {education.start} – {education.end}
        </p>
      </div>

      <div className="mt-6" role="img" aria-label={`${education.start} to ${education.end}, ${progress}% complete`}>
        <div className="meter">
          <span style={{ width: `${now}%` }} />
        </div>
        <p className="em mt-2">{progress}% complete</p>
      </div>

      <div className="mt-10 grid gap-10 sm:grid-cols-2">
        <section>
          <h3>Coursework</h3>
          <ul className="mt-2">
            {education.coursework.map((course) => (
              <li key={course}>{course}</li>
            ))}
          </ul>
        </section>
        <section>
          <h3>Honors &amp; awards</h3>
          <ul className="mt-2 space-y-1">
            {education.honors.map((honor) => (
              <li key={honor}>{honor}</li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
};
