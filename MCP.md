# MCP server

The site serves a read-only MCP server at `/api/mcp`. Anyone can add it to Claude (or any client that supports Streamable HTTP) with:

```
https://kayneleev2.vercel.app/api/mcp
```

In Claude: Settings → Connectors → Add custom connector, then paste that URL.

## What's on it

| Tool | What it does | Needs |
| --- | --- | --- |
| `get_profile` | Headline, education, links, hobbies, current projects and reading | nothing |
| `get_experience` | Jobs and leadership roles, filterable by keyword | nothing |
| `get_projects` | Projects with stack and links, filterable by tech | nothing |
| `get_resume` | Full resume as Markdown | nothing |
| `get_status` | What roles you're open to right now | nothing |
| `faq` | Your answers to common questions | nothing |
| `get_github_activity` | Recent repos, languages, last 30 days of pushes | optional `GITHUB_TOKEN` |
| `get_music` | Now playing and top tracks on Spotify | optional Spotify setup |

It also has resources (your resume and each project as a document) and two prompts (`intro`, `whats_new`).

Every tool only reads. Nothing on the server sends email, writes anywhere or touches a calendar.

The first six tools come from `src/data/content.ts`, the same file the site renders. Edit `status` and `faq` at the bottom of that file to keep them current.

## Optional setup

Everything works with no setup. These make it better. Add them in Vercel → Project → Settings → Environment Variables, then redeploy.

### Upstash Redis

Vercel → Storage (Marketplace) → Upstash Redis → connect it to this project. It sets `KV_REST_API_URL` and `KV_REST_API_TOKEN`. With it, GitHub and Spotify results are cached, the endpoint is rate-limited to 120 requests per IP per 10 minutes, and Spotify's refresh token is kept current.

### Spotify

1. https://developer.spotify.com/dashboard → Create app. Redirect URI: `http://127.0.0.1:8787/callback`. API: Web API.
2. Sign in once:

```bash
SPOTIFY_CLIENT_ID=<id> SPOTIFY_CLIENT_SECRET=<secret> node scripts/oauth.mjs spotify
```

Set `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET` and the printed `SPOTIFY_REFRESH_TOKEN`. Without them, `get_music` just returns the favourites from the site.

### GitHub

`GITHUB_TOKEN`: a fine-grained token with no extra permissions. It only raises GitHub's rate limit; everything read is public.

## Trying it locally

```bash
vercel dev
```

That serves the site and the function on `http://localhost:3000`. Then:

```bash
npx @modelcontextprotocol/inspector
```

Add a server with transport Streamable HTTP and URL `http://localhost:3000/api/mcp`, and connect.
