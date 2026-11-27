import { redis } from "./redis.js";

type Provider = {
  /** Redis key prefix, e.g. "spotify". */
  name: string;
  tokenUrl: string;
  clientId: string | undefined;
  clientSecret: string | undefined;
  /** The refresh token from the one-time setup script (scripts/oauth.mjs). */
  initialRefreshToken: string | undefined;
  /** Extra form fields the provider wants on a refresh, like `scope`. */
  extra?: Record<string, string>;
  /** Spotify wants the client credentials as Basic auth instead of form fields. */
  basicAuth?: boolean;
};

/**
 * A valid access token for one of Kayne's own accounts, refreshed as needed.
 *
 * Spotify may hand back a new refresh token on a refresh, so the newest one
 * is kept in Redis and the env var is only the starting point. Without Redis this
 * still works, it just refreshes on every call and can't save a rotated token.
 */
export async function accessToken(p: Provider): Promise<string | null> {
  if (!p.clientId || !p.clientSecret || !p.initialRefreshToken) return null;

  const accessKey = `oauth:${p.name}:access`;
  const refreshKey = `oauth:${p.name}:refresh`;
  const cachedAccess = await redis?.get<string>(accessKey);
  if (cachedAccess) return cachedAccess;

  const refreshToken = (await redis?.get<string>(refreshKey)) ?? p.initialRefreshToken;
  const form = new URLSearchParams({ grant_type: "refresh_token", refresh_token: refreshToken, ...p.extra });
  const headers: Record<string, string> = { "content-type": "application/x-www-form-urlencoded" };
  if (p.basicAuth) {
    headers.authorization = `Basic ${Buffer.from(`${p.clientId}:${p.clientSecret}`).toString("base64")}`;
  } else {
    form.set("client_id", p.clientId);
    form.set("client_secret", p.clientSecret);
  }

  const res = await fetch(p.tokenUrl, { method: "POST", headers, body: form });
  if (!res.ok) {
    console.error(`[oauth:${p.name}] refresh failed`, res.status, await res.text());
    return null;
  }
  const body = (await res.json()) as { access_token: string; expires_in: number; refresh_token?: string };
  // Refresh a minute early so a token never expires mid-request.
  await redis?.set(accessKey, body.access_token, { ex: Math.max(60, body.expires_in - 60) });
  if (body.refresh_token) await redis?.set(refreshKey, body.refresh_token);
  return body.access_token;
}
