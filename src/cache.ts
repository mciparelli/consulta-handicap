import { date } from "~/utils";

/**
 * Cache control utilities for Cloudflare Workers
 *
 * Cloudflare Workers have specific caching mechanisms. The standard Cache-Control
 * header with s-maxage is not always respected. Instead, we use:
 *
 * 1. CDN-Cache-Control - Specifically for CDN edge caching (Cloudflare respects this)
 * 2. Cache-Control - For browser/client caching
 *
 * Header priority in Cloudflare:
 * Cloudflare-CDN-Cache-Control > CDN-Cache-Control > Cache-Control (s-maxage) > Cache-Control (max-age)
 */

export interface CacheHeaders {
  "Cache-Control": string;
  "CDN-Cache-Control": string;
}

/**
 * Creates cache headers for static-ish content that updates weekly (on Thursdays)
 * - Browser: no cache (always revalidate)
 * - CDN: cache until next Thursday
 */
export function cacheUntilNextThursday(): CacheHeaders {
  const ttl = date.secondsToNextThursday();
  return {
    "Cache-Control": "public, max-age=0, must-revalidate",
    "CDN-Cache-Control": `public, max-age=${ttl}`,
  };
}

/**
 * Creates cache headers for dynamic content with stale-while-revalidate
 * - Browser: no cache
 * - CDN: no cache, but serve stale while revalidating in background
 */
export function cacheStaleWhileRevalidate(): CacheHeaders {
  const swr = date.secondsToNextThursday();
  return {
    "Cache-Control": "public, max-age=0, must-revalidate",
    "CDN-Cache-Control": `public, max-age=0, stale-while-revalidate=${swr}`,
  };
}

/**
 * Creates cache headers for API responses
 * - Browser: cache until next Thursday
 * - CDN: cache until next Thursday
 */
export function cacheApiResponse(): CacheHeaders {
  const ttl = date.secondsToNextThursday();
  return {
    "Cache-Control": `public, max-age=${ttl}`,
    "CDN-Cache-Control": `public, max-age=${ttl}`,
  };
}

/**
 * Creates cache headers with no caching at all
 */
export function noCache(): CacheHeaders {
  return {
    "Cache-Control": "private, no-cache, no-store, must-revalidate",
    "CDN-Cache-Control": "private, no-cache, no-store",
  };
}

/**
 * Creates custom cache headers
 * @param browserMaxAge - max-age for browser cache in seconds
 * @param cdnMaxAge - max-age for CDN cache in seconds
 * @param options - additional cache options
 */
export function customCache(
  browserMaxAge: number,
  cdnMaxAge: number,
  options?: {
    staleWhileRevalidate?: number;
    staleIfError?: number;
    private?: boolean;
  }
): CacheHeaders {
  const visibility = options?.private ? "private" : "public";

  let cdnDirectives = `${visibility}, max-age=${cdnMaxAge}`;
  if (options?.staleWhileRevalidate) {
    cdnDirectives += `, stale-while-revalidate=${options.staleWhileRevalidate}`;
  }
  if (options?.staleIfError) {
    cdnDirectives += `, stale-if-error=${options.staleIfError}`;
  }

  return {
    "Cache-Control": `${visibility}, max-age=${browserMaxAge}${browserMaxAge === 0 ? ", must-revalidate" : ""}`,
    "CDN-Cache-Control": cdnDirectives,
  };
}

/**
 * Helper to apply cache headers to Elysia's set.headers
 */
export function applyCache(
  headers: Record<string, string | number>,
  cacheHeaders: CacheHeaders
): void {
  headers["Cache-Control"] = cacheHeaders["Cache-Control"];
  headers["CDN-Cache-Control"] = cacheHeaders["CDN-Cache-Control"];
}

export const cache = {
  untilNextThursday: cacheUntilNextThursday,
  staleWhileRevalidate: cacheStaleWhileRevalidate,
  apiResponse: cacheApiResponse,
  none: noCache,
  custom: customCache,
  apply: applyCache,
};
