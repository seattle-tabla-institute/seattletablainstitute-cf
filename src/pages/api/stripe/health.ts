import type { APIContext } from "astro";
import { getEnv, jsonResponse } from "../../../lib/stripe/server";

export async function GET(context: APIContext) {
  const env = getEnv(context);
  return jsonResponse({ ok: true, mode: env.STRIPE_MODE || "unknown" });
}
