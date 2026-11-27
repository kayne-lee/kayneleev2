import { Redis } from "@upstash/redis";

/**
 * Upstash Redis, or null when it isn't configured. It's optional: it caches
 * GitHub and Spotify results, rate-limits the endpoint, and keeps Spotify's
 * rotated refresh token. Without it everything still works, just uncached
 * and unlimited.
 *
 * Accepts either UPSTASH_REDIS_REST_* or the KV_REST_API_* names that
 * Vercel's Upstash integration sets.
 */
export const redis =
  process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL ? Redis.fromEnv() : null;

/** Read through a Redis cache. Without Redis, always calls `load`. */
export async function cached<T>(key: string, ttlSeconds: number, load: () => Promise<T>): Promise<T> {
  if (!redis) return load();
  const hit = await redis.get<T>(key);
  if (hit !== null) return hit;
  const value = await load();
  await redis.set(key, value, { ex: ttlSeconds });
  return value;
}
