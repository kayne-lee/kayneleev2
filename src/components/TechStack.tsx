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

const TechChip = ({ skill }: { skill: Skill }) => {
  const Fallback = skill.fallback;
  return (
    <li className="tag tag-solid !gap-2 !py-1.5 !pl-2 !pr-3.5 !text-[0.9375rem] text-ink">
      <span className="flex h-5 w-5 items-center justify-center">
        {skill.icon ? (
          <img src={iconUrl(skill.icon)} alt="" width={18} height={18} loading="lazy" decoding="async" className="h-[1.125rem] w-[1.125rem] object-contain" />
        ) : Fallback ? (
          <Fallback className="h-4 w-4 text-ink-3" />
        ) : null}
      </span>
      {skill.name}
    </li>
  );
};

/** Six groups as rows: the group name on the left, its tools on the right. */
const TechStack = () => (
  <div>
    {categories.map((category) => (
      <div
        key={category.title}
        className="grid gap-3 border-t border-ink/10 py-6 first:border-t-0 first:pt-0 last:pb-0 sm:grid-cols-[9.5rem_1fr] sm:gap-6"
      >
        <h3 className="font-display text-xl font-semibold tracking-[-0.02em] text-ink sm:pt-1">{category.title}</h3>
        <ul className="flex flex-wrap gap-2">
          {category.skills.map((skill) => (
            <TechChip key={skill.name} skill={skill} />
          ))}
        </ul>
      </div>
    ))}
  </div>
);

export default TechStack;
