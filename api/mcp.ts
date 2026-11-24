/**
 * The site's MCP server, at /api/mcp. Point any MCP client that speaks
 * Streamable HTTP at https://<site>/api/mcp.
 *
 * Stateless: every request builds a fresh server, so it runs as a plain
 * Vercel Function with nothing kept between calls.
 */
import { Ratelimit } from "@upstash/ratelimit";
import { createMcpHandler } from "mcp-handler";
import { clientIp } from "./_lib/http.js";
import { redis } from "./_lib/redis.js";
import { registerAboutTools } from "./_lib/tools/about.js";

const mcp = createMcpHandler(
  (server) => {
    registerAboutTools(server);
  },
  {
    serverInfo: { name: "kayne-lee", version: "1.0.0" },
    instructions:
      "Tools for learning about Kayne Lee (a Computer Engineering student at Queen's University) and getting in touch. " +
      "Everything here is public information from Kayne's website.",
  },
);

/** A loose per-IP ceiling on the whole endpoint, so nobody can hammer it. */
const limiter = redis
  ? new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(120, "10 m"), prefix: "rl:mcp" })
  : null;

async function handler(req: Request): Promise<Response> {
  if (limiter) {
    const { success } = await limiter.limit(clientIp(req));
    if (!success) return new Response("Too many requests", { status: 429 });
  }
  return mcp(req);
}

export { handler as GET, handler as POST, handler as DELETE };
