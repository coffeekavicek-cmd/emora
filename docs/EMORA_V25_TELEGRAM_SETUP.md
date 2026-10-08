# EMORA V25 — Apology experience and Telegram notification setup

## What changed

- **«Мендан ҳали ҳам хафамисан?»**: the **«Ҳа» button moves away** on mouse/touch, the **«Йўқ» button continues** to the envelope. The removed «Ҳозир гаплашгим йўқ» option is not rendered.
- The apology letter starts with a small joke about tapping **«Йўқ»**, followed by a genuine apology (no assertion that tapping a button is consent/forgiveness).
- Premium restaurant/walk/coffee selection cards, a single-column date and time picker on narrow phones, dynamic choice recap and a confirmation button.
- When the visitor intentionally taps the confirmation button, the client POSTs to `/api/apology-meeting`. This **never opens a Telegram share composer**, does not claim success before a 200 response, and has UZ/RU/EN error messages.
- The bot backend verifies the published site slug, its project and owner, validates the date, choice and time, rate-limits and claims a unique delivery record before sending.

## Activation prerequisites — not included in the repo

Do not paste tokens, access keys or customer chat IDs into GitHub, the site HTML or a ChatGPT conversation.

1. **Owner starts the Emora Telegram bot** by messaging `/start`. A bot **cannot message a user who hasn't started it**. Bind that user's owner UUID to their Telegram chat ID using a server-side registration flow; the pilot implementation accepts a server-only JSON owner-to-chat mapping.
2. Apply and verify the RLS-protected migration in `supabase/migrations/20261008_emora_meeting_events.sql` using an approved database-change process.
3. Configure the **Railway preview service environment variables** securely:
   - `EMORA_PUBLIC_ORIGIN`: exact preview origin, e.g. `https://emora-v21-private-preview-production.up.railway.app`
   - `EMORA_SUPABASE_URL`: Supabase project URL
   - `EMORA_SUPABASE_SERVICE_ROLE_KEY`: server-only service-role key (never a browser anon key)
   - `EMORA_TELEGRAM_BOT_TOKEN`: BotFather bot token
   - `EMORA_TELEGRAM_OWNER_CHAT_MAP`: server-only JSON object mapping validated auth owner UUIDs to numeric chat IDs; test recipients only until owner registration is built
   - `EMORA_BOT_DELIVERY_MODE=enabled`: explicit activation **only after all previous steps and sandbox tests pass**
4. Create a **sample published apology site** with `experience_version >= 24`; Studio previews and directly opened demonstration templates deliberately do not have a trusted published slug and cannot send notifications.
5. Test a **sample booking**, verify one Telegram notification arrives to exactly the intended sender, verify wrong origin, wrong slug, duplicate submission, missing owner and bot error; clean up test data. Compare saved event log in `emora_meeting_events`.
6. Review GDPR/local privacy notices, data retention and bot notifications before releasing to real users.

## Security and limitations

- No client-supplied Telegram chat ID is accepted. Recipient is resolved from `published_sites → projects.owner_id → server-only owner/chat mapping`.
- A booking event's dedupe key covers project, slug, place, date and time. Duplicate submissions cannot deliver twice through the same unique-key claim.
- Current pilot limits each public slug to three attempts per hour **per process**. Production should use distributed per-IP/per-site quotas in database or edge gateway and a proper bot onboarding flow.
- If the provider call fails after claiming a unique booking, the event is marked `failed` and requires an operator-controlled retry. Do **not** blindly resubmit a duplicate or it may send twice.
- Requests fail closed without the required environment, DB migration, verified owner mapping or Telegram credentials. The UI clearly says no message was sent.
- User choice and date/time are sent only after their explicit button press. There is no background send or unconsented location access.

## Test evidence

```sh
node v5-live/tests/v25-meeting-bot-qa.mjs
node v5-live/tests/v24-apology-qa.mjs
node v5-live/tests/v24-apology-studio-qa.mjs
```

The first test mocks the DB and Telegram API and sends **no real messages**. The remaining browser tests use sample names and mocked POST responses.

## Release policy

Never enable `EMORA_BOT_DELIVERY_MODE` in production or promise automatic Telegram delivery without a real test BotFather token, owner-to-chat binding and server migration. The current Railway demo has **no bot env variables set**. GitHub and Railway preview branch changes are isolated; existing production remains unchanged.
