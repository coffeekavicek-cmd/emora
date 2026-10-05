# EMORA V16 payments

The live payment pipeline is intentionally provider-confirmed: browser checkout creates a pending order, the payment provider calls its server callback, and only the server-only `emora_finalize_paid_order` function can activate the public site.

## Active product

- `template` — 49,990 UZS — active
- `ai_lite` — 69,990 UZS — disabled until the AI feature ships
- `ai_custom` — 199,990 UZS — disabled until the custom AI builder ships

## Edge Functions

- `emora-checkout` — JWT required; freezes project content/media and creates checkout
- `emora-payme` — provider webhook; custom HTTP Basic authentication
- `emora-click` — provider webhook; CLICK MD5 signature verification

## Required Edge Function secrets

Payme:
- `PAYME_MERCHANT_ID`
- `PAYME_LOGIN`
- `PAYME_KEY`

CLICK:
- `CLICK_SERVICE_ID`
- `CLICK_MERCHANT_ID`
- `CLICK_SECRET_KEY`

Optional:
- `EMORA_PUBLIC_ORIGIN` — canonical production origin used for payment return URLs when the request Origin is unavailable

Supabase supplies project URL and secret/publishable key environment variables. Never place merchant secrets in the browser bundle or commit them to Git.

## Provider callbacks

Configure the merchant cabinet callbacks to the deployed Edge Functions:
- Payme Merchant API → `/functions/v1/emora-payme`
- CLICK Prepare / Complete → `/functions/v1/emora-click`

The checkout function refuses to fabricate a payment URL when the corresponding merchant configuration is missing.
