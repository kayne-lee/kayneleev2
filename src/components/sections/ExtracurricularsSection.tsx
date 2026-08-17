import { RecordCard } from "@/components/sections/RecordCard";
import { extracurriculars } from "@/data/portfolio";

export const ExtracurricularsSection = () => (
  <div className="space-y-4">
    {extracurriculars.map((activity) => (
      <RecordCard
        key={activity.id}
        image={activity.image}
        title={activity.title}
        subtitle={activity.organization}
        meta={activity.period}
        body={activity.description}
        current={activity.current}
      />
    ))}
  </div>
);
