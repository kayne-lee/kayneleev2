import { Redis } from "@upstash/redis";

/**
 * Upstash Redis, or null when it isn't configured. Read-only tools still work
 * without it (just uncached and unlimited); anything that sends email or
 * touches the calendar refuses to run without it, since that's where the rate
 * limits and pending requests live.
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
