import { Atom, Bot, Braces, Cloud, Cog, Database, Link, Monitor, RefreshCw, Server, Wind, Workflow, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
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
  /** The group's own glyph, shown in its (smooth, grain-free) disc. */
  icon: LucideIcon;
  /** Disc gradient, from and to. */
  orb: [string, string];
  /** Tiles per row inside the card (Tailwind class). */
  cols: string;
  skills: Skill[];
};

/* Groups and order mirror the stack on the GitHub profile README. */
const categories: Category[] = [
  {
    title: "Languages",
    icon: Braces,
    orb: ["hsl(var(--sky))", "hsl(var(--cobalt))"],
    cols: "grid-cols-3 min-[380px]:grid-cols-4",
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
    icon: Monitor,
    orb: ["hsl(var(--periwinkle))", "hsl(var(--violet))"],
    cols: "grid-cols-3 xl:grid-cols-5",
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
    icon: Server,
    orb: ["hsl(var(--iris))", "hsl(var(--field-indigo))"],
    cols: "grid-cols-3",
    skills: [
      { name: "FastAPI", icon: "logos:fastapi-icon" },
      { name: "Django", icon: "logos:django-icon" },
      { name: "Node.js", icon: "logos:nodejs-icon" },
    ],
  },
  {
    title: "Databases",
    icon: Database,
    orb: ["hsl(var(--sky))", "hsl(var(--violet))"],
    cols: "grid-cols-3",
    skills: [
      { name: "PostgreSQL", icon: "logos:postgresql" },
      { name: "MongoDB", icon: "logos:mongodb-icon" },
      { name: "Supabase", fallback: Database },
    ],
  },
  {
    title: "Agents",
    icon: Bot,
    orb: ["hsl(var(--orchid))", "hsl(var(--violet))"],
    cols: "grid-cols-3",
    skills: [
      { name: "LangGraph", fallback: Workflow },
      { name: "LangChain", fallback: Link },
      { name: "PyTorch", icon: "logos:pytorch-icon" },
    ],
  },
  {
    title: "Infra",
    icon: Cloud,
    orb: ["hsl(var(--peach))", "hsl(var(--field-orchid))"],
    cols: "grid-cols-3 xl:grid-cols-5",
    skills: [
      { name: "AWS", icon: "logos:aws" },
      { name: "Azure", icon: "logos:azure-icon" },
      { name: "Docker", icon: "logos:docker-icon" },
      { name: "Kubernetes", icon: "logos:kubernetes" },
      { name: "CI/CD", fallback: RefreshCw },
    ],
  },
];

/** One tool: its logo over its name. Tiles stretch to share the card's height. */
const TechTile = ({ skill }: { skill: Skill }) => {
  const Fallback = skill.fallback;
  return (
    <li className="flex min-h-[4.25rem] flex-col items-center justify-center gap-1.5 rounded-2xl bg-chalk px-1 py-2.5 text-center">
      {skill.icon ? (
        <img src={iconUrl(skill.icon)} alt="" width={28} height={28} loading="lazy" decoding="async" className="h-7 w-7 object-contain" />
      ) : Fallback ? (
        <Fallback className="h-7 w-7 text-ink-2" strokeWidth={1.6} aria-hidden />
      ) : null}
      <span className="text-[0.75rem] font-medium leading-tight text-ink">{skill.name}</span>
    </li>
  );
};

/**
 * Six cards in a 2 x 3 grid that fills the sheet. Rows are weighted by how
 * many tools they hold, so the two-row cards (Languages) get the height and
 * nothing is left empty at the bottom.
 */
const TechStack = () => (
  <div className="grid flex-1 gap-4 sm:grid-cols-2 xl:grid-rows-[1.7fr_1fr_1fr] lg:gap-5">
    {categories.map((category) => {
      const Icon = category.icon;
      return (
        <section
          key={category.title}
          className="flex flex-col rounded-[1.75rem] bg-white p-4 shadow-[0_0_0_1px_hsl(var(--ink-1)/0.07)] sm:p-5"
        >
          <header className="flex items-center gap-3">
            <span
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
              style={{ background: `linear-gradient(140deg, ${category.orb[0]}, ${category.orb[1]})` }}
            >
              <Icon className="h-5 w-5 text-white" aria-hidden />
            </span>
            <h3 className="font-display text-xl font-semibold tracking-[-0.01em] text-ink">{category.title}</h3>
            <span className="ml-auto text-sm tabular-nums text-ink-3">{category.skills.length}</span>
          </header>

          <ul className={cn("mt-3.5 grid flex-1 auto-rows-fr gap-2", category.cols)}>
            {category.skills.map((skill) => (
              <TechTile key={skill.name} skill={skill} />
            ))}
          </ul>
        </section>
      );
    })}
  </div>
);

export default TechStack;
