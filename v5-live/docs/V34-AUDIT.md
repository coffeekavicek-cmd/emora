# V34 usability and runtime repair

## Evidence

User screenshots from 2026-10-13 showed an empty creator preview, oversized native file inputs, a detached date/time label, full-width actions and redundant bot connection controls. Source review found missing input/save/upload/copy handlers and conflicting DOM decorators across V15/V18/V30/V33. HTTP 200 and syntax checks had failed to detect these interaction defects.

Celamur's public landing and /create pages were read: https://celamur.com/ and https://celamur.com/create . Its useful structural lesson is a functioning sample before customization, one personal narrative, and a clear final delivery step. Its pricing and statistics are not copied. No claim is made that competitor interactions were exercised in a browser.

## Changes

- One canonical app stylesheet replaces accumulated inline and injected editor layers.
- One independent preview screen serves both sample and personalized viewing, with four allowlisted template paths, reload, close, loading and retry states.
- Samples work before auth and SDK initialization; Supabase SDK is self-hosted at fixed version 2.57.4.
- Explicit handlers restore save, live field updates, private media upload, thumbnails and copy.
- Names and letter stay visible. Media controls are compact; language and optional details are disclosed. No link-name or time field is requested.
- Drafts are saved per template. Private draft media is restored only for its verified owner.
- Cyrillic names receive a valid randomized link slug. Draft links are not offered as published links.
- Telegram remains automatic; redundant connect/disconnect controls and provider choices are removed from this flow.
- Payment publishing remains gated. Manual bot payment was deferred by the user; until setup completes the UI says the draft is saved and payment is being connected. No provider or completed-payment claim is made.

## Verification

DOM unit tests use the actual editor HTML and controller with a mocked authenticated database and private storage: sample before auth; all four create/preview paths; sample-to-create; Cyrillic text save and slug; actual upload events and thumbnails; release of disabled controls; explicit incomplete-payment state. Local syntax and stylesheet structure checks also pass. No real Telegram message, payment or production database row is created by these tests.

Browser and actual-phone rendering remain unverified because supported browser control is unavailable. The DOM tests verify behavior and structure, not layout or visual fidelity.
