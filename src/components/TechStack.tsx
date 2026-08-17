import { Boxes, Database } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { GlassPane } from "@/components/glass/GlassPane";
import { cn } from "@/lib/utils";

type Skill = {
  name: string;
  /** Iconify slug, e.g. "logos:python". Omit when no clean logo exists. */
  icon?: string;
  /** Fallback lucide glyph for skills without a logo. */
  fallback?: LucideIcon;
};

type Category = {
  title: string;
  /** Tailwind grid-span classes for the bento layout. */
  span?: string;
  skills: Skill[];
};

const categories: Category[] = [
  {
    title: "Languages",
    span: "sm:col-span-2",
    skills: [
      { name: "Python", icon: "logos:python" },
      { name: "C", icon: "logos:c" },
      { name: "C++", icon: "logos:c-plusplus" },
      { name: "C#", icon: "logos:c-sharp" },
      { name: "Java", icon: "logos:java" },
      { name: "JavaScript", icon: "logos:javascript" },
      { name: "TypeScript", icon: "logos:typescript-icon" },
      { name: "Ruby", icon: "logos:ruby" },
      { name: "SQL", fallback: Database },
    ],
  },
  {
    title: "AI & ML",
    /* Spans both rows so the Frameworks row does not leave a hole. */
    span: "sm:row-span-2",
    skills: [
      { name: "PyTorch", icon: "logos:pytorch-icon" },
      { name: "LangChain", fallback: Boxes },
      { name: "LangGraph", fallback: Boxes },
    ],
  },
  {
    title: "Frameworks",
    span: "sm:col-span-2",
    skills: [
      { name: "React", icon: "logos:react" },
      { name: "Next.js", icon: "logos:nextjs-icon" },
      { name: "Node.js", icon: "logos:nodejs-icon" },
      { name: "Django", icon: "logos:django-icon" },
      { name: "FastAPI", icon: "logos:fastapi-icon" },
      { name: "Spring Boot", icon: "logos:spring-icon" },
      { name: ".NET", icon: "logos:dotnet" },
    ],
  },
  {
    title: "Cloud & tools",
    span: "sm:col-span-3",
    skills: [
      { name: "AWS", icon: "logos:aws" },
      { name: "Azure", icon: "logos:azure-icon" },
      { name: "Docker", icon: "logos:docker-icon" },
      { name: "Kubernetes", icon: "logos:kubernetes" },
      { name: "Git", icon: "logos:git-icon" },
      { name: "PostgreSQL", icon: "logos:postgresql" },
      { name: "MongoDB", icon: "logos:mongodb-icon" },
      { name: "Elasticsearch", icon: "logos:elasticsearch" },
      { name: "CI/CD", fallback: Boxes },
    ],
  },
];

/** Logo in its own recessed slot, so every mark sits at the same depth. */
const TechChip = ({ skill }: { skill: Skill }) => {
  const Fallback = skill.fallback;
  return (
    <span className="glass-chip gap-2 py-1.5 pl-1.5 pr-3 text-sm">
      <span className="glass-well flex h-6 w-6 items-center justify-center rounded-lg">
        {skill.icon ? (
          <img src={`https://api.iconify.design/${skill.icon}.svg`} alt="" loading="lazy" className="h-3.5 w-3.5" />
        ) : Fallback ? (
          <Fallback className="h-3.5 w-3.5 text-ink-3" />
        ) : null}
      </span>
      {skill.name}
    </span>
  );
};

const TechStack = () => (
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
    {categories.map((category) => (
      <GlassPane key={category.title} depth={3} className={cn("p-5", category.span)}>
        <p className="eyebrow">{category.title}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {category.skills.map((skill) => (
            <TechChip key={skill.name} skill={skill} />
          ))}
        </div>
      </GlassPane>
    ))}
  </div>
);

export default TechStack;
