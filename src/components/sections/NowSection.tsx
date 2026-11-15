import type { ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { Mark } from "@/components/site/Mark";
import { current } from "@/data/portfolio";

const Group = ({ title, className, children }: { title: string; className?: string; children: ReactNode }) => (
  <section className={className}>
    <h3 className="font-display text-xl font-semibold tracking-[-0.02em] text-ink sm:text-[1.375rem]">{title}</h3>
    <div className="mt-4">{children}</div>
  </section>
);

export const NowSection = () => (
  <div className="grid gap-x-10 gap-y-11 md:grid-cols-2">
    <Group title="Building">
      <ul className="space-y-6">
        {current.projects.map((project, index) => (
          <li key={project.id}>
            <h4 className="flex items-center gap-2.5 font-sans text-base font-semibold tracking-normal text-ink">
              {index === 0 && <span className="now-dot" aria-hidden />}
              {project.title}
            </h4>
            <p className="mt-1.5 text-[0.9688rem] leading-[1.6] text-ink-2">{project.description}</p>
            <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Built with">
              {project.tech.map((tech) => (
                <li key={tech} className="tag">
                  {tech}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </Group>

    <Group title="Reading">
      <ul className="space-y-6">
        {current.books.map((book) => (
          <li key={book.id} className="flex gap-4">
            <Mark image={book.image} cover sizes="56px" className="h-[5.25rem] w-14 !rounded-lg" />
            <div className="flex min-w-0 flex-1 flex-col">
              <h4 className="font-sans text-base font-semibold leading-snug tracking-normal text-ink">{book.title}</h4>
              <p className="text-sm text-ink-3">{book.author}</p>
              <p className="mt-1.5 text-[0.9375rem] leading-snug text-ink-2">{book.description}</p>
              <div className="mt-auto flex items-center gap-3 pt-3">
                <div
                  className="meter flex-1"
                  role="progressbar"
                  aria-label={`Progress through ${book.shortTitle}`}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={book.progress}
                >
                  <span style={{ width: `${book.progress}%` }} />
                </div>
                <span className="text-[0.8125rem] tabular-nums text-ink-3">{book.progress}%</span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </Group>

    <Group title="Training" className="md:col-span-2">
      <dl className="border-b border-ink/10">
        {current.gymProgress.map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col gap-0.5 border-t border-ink/10 py-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8"
          >
            <dt className="shrink-0 text-[0.9375rem] text-ink-3">{stat.label}</dt>
            <dd className="text-[0.9688rem] font-medium text-ink sm:text-right">{stat.value}</dd>
          </div>
        ))}
      </dl>
    </Group>

    <Group title="On repeat">
      <ul className="space-y-2.5">
        {current.music.map((song) => (
          <li key={song.title}>
            <a
              href={song.link}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex flex-wrap items-baseline gap-x-2 text-[0.9688rem]"
            >
              <span className="text-link">{song.title}</span>
              <span className="text-ink-3">{song.artist}</span>
              <ArrowUpRight className="h-4 w-4 self-center text-ink-3 transition-colors group-hover:text-ink" aria-hidden />
            </a>
          </li>
        ))}
      </ul>
    </Group>

    <Group title="Also on my mind">
      <ul className="flex flex-wrap gap-2">
        {current.focusAreas.map((area) => (
          <li key={area} className="tag !px-3.5 !py-1.5 !text-[0.9375rem]">
            {area}
          </li>
        ))}
      </ul>
    </Group>
  </div>
);
