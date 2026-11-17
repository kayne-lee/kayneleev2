/**
 * The site's sections, in reading order. Each one has its own URL at
 * `/<id>`, which scrolls to it. Shared by the router and the header nav, so a
 * link can never point at a section that is not there.
 */
export const SECTIONS = [
  {
    id: "experience",
    nav: "Experience",
    title: "Experience",
    note: "Where I've worked, newest first.",
  },
  {
    id: "education",
    nav: "Education",
    title: "Education",
    note: "Degree in progress at Queen's.",
  },
  {
    id: "projects",
    nav: "Projects",
    title: "Projects",
    note: "Things I've built and shipped.",
  },
  {
    id: "stack",
    nav: "Stack",
    title: "Tech stack",
    note: "20+ technologies I work with.",
  },
  {
    id: "now",
    nav: "Now",
    title: "Current focus",
    note: "What I'm building, reading, and training for right now.",
  },
  {
    id: "extracurriculars",
    nav: "Activities",
    title: "Extracurriculars",
    note: "Clubs and campus roles.",
  },
  {
    id: "hobbies",
    nav: "Hobbies",
    title: "Hobbies",
    note: "Off the clock.",
  },
] as const;

export type SectionId = (typeof SECTIONS)[number]["id"];

/**
 * Every page in order: the hero, each section, then contact. The scroll-spy
 * keeps the URL on whichever of these is in view.
 */
export const VIEWS = [
  { id: "home", path: "/", label: "Home" },
  ...SECTIONS.map((section) => ({ id: section.id, path: `/${section.id}`, label: section.title })),
  { id: "contact", path: "/contact", label: "Get in touch" },
] as const;

/** Position of the current path in VIEWS, or -1 for an unknown path. */
export const viewIndex = (pathname: string) => {
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  return VIEWS.findIndex((view) => view.path === path);
};
