import Stripe from "stripe";
import type { APIContext } from "astro";

const rateBuckets = new Map<string, { count: number; resetAt: number }>();

export type StripeEnv = Record<string, string | undefined>;

export const getEnv = (context: APIContext): StripeEnv => {
  const runtime = (context.locals as { runtime?: { env?: StripeEnv } } | undefined)?.runtime;
  return runtime?.env ?? {};
};

export const jsonResponse = (data: unknown, init: ResponseInit = {}) => {
  const headers = new Headers(init.headers);
  headers.set("Content-Type", "application/json");
  return new Response(JSON.stringify(data), { ...init, headers });
};

export const errorResponse = (message: string, status = 400) =>
  jsonResponse({ error: message }, { status });

export const rateLimit = (key: string, limit = 20, windowMs = 60_000) => {
  const now = Date.now();
  const bucket = rateBuckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    rateBuckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true };
  }
  if (bucket.count >= limit) {
    return { ok: false, retryAfter: Math.ceil((bucket.resetAt - now) / 1000) };
  }
  bucket.count += 1;
  return { ok: true };
};

export const isAllowedOrigin = (origin: string | null, env: StripeEnv) => {
  if (!origin) {
    return false;
  }
  const allowedOrigins = new Set<string>();
  const siteOrigin = env.SITE_URL ? new URL(env.SITE_URL).origin : null;
  const siteHost = env.SITE_URL ? new URL(env.SITE_URL).hostname : null;
  if (siteOrigin) {
    allowedOrigins.add(siteOrigin);
  }
  allowedOrigins.add("http://localhost:4321");
  allowedOrigins.add("http://127.0.0.1:4321");
  if (allowedOrigins.has(origin)) {
    return true;
  }
  try {
    const originHost = new URL(origin).hostname;
    if (siteHost && (originHost === siteHost || originHost.endsWith(`.${siteHost}`))) {
      return true;
    }
    if (originHost.endsWith(".seattle-tabla-institute.pages.dev")) {
      return true;
    }
  } catch (error) {
    return false;
  }
  return false;
};

export const getStripe = (env: StripeEnv) => {
  if (!env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is not set.");
  }
  return new Stripe(env.STRIPE_SECRET_KEY, {
    apiVersion: "2024-06-20",
    httpClient: Stripe.createFetchHttpClient()
  });
};

export const getSiteUrl = (env: StripeEnv) => {
  const site = env.SITE_URL || "";
  if (!site) {
    throw new Error("SITE_URL is not set.");
  }
  return site.replace(/\/$/, "");
};

export const getRequestSiteUrl = (request: Request, env: StripeEnv) => {
  const fallback = env.SITE_URL || "";
  const fromUrl = (() => {
    try {
      const url = new URL(request.url);
      return url.origin !== "null" ? url.origin : "";
    } catch (error) {
      return "";
    }
  })();
  const fromOrigin = request.headers.get("Origin") || "";
  const host = request.headers.get("Host") || "";
  const proto = request.headers.get("X-Forwarded-Proto") || "https";
  const fromHost = host ? `${proto}://${host}` : "";
  const site = fromUrl || fromOrigin || fromHost || fallback;
  if (!site) {
    throw new Error("SITE_URL is not set.");
  }
  return site.replace(/\/$/, "");
};

export const getClientIp = (request: Request) =>
  request.headers.get("CF-Connecting-IP") || request.headers.get("x-forwarded-for") || "unknown";
