interface RateLimitEntry {
  count: number
  resetAt: number
}

interface RateLimitOptions {
  limit: number
  windowMs: number
}

interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetAt: number
}

declare global {
  var __portfolioRateLimitStore: Map<string, RateLimitEntry> | undefined
}

const rateLimitStore =
  globalThis.__portfolioRateLimitStore ?? new Map<string, RateLimitEntry>()

if (!globalThis.__portfolioRateLimitStore) {
  globalThis.__portfolioRateLimitStore = rateLimitStore
}

function pruneExpiredEntries(now: number): void {
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetAt <= now) {
      rateLimitStore.delete(key)
    }
  }
}

export function checkRateLimit(
  identifier: string,
  options: RateLimitOptions
): RateLimitResult {
  const now = Date.now()
  pruneExpiredEntries(now)

  const existingEntry = rateLimitStore.get(identifier)

  if (!existingEntry || existingEntry.resetAt <= now) {
    const resetAt = now + options.windowMs
    rateLimitStore.set(identifier, { count: 1, resetAt })
    return { allowed: true, remaining: Math.max(options.limit - 1, 0), resetAt }
  }

  if (existingEntry.count >= options.limit) {
    return { allowed: false, remaining: 0, resetAt: existingEntry.resetAt }
  }

  existingEntry.count += 1
  rateLimitStore.set(identifier, existingEntry)

  return {
    allowed: true,
    remaining: Math.max(options.limit - existingEntry.count, 0),
    resetAt: existingEntry.resetAt,
  }
}
