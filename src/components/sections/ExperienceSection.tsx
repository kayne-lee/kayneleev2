import { Entry } from "@/components/site/Entry";
import { experience } from "@/data/portfolio";

export const ExperienceSection = () => (
  <div>
    {experience.map((job) => (
      <Entry
        key={job.id}
        image={job.image}
        title={job.title}
        subtitle={job.company}
        location={job.location}
        meta={job.period}
        body={job.description}
        bullets={job.bullets}
        current={job.current}
      />
    ))}
  </div>
);
