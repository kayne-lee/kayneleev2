import { Mark } from "@/components/site/Mark";
import { alsoInto, hobbies } from "@/data/portfolio";

export const HobbiesSection = () => (
  <>
    <ul className="grid grid-cols-2 gap-x-5 gap-y-9 md:grid-cols-3">
      {hobbies.map((hobby) => (
        <li key={hobby.id}>
          <Mark
            image={hobby.image}
            alt={hobby.title}
            cover
            sizes="(min-width: 1024px) 260px, (min-width: 768px) 30vw, 45vw"
            className="aspect-[4/5] w-full !rounded-2xl"
          />
          <h3 className="mt-3.5 font-display text-lg font-semibold leading-tight tracking-[-0.02em] text-ink">
            {hobby.title}
          </h3>
          <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-ink-2">
            {hobby.description}
          </p>
        </li>
      ))}
    </ul>

    <div className="mt-10 border-t border-ink/10 pt-7">
      <h3 className="font-display text-lg font-semibold tracking-[-0.02em] text-ink">
        Also into
      </h3>
      <ul className="mt-3 flex flex-wrap gap-2">
        {alsoInto.map((interest) => (
          <li key={interest} className="tag !px-3.5 !py-1.5 !text-[0.9375rem]">
            {interest}
          </li>
        ))}
      </ul>
    </div>
  </>
);
