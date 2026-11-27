import type { McpServer } from "@modelcontextprotocol/server";
import * as content from "../../../src/data/content.js";
import { resumeMarkdown } from "./about.js";

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

/** Documents a client can attach to a conversation, and ready-made prompt starters. */
export function registerResourcesAndPrompts(server: McpServer) {
  server.registerResource(
    "resume",
    "kayne://resume",
    { title: "Kayne Lee's resume", description: "Full resume as Markdown", mimeType: "text/markdown" },
    async (uri) => ({ contents: [{ uri: uri.href, mimeType: "text/markdown", text: resumeMarkdown() }] }),
  );

  for (const p of content.projects) {
    server.registerResource(
      `project-${slug(p.short)}`,
      `kayne://projects/${slug(p.short)}`,
      { title: p.title, description: `Project write-up: ${p.short}`, mimeType: "text/markdown" },
      async (uri) => ({
        contents: [
          {
            uri: uri.href,
            mimeType: "text/markdown",
            text: `# ${p.title}\n\n**Stack:** ${p.tech.join(", ")}\n**Code:** https://${p.link}\n\n${p.description}`,
          },
        ],
      }),
    );
  }

  server.registerPrompt(
    "intro",
    {
      title: "Introduce Kayne",
      description: "A short spoken-style introduction to Kayne Lee.",
    },
    () => ({
      messages: [
        {
          role: "user" as const,
          content: {
            type: "text" as const,
            text:
              "Using the get_profile, get_experience and get_status tools, give me a two-minute introduction to Kayne Lee: " +
              "who Kayne is, the most impressive work so far, and what Kayne is looking for next. Keep it conversational.",
          },
        },
      ],
    }),
  );
}
