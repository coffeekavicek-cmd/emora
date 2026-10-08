# EMORA V22 — Checkout and media integrity release gates

**Release status:** preview/testing only. Do not merge to production, take real payments, or publish customer media based solely on these browser tests.

## Implemented

1. The checkout button now calls the **awaitable Studio save operation**, receives the newly saved project UUID, and verifies that exact project ID, owner, selected template, draft status and slug in the database before opening payment options. A failed or thrown save cannot fall back to an old draft.
2. The birthday experience preserves **photo positions**. If slot 1 is blank and slot 2 has a photo, slot 2 stays paired with its own caption instead of shifting to slot 1.
3. Browser and Node regression tests cover these cases without spending money or changing user data.

## Verified existing server protections (read-only check, 2026-10-08)

- `public.published_sites` has Row Level Security enabled; no direct `INSERT` grant or policy for `anon` or `authenticated`. Provider-confirmed Edge Functions are the intended path for publication.
- `public.payment_orders` is owner-readable; insert/update policies are not directly exposed to browser roles.
- `public.projects` is owner-scoped for its row access policies.
- The active Supabase deployment has `emora-checkout`, `emora-click`, and `emora-payme` Edge Functions. Their presence is **not** evidence of merchant keys or live payment acceptance.

## Still required before collecting payments

- [ ] Confirm Click and Payme merchant agreements, test credentials, callback endpoints and correct environments. Never commit secrets or paste them into chat.
- [ ] Perform real **provider sandbox** transactions and simulate success, failure, retry, delayed callback and replay attacks.
- [ ] Verify that duplicate provider notifications cannot create duplicate paid orders or public sites.
- [ ] Confirm private media never enters the public bucket before a paid order finalizes; test using **throwaway user assets**.
- [ ] Complete separate sign-in/out, account ownership and token-expiry browser tests.
- [ ] Review Supabase security advisor warnings for three intentionally public `SECURITY DEFINER` guest/view RPC endpoints and explicitly validate rate limits and token handling. Do not blindly revoke access needed for RSVP.
- [ ] Assess Auth compromised-password protection if password sign-in is offered.
- [ ] Human mobile QA at 360, 390, 430 and desktop widths; music and video playback on real iOS Safari and Android Chrome.
- [ ] Confirm owners accept and can understand platform pricing, refund policy, uploaded media retention/privacy rules and support process.

## Reproducible tests

```bash
node v5-live/tests/v22-checkout-save-qa.mjs
node v5-live/tests/v22-birthday-media-slots-qa.mjs
```

The second suite requires a local EMORA server at port 3000 and Playwright Chromium. Full 5-flagship GitHub Actions QA must also pass.

## Release isolation

- Original Railway V10 service remains untouched.
- The V22 feature branch and any V22 demo should use a **separate preview service or the existing preview service**, with a pinned commit and a green deployment healthcheck.
- Sandbox payment configuration must **never** be used to send actual customer charges.
