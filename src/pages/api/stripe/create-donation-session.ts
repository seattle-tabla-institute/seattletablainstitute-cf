import type { APIContext } from "astro";
import {
  errorResponse,
  getClientIp,
  getEnv,
  getSiteUrl,
  getStripe,
  isAllowedOrigin,
  jsonResponse,
  rateLimit
} from "../../../lib/stripe/server";

const parseAmount = (value: unknown) => {
  if (typeof value === "number") {
    return value;
  }
  if (typeof value === "string") {
    return Number(value);
  }
  return NaN;
};

const isValidAmount = (amount: number) => {
  if (!Number.isFinite(amount)) {
    return false;
  }
  if (amount < 5 || amount > 2000) {
    return false;
  }
  const rounded = Math.round(amount * 100);
  return Math.abs(rounded / 100 - amount) < 0.001;
};

export async function POST(context: APIContext) {
  const env = getEnv(context);
  const origin = context.request.headers.get("Origin");
  if (!isAllowedOrigin(origin, env)) {
    return errorResponse("Invalid origin.", 403);
  }

  const rate = rateLimit(`donation:${getClientIp(context.request)}`);
  if (!rate.ok) {
    return errorResponse("Too many requests. Please try again shortly.", 429);
  }

  let payload: { amount?: number | string } = {};
  try {
    payload = await context.request.json();
  } catch (error) {
    return errorResponse("Invalid JSON payload.");
  }

  const amount = parseAmount(payload.amount);
  if (!isValidAmount(amount)) {
    return errorResponse("Donation amount must be between $5 and $2,000.");
  }

  let stripe;
  try {
    stripe = getStripe(env);
  } catch (error) {
    return errorResponse("Payments are in setup mode. Try again later.", 503);
  }

  const siteUrl = getSiteUrl(env);
  const successUrl = `${siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`;
  const cancelUrl = `${siteUrl}/checkout/cancel`;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      success_url: successUrl,
      cancel_url: cancelUrl,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: Math.round(amount * 100),
            product_data: {
              name: "Donation",
              description: "Support Seattle Tabla Institute"
            }
          }
        }
      ],
      metadata: {
        product_type: "donation",
        site: "seattle-tabla-institute",
        mode: env.STRIPE_MODE || "test"
      },
      customer_creation: "always"
    });

    return jsonResponse({ url: session.url });
  } catch (error) {
    console.error("Stripe create donation session error", error);
    if (env.STRIPE_DEBUG === "true") {
      const message = error instanceof Error ? error.message : "Stripe error";
      return errorResponse(`Stripe error: ${message}`, 500);
    }
    return errorResponse("Unable to start checkout. Please try again.", 500);
  }
}
