import Stripe from "stripe";
import { errorResponse, jsonResponse, type Env } from "./_shared";

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  if (!env.STRIPE_WEBHOOK_SECRET) {
    return errorResponse("STRIPE_WEBHOOK_SECRET is not set.", 500);
  }

  if (!env.STRIPE_SECRET_KEY) {
    return errorResponse("STRIPE_SECRET_KEY is not set.", 500);
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return errorResponse("Missing Stripe signature.", 400);
  }

  const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
    apiVersion: "2024-06-20",
    httpClient: Stripe.createFetchHttpClient()
  });

  const body = await request.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, env.STRIPE_WEBHOOK_SECRET);
  } catch (error) {
    console.error("Stripe webhook signature verification failed", error);
    return errorResponse("Webhook signature verification failed.", 400);
  }

  if (event.type === "checkout.session.completed") {
    console.log("checkout.session.completed", event.data.object);
  }

  if (event.type === "payment_intent.succeeded") {
    console.log("payment_intent.succeeded", event.data.object);
  }

  return jsonResponse({ received: true });
};
