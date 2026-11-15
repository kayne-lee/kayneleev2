import { Entry } from "@/components/site/Entry";
import { extracurriculars } from "@/data/portfolio";

export const ExtracurricularsSection = () => (
  <div>
    {extracurriculars.map((activity) => (
      <Entry
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
