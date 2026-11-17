import { projects } from "@/data/portfolio";

export const ProjectsSection = () => (
  <div>
    {projects.map((project) => (
      <article key={project.id} className="border-t border-line py-8 first:border-t-0 first:pt-0 last:pb-0">
        <div className="flex items-center gap-3">
          <img
            src={project.image.img.src}
            srcSet={project.image.sources.webp}
            sizes="48px"
            width={project.image.img.w}
            height={project.image.img.h}
            alt={`Screenshot of ${project.short}`}
            loading="lazy"
            decoding="async"
            className="h-9 w-12 shrink-0 rounded bg-white object-cover object-top ring-1 ring-line"
          />
          <h3 className="min-w-0 flex-1">{project.title}</h3>
        </div>
        <p className="mt-3">{project.description}</p>
        <p className="em mt-2">{project.tech.join(" · ")}</p>
        <a href={`https://${project.link}`} target="_blank" rel="noreferrer" className="text-link mt-2">
          View source →
        </a>
      </article>
    ))}
  </div>
);
