# Emora: current product requirements

The editor and bot use natural, concise Russian. The gift language is selected only while creating a gift: Russian, Uzbek or English. Recipients see the chosen language without a language menu.

Four gifts remain: birthday, apology, love confession and marriage proposal. Wedding invitations are excluded from the creator catalog.

The creator asks for a recipient name and a personal letter first. Photos, video, music and extra story details can be added progressively. Existing preview, account saving and payment gating remain in place.

Birthday and confession finales use persistent name glyphs. The initial state is a rectangle containing thousands of repetitions of the recipient name. At half the slider the glyphs form a heart. At the end they move into a rectangular portrait sampled from the first recipient photo. The visible canvas never draws the photograph itself. Demonstration portraits are explicitly labeled.

Telegram notifications come from the Emora bot, never from the recipient's account. The gift creator connects their authenticated Emora account through a one-time Telegram start link. When the recipient selects a meeting place, date and time, the server verifies the published gift's owner and the bot sends the choice to that owner's verified private chat. Recipients do not need Telegram.

Bot credentials stay in server environment variables. Durable linking, update cursor and delivery deduplication live in the private database schema. The narrowly scoped database bridge uses a separate backend secret; user-specific connection actions also require a validated account session.

Use the existing cream, rose and dark plum visual identity. Keep the interface simple and the gift scenes expressive. Do not describe a deployment or payment integration as verified unless the relevant checks have actually passed.
