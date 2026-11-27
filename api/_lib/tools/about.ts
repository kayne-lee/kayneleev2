import type { McpServer } from "@modelcontextprotocol/server";
import { z } from "zod";
import * as content from "../../../src/data/content.js";
import { json } from "../http.js";

const SITE = process.env.SITE_URL ?? "https://kayneleev2.vercel.app";

const links = content.identity.links.map(({ short, href }) => ({ name: short, url: href }));

/** Strip the site-only fields (image keys, ids, tile labels) before handing data out. */
const job = ({ image, id, shortPeriod, ...rest }: content.Job) => rest;
const project = ({ image, id, short, ...rest }: content.Project) => ({
  ...rest,
  link: `https://${rest.link}`,
});

const matches = (needle: string | undefined, ...haystack: (string | undefined)[]) =>
  !needle || haystack.some((h) => h?.toLowerCase().includes(needle.toLowerCase()));

/** Kayne's resume as Markdown, built from the same data the site shows. */
export function resumeMarkdown(): string {
  const { identity, education, experience, projects, extracurriculars } = content;
  const lines = [
    `# ${identity.name}`,
    identity.headline,
    links.map((l) => `${l.name}: ${l.url}`).join(" | "),
    "",
    "## Education",
    `**${education.degree}**, ${education.school} (${education.start} to ${education.end})`,
    `Coursework: ${education.coursework.join(", ")}`,
    `Honors: ${education.honors.join("; ")}`,
    "",
    "## Experience",
  ];
  for (const j of experience) {
    lines.push(`### ${j.title}, ${j.company} (${j.period})${j.location ? `, ${j.location}` : ""}`);
    if (j.bullets) lines.push(...j.bullets.map((b) => `- ${b}`));
    if (j.description) lines.push(j.description);
    lines.push("");
  }
  lines.push("## Projects");
  for (const p of projects) {
    lines.push(`### ${p.title}`, `${p.tech.join(", ")} | https://${p.link}`, p.description, "");
  }
  lines.push("## Leadership and activities");
  for (const a of extracurriculars) {
    lines.push(`### ${a.title}, ${a.organization} (${a.period})`, a.description, "");
  }
  return lines.join("\n").trim();
}

export function registerAboutTools(server: McpServer) {
  const readOnly = { readOnlyHint: true, openWorldHint: false };

  server.registerTool(
    "get_profile",
    {
      title: "Kayne's profile",
      description:
        "Who Kayne Lee is: headline, education, links, hobbies, what Kayne is currently working on and reading. Start here for general questions about Kayne.",
      annotations: readOnly,
    },
    async () =>
      json({
        name: content.identity.name,
        headline: content.identity.headline,
        previously: content.identity.previously,
        website: SITE,
        links,
        education: content.education,
        hobbies: content.hobbies.map(({ title, description }) => ({ title, description })),
        alsoInto: content.alsoInto,
        currentlyWorkingOn: content.current.projects.map(({ id, ...p }) => p),
        currentlyReading: content.current.books.map(({ title, author, progress }) => ({
          title,
          author,
          percentRead: progress,
        })),
        focusAreas: content.current.focusAreas,
      }),
  );

  server.registerTool(
    "get_experience",
    {
      title: "Work experience",
      description:
        "Kayne's jobs and leadership roles, newest first. Optionally filter by a company name or a keyword such as a skill (\"LangGraph\", \"Azure\").",
      inputSchema: z.object({
        query: z.string().max(60).optional().describe("Company or keyword to filter by"),
      }),
      annotations: readOnly,
    },
    async ({ query }) =>
      json({
        jobs: content.experience
          .filter((j) => matches(query, j.company, j.title, j.description, ...(j.bullets ?? [])))
          .map(job),
        leadership: content.extracurriculars
          .filter((a) => matches(query, a.organization, a.title, a.description))
          .map(({ image, id, shortPeriod, ...rest }) => rest),
      }),
  );

  server.registerTool(
    "get_projects",
    {
      title: "Projects",
      description:
        "Kayne's personal projects with their tech stack and GitHub links. Optionally filter by a technology or keyword (\"Python\", \"AWS\").",
      inputSchema: z.object({
        tech: z.string().max(60).optional().describe("Technology or keyword to filter by"),
      }),
      annotations: readOnly,
    },
    async ({ tech }) =>
      json(content.projects.filter((p) => matches(tech, p.title, p.description, ...p.tech)).map(project)),
  );

  server.registerTool(
    "get_resume",
    {
      title: "Resume",
      description: "Kayne's full resume as Markdown: education, experience, projects and activities.",
      annotations: readOnly,
    },
    async () => ({ content: [{ type: "text" as const, text: resumeMarkdown() }] }),
  );

  server.registerTool(
    "get_status",
    {
      title: "Current status",
      description:
        "What kind of roles Kayne is open to right now and when Kayne is available to start. Check this before asking about hiring or internships.",
      annotations: readOnly,
    },
    async () => json(content.status),
  );

  server.registerTool(
    "faq",
    {
      title: "Frequently asked questions",
      description: "Answers Kayne has written to common questions, in Kayne's own words.",
      annotations: readOnly,
    },
    async () => json(content.faq),
  );
}
