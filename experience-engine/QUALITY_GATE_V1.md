# EMORA Quality Gate V1

A template is not “ready” because it builds.

It must pass four independent gates.

## Gate A — System correctness (automated)

CI validates:
- manifest shape
- archetype/navigation compatibility
- interaction budget
- required assets
- unique signature moment
- runtime engine resolution
- editor field resolution
- DPR budget
- production build

## Gate B — Visual craft (Impeccable + review)

Review mobile first at 390×844.

Fail for:
- generic AI/SaaS cards inside the emotional experience
- default-looking gradients
- weak typography pairing
- meaningless glassmorphism
- inconsistent spacing
- ornaments with no relation to the concept
- mobile composition that is only a scaled desktop
- finale visually weaker than the opening
- template that cannot be identified from a screenshot without its title

Impeccable is used as a visual critique gate when available, not as the art director.

## Gate C — Experience mechanics

Must verify:
- gesture works with touch/pointer
- gesture changes physical state
- no accidental scroll/zoom conflicts in ritual/world modes
- material continuity survives transitions
- media loading has graceful fallback
- restart/replay works
- sound starts only after user gesture when required
- haptic is optional and never required for understanding
- reduced-motion fallback preserves meaning

## Gate D — Product usefulness

Invitation/event templates must keep functional data usable:
- date/time
- venue
- map when enabled
- RSVP when enabled
- guest greeting when enabled
- share
- save when enabled
- calendar when enabled

Emotion templates must keep creator feedback usable:
- response
- view/open event if enabled
- access lock/timer if enabled

## Screenshot test

Before approval capture at least:
1. opening frame
2. signature moment
3. finale
4. one mobile interaction state

If the four screenshots look like the same generic page with different decoration, the template fails.

## Uniqueness test

Ask:
> If the logo, name and colors were removed, could I still tell which experience this is?

If no, redesign the mechanism/material language.

## Release states

- `concept` — manifest only
- `art-directed` — storyboard/assets approved
- `motion-alpha` — core interaction implemented
- `review` — QA screenshots + product functions wired
- `approved` — visual and product gates passed
- `published` — available to users

No template moves directly from build success to published.
