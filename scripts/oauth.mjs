#!/usr/bin/env node
/**
 * One-time sign-in to get a refresh token for one of your own accounts, so the
 * MCP server can act as you later. Run it locally, sign in in the browser, and
 * paste the printed refresh token into the matching Vercel env var.
 *
 *   SPOTIFY_CLIENT_ID=... SPOTIFY_CLIENT_SECRET=... node scripts/oauth.mjs spotify
 *
 * The redirect URI printed below must be registered on the app first.
 */
import { createServer } from "node:http";
import { randomBytes } from "node:crypto";

const PORT = 8787;

const providers = {
  spotify: {
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    // Spotify only accepts the loopback IP for http redirects, not "localhost".
    redirectUri: `http://127.0.0.1:${PORT}/callback`,
    authorizeUrl: "https://accounts.spotify.com/authorize",
    tokenUrl: "https://accounts.spotify.com/api/token",
    scope: "user-read-currently-playing user-top-read",
    envVar: "SPOTIFY_REFRESH_TOKEN",
  },
};

const name = process.argv[2];
const p = providers[name];
if (!p) {
  console.error(`Usage: node scripts/oauth.mjs <${Object.keys(providers).join("|")}>`);
  process.exit(1);
}
if (!p.clientId || !p.clientSecret) {
  console.error(`Set the client id and secret env vars for ${name} first (see MCP.md).`);
  process.exit(1);
}

const state = randomBytes(16).toString("hex");
const url = new URL(p.authorizeUrl);
url.search = new URLSearchParams({
  client_id: p.clientId,
  response_type: "code",
  redirect_uri: p.redirectUri,
  scope: p.scope,
  state,
  ...p.authorizeExtra,
}).toString();

const server = createServer(async (req, res) => {
  const got = new URL(req.url, p.redirectUri);
  if (got.pathname !== "/callback") return res.writeHead(404).end();
  if (got.searchParams.get("state") !== state) return res.writeHead(400).end("State mismatch, try again.");

  const tokenRes = await fetch(p.tokenUrl, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code: got.searchParams.get("code") ?? "",
      redirect_uri: p.redirectUri,
      client_id: p.clientId,
      client_secret: p.clientSecret,
      ...p.tokenExtra,
    }),
  });
  const body = await tokenRes.json();
  if (!body.refresh_token) {
    res.end("No refresh token came back. Check the terminal.");
    console.error(body);
  } else {
    res.end("Done. You can close this tab.");
    console.log(`\n${p.envVar}=${body.refresh_token}\n`);
    console.log("Add that to your Vercel project's environment variables. Don't commit it.");
  }
  server.close();
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`Redirect URI to register on the app: ${p.redirectUri}`);
  console.log(`\nOpen this to sign in:\n${url}\n`);
});
