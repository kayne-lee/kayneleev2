import { Mark } from "@/components/site/Mark";
import { alsoInto, hobbies } from "@/data/portfolio";

export const HobbiesSection = () => (
  <>
    <ul className="space-y-6">
      {hobbies.map((hobby) => (
        <li key={hobby.id} className="flex gap-4">
          <Mark image={hobby.image} alt={hobby.title} cover sizes="48px" className="h-12 w-12" />
          <div className="min-w-0 flex-1">
            <h3>{hobby.title}</h3>
            <p>{hobby.description}</p>
          </div>
        </li>
      ))}
    </ul>

    <p className="mt-10">
      <strong>Also into</strong> <em>{alsoInto.join(" · ")}</em>
    </p>
  </>
);
