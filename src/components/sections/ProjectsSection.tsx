import type { CSSProperties } from "react";
import { ArrowUpRight } from "lucide-react";
import { projects } from "@/data/portfolio";

/** Each screenshot sits in its own grainy swatch; the last one takes the warm note. */
const FRAMES = [
  ["hsl(var(--sky))", "hsl(var(--periwinkle))", "hsl(var(--iris))"],
  ["hsl(var(--periwinkle))", "hsl(var(--iris))", "hsl(var(--orchid))"],
  ["hsl(var(--orchid))", "hsl(var(--violet))", "hsl(var(--cobalt))"],
  ["hsl(var(--peach))", "hsl(var(--orchid))", "hsl(var(--violet))"],
];

export const ProjectsSection = () => (
  <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2">
    {projects.map((project, index) => {
      const [a, b, c] = FRAMES[index % FRAMES.length];
      return (
        <article key={project.id} className="flex flex-col">
          <div
            className="swatch aspect-[4/3] p-5 sm:p-6"
            style={{ "--a": a, "--b": b, "--c": c } as CSSProperties}
          >
            <img
              src={project.image.img.src}
              srcSet={project.image.sources.webp}
              sizes="(min-width: 1024px) 320px, (min-width: 640px) 40vw, 85vw"
              width={project.image.img.w}
              height={project.image.img.h}
              alt={`Screenshot of ${project.short}`}
              loading="lazy"
              decoding="async"
              className="relative z-10 h-full w-full rounded-xl bg-white object-cover shadow-[0_18px_40px_-20px_hsl(var(--ink-1)/0.7)]"
            />
          </div>

          <h3 className="mt-5 font-display text-xl font-semibold leading-tight tracking-[-0.02em] text-ink sm:text-[1.375rem]">
            {project.title}
          </h3>
          <p className="mt-2.5 text-[0.9688rem] leading-[1.65] text-ink-2">{project.description}</p>

          <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Built with">
            {project.tech.map((tech) => (
              <li key={tech} className="tag">
                {tech}
              </li>
            ))}
          </ul>

          <a
            href={`https://${project.link}`}
            target="_blank"
            rel="noreferrer"
            className="text-link mt-4 inline-flex items-center gap-1 self-start text-[0.9375rem]"
          >
            View source
            <ArrowUpRight className="h-4 w-4" aria-hidden />
          </a>
        </article>
      );
    })}
  </div>
);
