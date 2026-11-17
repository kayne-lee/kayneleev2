import type { ReactNode } from "react";
import { Mark } from "@/components/site/Mark";
import { current } from "@/data/portfolio";

const Group = ({ title, children }: { title: string; children: ReactNode }) => (
  <section className="border-t border-line py-8 first:border-t-0 first:pt-0 last:pb-0">
    <h3>{title}</h3>
    <div className="mt-3">{children}</div>
  </section>
);

export const NowSection = () => (
  <div>
    <Group title="Building">
      <ul className="space-y-4">
        {current.projects.map((project) => (
          <li key={project.id}>
            <strong>{project.title}</strong>
            <p>{project.description}</p>
            <p className="em">{project.tech.join(" · ")}</p>
          </li>
        ))}
      </ul>
    </Group>

    <Group title="Reading">
      <ul className="space-y-4">
        {current.books.map((book) => (
          <li key={book.id} className="flex items-center gap-3">
            <Mark image={book.image} cover sizes="24px" className="h-9 w-6 !rounded-sm" />
            <div className="min-w-0 flex-1">
              <p>
                <strong>{book.title}</strong> <em>by {book.author}</em>
              </p>
              <div className="mt-1.5 flex items-center gap-3">
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
                <em className="tabular-nums">{book.progress}%</em>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </Group>

    <Group title="Training">
      <dl>
        {current.gymProgress.map((stat) => (
          <div key={stat.label} className="flex justify-between gap-6">
            <dt className="em">{stat.label}</dt>
            <dd className="text-right">{stat.value}</dd>
          </div>
        ))}
      </dl>
    </Group>

    <Group title="On repeat">
      <ul>
        {current.music.map((song) => (
          <li key={song.title}>
            <a href={song.link} target="_blank" rel="noreferrer" className="hover:underline hover:underline-offset-4">
              <strong>{song.title}</strong> <em>{song.artist}</em>
            </a>
          </li>
        ))}
      </ul>
    </Group>

    <Group title="Also on my mind">
      <p className="em">{current.focusAreas.join(" · ")}</p>
    </Group>
  </div>
);
