import { RecordCard } from "@/components/sections/RecordCard";
import { experience } from "@/data/portfolio";

export const ExperienceSection = () => (
  <div className="space-y-4">
    {experience.map((job) => (
      <RecordCard
        key={job.id}
        image={job.image}
        title={job.title}
        subtitle={job.company}
        meta={job.period}
        location={job.location}
        body={job.description}
        bullets={job.bullets}
        current={job.current}
      />
    ))}
  </div>
);
