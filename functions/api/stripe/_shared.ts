import Stripe from "stripe";

const rateBuckets = new Map<string, { count: number; resetAt: number }>();

export type Env = {
  STRIPE_SECRET_KEY?: string;
  STRIPE_WEBHOOK_SECRET?: string;
  STRIPE_MODE?: string;
  SITE_URL?: string;
  [key: string]: string | undefined;
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

export const isAllowedOrigin = (origin: string | null, env: Env) => {
  if (!origin) {
    return false;
  }
  const allowed = new Set<string>();
  const site = env.SITE_URL ? new URL(env.SITE_URL).origin : null;
  if (site) {
    allowed.add(site);
  }
  allowed.add("http://localhost:4321");
  allowed.add("http://127.0.0.1:4321");
  return allowed.has(origin);
};

export const getStripe = (env: Env) => {
  if (!env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is not set.");
  }
  return new Stripe(env.STRIPE_SECRET_KEY, {
    apiVersion: "2024-06-20",
    httpClient: Stripe.createFetchHttpClient()
  });
};

export const getSiteUrl = (env: Env) => {
  const site = env.SITE_URL || "";
  if (!site) {
    throw new Error("SITE_URL is not set.");
  }
  return site.replace(/\/$/, "");
};

export const getClientIp = (request: Request) =>
  request.headers.get("CF-Connecting-IP") || request.headers.get("x-forwarded-for") || "unknown";
