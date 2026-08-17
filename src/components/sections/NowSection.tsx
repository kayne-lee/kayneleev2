import { ArrowUpRight } from "lucide-react";
import { GlassPane } from "@/components/glass/GlassPane";
import { GlassChip } from "@/components/glass/GlassChip";
import { GlassWell } from "@/components/glass/GlassWell";
import { current } from "@/data/portfolio";

const Group = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <section className="space-y-3">
    <p className="eyebrow">{label}</p>
    {children}
  </section>
);

export const NowSection = () => (
  <div className="space-y-7">
    <Group label="Building">
      <div className="grid gap-3 md:grid-cols-2">
        {current.projects.map((project, index) => (
          <GlassPane key={project.id} depth={3} className="p-4">
            <div className="flex items-center gap-2">
              {index === 0 && <span className="live-dot shrink-0" aria-hidden />}
              <h3 className="font-display text-base font-semibold tracking-[-0.02em] text-ink">
                {project.title}
              </h3>
            </div>
            <p className="mt-1.5 max-w-[60ch] text-[0.9375rem] leading-relaxed text-ink-2">{project.description}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {project.tech.map((tech) => (
                <GlassChip key={tech}>{tech}</GlassChip>
              ))}
            </div>
          </GlassPane>
        ))}
      </div>
    </Group>

    <Group label="Reading">
      <div className="grid gap-3 md:grid-cols-2">
        {current.books.map((book) => (
          <GlassPane key={book.id} depth={3} className="flex gap-4 p-4">
            <GlassWell src={book.image} alt="" cover className="h-[4.5rem] w-12 rounded-lg" />
            <div className="flex min-w-0 flex-1 flex-col">
              <h3 className="font-display text-base font-semibold tracking-[-0.02em] text-ink">
                {book.title}
              </h3>
              <p className="font-mono text-[0.6875rem] uppercase tracking-[0.08em] text-ink-3">
                {book.author}
              </p>
              <p className="mt-1.5 text-sm leading-snug text-ink-2">{book.description}</p>

              <div className="mt-auto flex items-center gap-2 pt-3">
                <div className="glass-meter flex-1">
                  <span style={{ width: `${book.progress}%` }} />
                </div>
                <span className="font-mono text-[0.625rem] tabular-nums text-ink-3">{book.progress}%</span>
              </div>
            </div>
          </GlassPane>
        ))}
      </div>
    </Group>

    <Group label="Training">
      <GlassPane depth={3} className="divide-y divide-[hsl(var(--border))] p-1">
        {current.gymProgress.map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
          >
            <span className="font-mono text-[0.6875rem] uppercase tracking-[0.1em] text-ink-3">
              {stat.label}
            </span>
            <span className="text-[0.9375rem] text-ink-2 sm:text-right">{stat.value}</span>
          </div>
        ))}
      </GlassPane>
    </Group>

    <Group label="On repeat">
      <div className="flex flex-wrap gap-2">
        {current.music.map((song) => (
          <GlassChip key={song.title} href={song.link} mono={false}>
            <span className="font-medium text-ink">{song.title}</span>
            <span className="text-ink-3">{song.artist}</span>
            <ArrowUpRight className="h-3.5 w-3.5 text-ink-3" aria-hidden />
          </GlassChip>
        ))}
      </div>
    </Group>

    <Group label="Also on my mind">
      <div className="flex flex-wrap gap-2">
        {current.focusAreas.map((area) => (
          <GlassChip key={area} mono={false} className="text-[0.9375rem] text-ink-2">
            {area}
          </GlassChip>
        ))}
      </div>
    </Group>
  </div>
);
