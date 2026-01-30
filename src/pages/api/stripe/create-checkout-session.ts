import type { APIContext } from "astro";
import { adultPackages, pricingMap, youthPackages, type ClassGroup, type PackageKey } from "../../../lib/stripe/pricing";
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

export async function POST(context: APIContext) {
  const env = getEnv(context);
  const origin = context.request.headers.get("Origin");
  if (!isAllowedOrigin(origin, env)) {
    return errorResponse("Invalid origin.", 403);
  }

  const rate = rateLimit(`checkout:${getClientIp(context.request)}`);
  if (!rate.ok) {
    return errorResponse("Too many requests. Please try again shortly.", 429);
  }

  let payload: { group?: ClassGroup; package?: PackageKey } = {};
  try {
    payload = await context.request.json();
  } catch (error) {
    return errorResponse("Invalid JSON payload.");
  }

  const group = payload.group;
  const pkg = payload.package;
  if (!group || !pkg || !pricingMap[group]?.[pkg]) {
    return errorResponse("Invalid class selection.");
  }

  if (group === "adult" && !adultPackages.includes(pkg)) {
    return errorResponse("Invalid class selection.");
  }
  if (group === "youth" && !youthPackages.includes(pkg)) {
    return errorResponse("Invalid class selection.");
  }

  const price = pricingMap[group][pkg];
  if (!price || !price.amount) {
    return errorResponse("Pricing not configured.");
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
  const priceId = price.priceIdEnv ? env[price.priceIdEnv] : undefined;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      success_url: successUrl,
      cancel_url: cancelUrl,
      line_items: priceId
        ? [{ price: priceId, quantity: 1 }]
        : [
            {
              quantity: 1,
              price_data: {
                currency: "usd",
                unit_amount: price.amount,
                product_data: {
                  name: price.label,
                  description: price.description
                }
              }
            }
          ],
      metadata: {
        product_type: "class_purchase",
        class_group: group,
        package: pkg,
        site: "seattle-tabla-institute",
        mode: env.STRIPE_MODE || "test"
      },
      customer_creation: "always",
      allow_promotion_codes: false
    });

    return jsonResponse({ url: session.url });
  } catch (error) {
    console.error("Stripe create checkout session error", error);
    return errorResponse("Unable to start checkout. Please try again.", 500);
  }
}
