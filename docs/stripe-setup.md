# Stripe Setup (Live)

This project uses Stripe Checkout in live mode for class purchases and donations.

## 1) Access the Stripe account
- Ensure the account is activated for live payments.
- Enable **2FA** for all users.
- Confirm ownership under `@seattletablainstitute.org` if needed.

## 2) Create live API keys
In Stripe Dashboard (Live mode):
- Copy the **Secret key** and **Publishable key**.

## 3) Configure Cloudflare Pages environment variables
Set these in **Cloudflare Pages → Settings → Environment variables** for Production and Preview:
- `STRIPE_SECRET_KEY` (live secret key)
- `STRIPE_PUBLISHABLE_KEY` (live publishable key)
- `STRIPE_WEBHOOK_SECRET` (live webhook signing secret)
- `SITE_URL` (e.g. `https://seattle-tabla-institute.pages.dev`)
- `STRIPE_MODE` = `live`

Create live Price IDs and set:
- `STRIPE_PRICE_ADULT_INTRO_2`
- `STRIPE_PRICE_ADULT_HALF_SEMESTER`
- `STRIPE_PRICE_ADULT_SEMESTER_16`
- `STRIPE_PRICE_YOUTH_INTRO_2`

If price IDs are not set, the site will fall back to in-code `price_data` amounts.

## 4) Configure the webhook (Live mode)
1. Go to **Stripe Dashboard → Developers → Webhooks**.
2. Add endpoint: `https://seattle-tabla-institute.pages.dev/api/stripe/webhook`
3. Select events:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
4. Save and copy the **Signing secret** into `STRIPE_WEBHOOK_SECRET`.

## 5) Verify checkout in live mode
- Run a small live payment and confirm the Checkout redirect returns to `/checkout/success`.
- Verify events are received under **Developers → Webhooks**.

---
If you switch to a custom domain, create a new webhook endpoint for that domain and update
`STRIPE_WEBHOOK_SECRET` accordingly.
