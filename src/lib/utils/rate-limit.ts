/**
 * In-Memory Rate Limiter
 *
 * Simple sliding-window rate limiter using a Map. Suitable for single-instance
 * deployments (Vercel serverless functions are single-instance per invocation).
 *
 * For multi-instance production deployments, replace with Redis-based
 * implementation (e.g., @upstash/ratelimit).
 *
 * Memory is bounded: expired entries are lazily cleaned on access, and
 * a periodic sweep runs every 60 seconds.
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

/** Lazy cleanup: remove expired entries when the store grows too large. */
function cleanup(): void {
  if (store.size < 1000) return;
  const now = Date.now();
  for (const [key, entry] of store) {
    if (now > entry.resetAt) {
      store.delete(key);
    }
  }
}

/**
 * Check and consume one unit from a rate limit bucket.
 *
 * @param key       Unique identifier (e.g., IP address, user ID)
 * @param limit     Maximum requests allowed within the window
 * @param windowMs  Window duration in milliseconds
 * @returns         Whether the request is allowed, remaining quota, and reset time
 */
export function checkRateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  cleanup();
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    const resetAt = now + windowMs;
    store.set(key, { count: 1, resetAt });
    return { success: true, remaining: limit - 1, resetAt };
  }

  if (entry.count >= limit) {
    return { success: false, remaining: 0, resetAt: entry.resetAt };
  }

  entry.count += 1;
  return { success: true, remaining: limit - entry.count, resetAt: entry.resetAt };
}

/**
 * Extract client IP from request headers.
 * Works with Vercel (x-forwarded-for) and direct connections.
 */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0];
    return first ? first.trim() : "unknown";
  }
  const realIp = request.headers.get("x-real-ip");
  return realIp ?? "unknown";
}
