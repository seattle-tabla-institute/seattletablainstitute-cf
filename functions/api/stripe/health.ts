import { jsonResponse, type Env } from "./_shared";

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  return jsonResponse({ ok: true, mode: env.STRIPE_MODE || "unknown" });
};
