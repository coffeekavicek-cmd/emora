# Four gift experience review

The system/editor remains Russian; gift language is chosen by its creator. Four categories: birthday, apology, love, proposal. Wedding and email login are excluded. Payment activation remains deferred.

## Reference and findings
Reference inspected: https://celamur.com/ and https://celamur.com/l/demo-sorry (14 October 2026). The public page describes a seal, letter, photographs and finale. In the live apology demo the envelope resolves into a legible, centered letter. The useful lesson is continuity and readable content, not the number of ambient effects.

Emora defects observed in the supplied phone screenshots: Uzbek legacy cue beneath proposal photos; overlapping photos and clipped captions; excessive stacked content; generic transitions. Source review also found that an empty editor introduction injected the Uzbek catalog opening regardless of selected language.

## Changes
- Remove inherited proposal ritual cues; translate remaining shared-runtime text with whitespace normalization and language aliases.
- Proposal: one photograph at a time with back/next and 1 of 3 position, then three reasons and the promise. Original photos/captions and user choices remain functional.
- Birthday/love: single-photo rails, readable captions, independent next-scene action.
- Letters: seal/flap release followed by paragraph ink reveals; preserve authored text and reduced-motion behavior.
- Remove the bright proposal chrome fade; shorten the phone intro composition.
- Empty editor introduction now lets the gift engine choose its own language defaults.
- Desktop preview uses a 430px gift viewport, matching the phone-first experience.
- Cache keys advanced to v40 for changed browser assets.

## Validation before release
Syntax checks; RU/EN/UZ proposal photo navigation/reasons/continuation; normalized Russian cue translation; photo rail navigation; authored paragraph retention; full/reduced motion; disabled-next recovery and timer cleanup. Impeccable detector returned no findings for changed motion sources.

WebGL support is disabled in the cloud QA browser. Its CSS fallback can be inspected there; real GPU rendering on a physical phone remains unverified.
