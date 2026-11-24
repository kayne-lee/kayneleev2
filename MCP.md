# MCP server

The site serves an MCP server at `/api/mcp`. Anyone can add it to Claude (or any client that supports Streamable HTTP) with:

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
| `get_music` | Now playing and top tracks on Spotify | Spotify |
| `get_availability` | Open call slots from your Outlook calendar | contact pipeline |
| `book_meeting` | Request a call (verified, then approved by you) | contact pipeline |
| `send_message` | Send you a note (verified, then lands in your inbox) | contact pipeline |

It also has resources (your resume and each project as a document) and three prompts (`intro`, `get_in_touch`, `whats_new`).

Everything in the first six tools comes from `src/data/content.ts`, the same file the site renders. Edit `status` and `faq` at the bottom of that file to keep them current.

Booking hours, slot length and abuse limits are in `api/_lib/config.ts`.

## How booking stays spam-free

A request has to get through four gates before it reaches your calendar:

1. **Submit checks.** Real mail domain (MX lookup, disposable domains refused), not on your blocklist, and under the limits: 3 requests per IP and per email per day, 30 verification emails a day in total, 10 pending requests at most, 4 meetings a week.
2. **Email verification.** The requester gets a link at the address they gave. Nothing happens until they click it.
3. **Turnstile.** The confirm page has a Cloudflare human check, so a bot holding the link still can't finish.
4. **Your approval.** You get an email with a Review button. Only Approve sends a calendar invite. Decline sends them a short note. Block stops that address for good and says nothing.

Messages skip step 4: once verified, they land in your inbox with Reply-To set to the sender, and the email has a Block button.

Links in emails open a page with a button, and only the button does anything. Outlook Safe Links and other scanners open every link in an email, so a link that acted on its own would confirm requests nobody approved.

## Setup

Read-only tools work with no setup at all. For the rest, add these in Vercel → Project → Settings → Environment Variables, then redeploy.

### 1. Upstash Redis

Vercel → Storage (Marketplace) → Upstash Redis → connect it to this project. It sets `KV_REST_API_URL` and `KV_REST_API_TOKEN` for you. This holds the rate limits, pending requests, caches and rotated OAuth tokens.

### 2. Outlook (Microsoft Graph)

1. Go to https://entra.microsoft.com → App registrations → New registration.
   - Supported account types: **Personal Microsoft accounts only**.
   - Redirect URI: platform **Web**, `http://localhost:8787/callback`.
2. Certificates & secrets → New client secret. Copy the value.
3. API permissions → Add → Microsoft Graph → Delegated: `Calendars.ReadWrite`, `Mail.Send`, `User.Read`, `offline_access`.
4. Get a refresh token by signing in once as yourself:

```bash
MS_CLIENT_ID=<application id> MS_CLIENT_SECRET=<secret> node scripts/oauth.mjs microsoft
```

Set `MS_CLIENT_ID`, `MS_CLIENT_SECRET` and the printed `MS_REFRESH_TOKEN` in Vercel.

Client secrets expire (24 months at most). Put a reminder in your calendar for when yours does.

### 3. Cloudflare Turnstile

Cloudflare dashboard → Turnstile → Add widget. Hostname: `kayneleev2.vercel.app` (and your custom domain if you add one). Mode: Managed. Set `TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY`.

### 4. The rest of the contact pipeline

| Variable | Value |
| --- | --- |
| `OWNER_EMAIL` | Where review emails go (your Outlook address) |
| `REVIEW_SECRET` | Random string that signs review links: `openssl rand -hex 32` |
| `SITE_URL` | `https://kayneleev2.vercel.app` (or your custom domain) |
| `MEETING_URL` | Optional. A standing video link put in every invite. Without it the invite says you'll send one. |

Booking stays off until all of Redis, Outlook, Turnstile, `OWNER_EMAIL` and `REVIEW_SECRET` are set. Until then the tools tell callers to email you instead.

### 5. Spotify (optional)

1. https://developer.spotify.com/dashboard → Create app. Redirect URI: `http://127.0.0.1:8787/callback`. API: Web API.
2. Sign in once:

```bash
SPOTIFY_CLIENT_ID=<id> SPOTIFY_CLIENT_SECRET=<secret> node scripts/oauth.mjs spotify
```

Set `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET` and `SPOTIFY_REFRESH_TOKEN`. Without them, `get_music` just returns the favourites from the site.

### 6. GitHub (optional)

`GITHUB_TOKEN`: a fine-grained token with no extra permissions. It only raises GitHub's rate limit; everything read is public.

## Trying it locally

`vercel dev` runs the site and the functions together. Then point the MCP Inspector at it:

```bash
npx @modelcontextprotocol/inspector
```

and connect to `http://localhost:3000/api/mcp`.
