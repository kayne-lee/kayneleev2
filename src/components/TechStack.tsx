import { Atom, Cog, Database, Link, RefreshCw, Wind, Workflow, Zap } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { iconUrl } from "@/assets/icons";

type Skill = {
  name: string;
  /** Iconify slug, e.g. "logos:python". Omit when no clean logo exists. */
  icon?: string;
  /** Fallback lucide glyph for skills without a logo. */
  fallback?: LucideIcon;
};

type Category = {
  title: string;
  skills: Skill[];
};

/* Groups and order mirror the stack on the GitHub profile README. */
const categories: Category[] = [
  {
    title: "Languages",
    skills: [
      { name: "Python", icon: "logos:python" },
      { name: "TypeScript", icon: "logos:typescript-icon" },
      { name: "JavaScript", icon: "logos:javascript" },
      { name: "Rust", fallback: Cog },
      { name: "C++", icon: "logos:c-plusplus" },
      { name: "C#", icon: "logos:c-sharp" },
      { name: "Java", icon: "logos:java" },
      { name: "SQL", fallback: Database },
    ],
  },
  {
    title: "Frontend",
    skills: [
      { name: "React", icon: "logos:react" },
      { name: "Next.js", icon: "logos:nextjs-icon" },
      { name: "Tailwind CSS", fallback: Wind },
      { name: "Redux", fallback: Atom },
      { name: "Vite", fallback: Zap },
    ],
  },
  {
    title: "Backend",
    skills: [
      { name: "FastAPI", icon: "logos:fastapi-icon" },
      { name: "Django", icon: "logos:django-icon" },
      { name: "Node.js", icon: "logos:nodejs-icon" },
    ],
  },
  {
    title: "Databases",
    skills: [
      { name: "PostgreSQL", icon: "logos:postgresql" },
      { name: "MongoDB", icon: "logos:mongodb-icon" },
      { name: "Supabase", fallback: Database },
    ],
  },
  {
    title: "Agents",
    skills: [
      { name: "LangGraph", fallback: Workflow },
      { name: "LangChain", fallback: Link },
      { name: "PyTorch", icon: "logos:pytorch-icon" },
    ],
  },
  {
    title: "Infra",
    skills: [
      { name: "AWS", icon: "logos:aws" },
      { name: "Azure", icon: "logos:azure-icon" },
      { name: "Docker", icon: "logos:docker-icon" },
      { name: "Kubernetes", icon: "logos:kubernetes" },
      { name: "CI/CD", fallback: RefreshCw },
    ],
  },
];

/** One tool: a tiny logo beside its name. */
const TechItem = ({ skill }: { skill: Skill }) => {
  const Fallback = skill.fallback;
  return (
    <li className="flex items-center gap-2">
      <span className="flex h-3.5 w-3.5 shrink-0 items-center justify-center">
        {skill.icon ? (
          <img src={iconUrl(skill.icon)} alt="" width={14} height={14} loading="lazy" decoding="async" className="logo h-3.5 w-3.5 object-contain" />
        ) : Fallback ? (
          <Fallback className="h-3.5 w-3.5 text-ink-3" strokeWidth={1.75} aria-hidden />
        ) : null}
      </span>
      {skill.name}
    </li>
  );
};

/** Each group: a bold label over its tools, two columns of groups. */
const TechStack = () => (
  <div className="grid grid-cols-2 gap-x-10 gap-y-8 sm:grid-cols-3">
    {categories.map((category) => (
      <section key={category.title}>
        <h3>{category.title}</h3>
        <ul className="mt-2 space-y-1">
          {category.skills.map((skill) => (
            <TechItem key={skill.name} skill={skill} />
          ))}
        </ul>
      </section>
    ))}
  </div>
);

export default TechStack;
