import { ArrowUpRight } from "lucide-react";
import { RecordCard } from "@/components/sections/RecordCard";
import { GlassChip } from "@/components/glass/GlassChip";
import { projects } from "@/data/portfolio";

export const ProjectsSection = () => (
  <div className="space-y-4">
    {projects.map((project) => (
      <RecordCard key={project.id} image={project.image} title={project.title} body={project.description}>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {project.tech.map((tech) => (
            <GlassChip key={tech}>{tech}</GlassChip>
          ))}
        </div>

        <a
          href={`https://${project.link}`}
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-flex items-center gap-1 font-mono text-[0.6875rem] uppercase tracking-[0.1em] text-[hsl(var(--accent))] transition-opacity hover:opacity-70"
        >
          View source
          <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
        </a>
      </RecordCard>
    ))}
  </div>
);
