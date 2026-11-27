import type { McpServer } from "@modelcontextprotocol/server";
import * as content from "../../../src/data/content.js";
import { json, toolError } from "../http.js";
import { accessToken } from "../oauth.js";
import { cached } from "../redis.js";

const GITHUB_USER = process.env.GITHUB_USERNAME ?? "kayne-lee";

async function github<T>(path: string): Promise<T> {
  const headers: Record<string, string> = { accept: "application/vnd.github+json", "user-agent": "kayne-lee-mcp" };
  // Optional: a token only raises GitHub's rate limit. Everything read here is public.
  if (process.env.GITHUB_TOKEN) headers.authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  const res = await fetch(`https://api.github.com${path}`, { headers });
  if (!res.ok) throw new Error(`GitHub ${res.status}`);
  return res.json() as Promise<T>;
}

type Repo = {
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  pushed_at: string;
  fork: boolean;
};
type GhEvent = { type: string; repo: { name: string }; created_at: string; payload: { commits?: unknown[] } };

async function githubActivity() {
  const [repos, events] = await Promise.all([
    github<Repo[]>(`/users/${GITHUB_USER}/repos?sort=pushed&per_page=30`),
    github<GhEvent[]>(`/users/${GITHUB_USER}/events/public?per_page=100`),
  ]);
  const own = repos.filter((r) => !r.fork);

  const languages: Record<string, number> = {};
  for (const r of own) if (r.language) languages[r.language] = (languages[r.language] ?? 0) + 1;

  const monthAgo = Date.now() - 30 * 24 * 3600 * 1000;
  const recentPushes = events.filter((e) => e.type === "PushEvent" && Date.parse(e.created_at) > monthAgo);
  const activeRepos = [...new Set(recentPushes.map((e) => e.repo.name))];

  return {
    profile: `https://github.com/${GITHUB_USER}`,
    recentlyUpdatedRepos: own.slice(0, 8).map((r) => ({
      name: r.name,
      description: r.description,
      url: r.html_url,
      language: r.language,
      stars: r.stargazers_count,
      lastPushed: r.pushed_at,
    })),
    languagesByRepoCount: Object.fromEntries(Object.entries(languages).sort((a, b) => b[1] - a[1])),
    last30Days: {
      pushes: recentPushes.length,
      commits: recentPushes.reduce((n, e) => n + (e.payload.commits?.length ?? 0), 0),
      repos: activeRepos,
    },
  };
}

const spotifyToken = () =>
  accessToken({
    name: "spotify",
    tokenUrl: "https://accounts.spotify.com/api/token",
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    initialRefreshToken: process.env.SPOTIFY_REFRESH_TOKEN,
    basicAuth: true,
  });

type Track = { name: string; artists: { name: string }[]; external_urls: { spotify: string } };
const track = (t: Track) => ({ title: t.name, artist: t.artists.map((a) => a.name).join(", "), url: t.external_urls.spotify });

async function spotify<T>(token: string, path: string): Promise<T | null> {
  const res = await fetch(`https://api.spotify.com/v1${path}`, { headers: { authorization: `Bearer ${token}` } });
  // 204 is how Spotify says "nothing playing".
  if (res.status === 204) return null;
  if (!res.ok) throw new Error(`Spotify ${res.status}`);
  return res.json() as Promise<T>;
}

export function registerLiveTools(server: McpServer) {
  const liveRead = { readOnlyHint: true, openWorldHint: true };

  server.registerTool(
    "get_github_activity",
    {
      title: "GitHub activity",
      description:
        "Kayne's public GitHub: recently updated repos, languages used, and how active Kayne has been in the last 30 days.",
      annotations: liveRead,
    },
    async () => {
      try {
        return json(await cached("cache:github", 3600, githubActivity));
      } catch (e) {
        return toolError(`Couldn't reach GitHub right now (${(e as Error).message}). Try https://github.com/${GITHUB_USER}.`);
      }
    },
  );

  server.registerTool(
    "get_music",
    {
      title: "Music",
      description: "What Kayne is listening to: the current track on Spotify (if any), recent top tracks, and current favourites.",
      annotations: liveRead,
    },
    async () => {
      const favourites = content.current.music.map(({ title, artist }) => ({ title, artist }));
      const token = await spotifyToken();
      if (!token) return json({ favourites });
      try {
        const [nowPlaying, top] = await Promise.all([
          cached("cache:spotify:now", 30, async () => {
            const r = await spotify<{ is_playing: boolean; item: Track | null }>(token, "/me/player/currently-playing");
            return r?.is_playing && r.item ? track(r.item) : "nothing";
          }),
          cached("cache:spotify:top", 6 * 3600, async () => {
            const r = await spotify<{ items: Track[] }>(token, "/me/top/tracks?time_range=short_term&limit=10");
            return r?.items.map(track) ?? [];
          }),
        ]);
        return json({ nowPlaying: nowPlaying === "nothing" ? null : nowPlaying, topTracksLastMonth: top, favourites });
      } catch {
        return json({ favourites, note: "Spotify is unavailable right now." });
      }
    },
  );

  server.registerPrompt(
    "whats_new",
    { title: "What's Kayne up to?", description: "A quick catch-up on Kayne's recent work, code and music." },
    () => ({
      messages: [
        {
          role: "user" as const,
          content: {
            type: "text" as const,
            text:
              "Catch me up on what Kayne Lee has been up to lately. Use get_profile for current projects and reading, " +
              "get_github_activity for recent code, and get_music for what Kayne is listening to. Keep it short and casual.",
          },
        },
      ],
    }),
  );
}
