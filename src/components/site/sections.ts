/**
 * The site's sections, in reading order. Each one is its own page at `/<id>`.
 * Shared by the router, the header nav and the pager, so a link can never
 * point at a section that is not there.
 *
 * `orb` is the section's marker colours. They step through the same
 * dawn-to-dusk run as the field behind the site.
 */
export const SECTIONS = [
  {
    id: "experience",
    nav: "Experience",
    title: "Experience",
    note: "Where I've worked, newest first.",
    orb: ["hsl(200 100% 88%)", "hsl(var(--sky))", "hsl(var(--periwinkle))"],
  },
  {
    id: "education",
    nav: "Education",
    title: "Education",
    note: "Degree in progress at Queen's.",
    orb: ["hsl(var(--sky))", "hsl(var(--periwinkle))", "hsl(var(--iris))"],
  },
  {
    id: "projects",
    nav: "Projects",
    title: "Projects",
    note: "Things I've built and shipped.",
    orb: ["hsl(var(--periwinkle))", "hsl(var(--iris))", "hsl(var(--violet))"],
  },
  {
    id: "stack",
    nav: "Stack",
    title: "Tech stack",
    note: "20+ technologies I work with.",
    orb: ["hsl(var(--peach))", "hsl(var(--orchid))", "hsl(var(--violet))"],
  },
  {
    id: "now",
    nav: "Now",
    title: "Current focus",
    note: "What I'm building, reading, and training for right now.",
    orb: ["hsl(var(--orchid))", "hsl(var(--violet))", "hsl(var(--cobalt))"],
  },
  {
    id: "extracurriculars",
    nav: "Activities",
    title: "Extracurriculars",
    note: "Clubs and campus roles.",
    orb: ["hsl(var(--sky))", "hsl(var(--cobalt))", "hsl(var(--violet))"],
  },
  {
    id: "hobbies",
    nav: "Hobbies",
    title: "Hobbies",
    note: "Off the clock.",
    orb: ["hsl(var(--cobalt))", "hsl(var(--violet))", "hsl(232 50% 20%)"],
  },
] as const;

export type SectionId = (typeof SECTIONS)[number]["id"];

/**
 * Every page in order: the hero, each section, then contact. The pager walks
 * this list, and the gradient field takes its colour from a page's position
 * in it — dawn at the hero, dusk at contact.
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
