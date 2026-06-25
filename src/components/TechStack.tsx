import { Sparkles, Database, Boxes } from "lucide-react";
import type { LucideIcon } from "lucide-react";
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
  featured?: boolean;
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
    featured: true,
    span: "lg:row-span-2",
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
    title: "Cloud & Tools",
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

const TechChip = ({ skill }: { skill: Skill }) => {
  const Fallback = skill.fallback;
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/60 px-3 py-1.5 text-sm transition-smooth hover:scale-105 hover:border-accent">
      {skill.icon ? (
        <img
          src={`https://api.iconify.design/${skill.icon}.svg`}
          alt={skill.name}
          loading="lazy"
          className="h-4 w-4"
        />
      ) : Fallback ? (
        <Fallback className="h-4 w-4 text-accent" />
      ) : null}
      {skill.name}
    </span>
  );
};

const TechStack = () => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {categories.map((category) => (
        <div
          key={category.title}
          className={cn(
            "block-3d border border-border bg-card p-5",
            category.span,
            category.featured &&
              "bg-gradient-to-br from-accent/10 to-transparent ring-1 ring-accent/40",
          )}
        >
          <div className="mb-4 flex items-center gap-2">
            <h3 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
              {category.title}
            </h3>
            {category.featured && <Sparkles className="h-4 w-4 text-accent" />}
          </div>
          <div className="flex flex-wrap gap-2">
            {category.skills.map((skill) => (
              <TechChip key={skill.name} skill={skill} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TechStack;
