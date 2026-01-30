# Stripe Test Mode Setup

This project uses **Stripe Checkout in Test Mode** only. No live payments are enabled yet.

## 1) Create or access a Stripe account
- Sign up with a personal email for now (recommended).
- Enable **2FA** immediately.
- Later, add or transfer ownership to `@seattletablainstitute.org` when ready.
  - You can add a new team member with that email and then change the account owner.

## 2) Create Stripe test keys
In Stripe Dashboard (Test mode):
- Copy the **Secret key** and **Publishable key**.

## 3) Configure Cloudflare Pages environment variables
Set these in **Cloudflare Pages → Settings → Environment variables** for Production and Preview:
- `STRIPE_SECRET_KEY` (test secret key)
- `STRIPE_PUBLISHABLE_KEY` (test publishable key)
- `STRIPE_WEBHOOK_SECRET` (test webhook signing secret)
- `SITE_URL` (e.g. `https://seattle-tabla-institute.pages.dev`)
- `STRIPE_MODE` = `test`

Optional (if you create Stripe Prices):
- `STRIPE_PRICE_ADULT_INTRO_2`
- `STRIPE_PRICE_ADULT_CLASS_6`
- `STRIPE_PRICE_ADULT_CLASS_10`
- `STRIPE_PRICE_ADULT_SEMESTER_16`
- `STRIPE_PRICE_YOUTH_INTRO_2`

If price IDs are not set, the site will fall back to in-code `price_data` amounts.

## 4) Configure the webhook (Test mode)
1. Go to **Stripe Dashboard → Developers → Webhooks**.
2. Add endpoint: `https://seattle-tabla-institute.pages.dev/api/stripe/webhook`
3. Select events:
   - `checkout.session.completed`
   - `payment_intent.succeeded` (optional)
4. Save and copy the **Signing secret** into `STRIPE_WEBHOOK_SECRET`.

## 5) Test payments
- Use Stripe test cards from the Stripe docs.
- Example successful card: `4242 4242 4242 4242`, any future expiry, any CVC.
- Confirm the Checkout redirect returns to `/checkout/success`.

## 6) Switch to Live later (future)
When you are ready:
- Replace test keys with live keys in Cloudflare Pages.
- Create a new **live** webhook endpoint and secret.
- Remove or update all **Test mode** banners.
- Set `STRIPE_MODE=live`.

---
If you need help migrating ownership or setting up live mode, document the steps in this file.
