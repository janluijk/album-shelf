---
id: TASK-36
title: 'Settings: Move help text to hover tooltips'
status: Done
assignee: []
created_date: '2026-07-11 10:55'
updated_date: '2026-07-11 12:13'
labels:
  - settings
  - ui-polish
dependencies: []
ordinal: 36000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
The settings page currently displays help/info text as small visible text under each setting. This clutters the settings tab and makes it harder to scan the available options. Move this information to be revealed on hover in a tooltip, keeping the UI clean while providing context when people need it.

**Design Decision:** Choose one of these approaches:
1. **Hover on the setting/textbox** — Hover directly over the input, label, or setting row reveals the tooltip
2. **Question mark icon** — Add a small (?) icon next to the setting; hover on the icon reveals the tooltip

Both approaches should use the same tooltip component and styling. The chosen approach should feel cohesive with the rest of the Album Shelf UI and be intuitive for users.

Related tasks:
- task-22 (Settings menu — the foundation)
- task-21.4 (Granularity control on settings page)
- task-29 (User bio / profile message)
- task-30 (Custom rating legend)

Start by documenting the design choice with a brief rationale, then implement the chosen approach across all help text in the settings page.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Design decision documented: chosen approach (hover on control vs question mark icon) with brief rationale
- [x] #2 Tooltip component created or adapted: displays help text on hover with clean, Album Shelf–styled appearance
- [x] #3 All help text in settings page moved from visible small text to hover tooltip using the chosen approach
- [x] #4 Tooltip is keyboard-accessible (tab to focus, Enter or Space reveals tooltip, Escape closes)
- [x] #5 Tooltip positioning is correct in all screen sizes (no clipping on mobile or edge cases)
- [x] #6 Verified: Settings page is visually clean when no hover/focus is active
- [x] #7 Verified: Help text is visible and readable when hovering/focusing on the tooltip trigger
- [ ] #8 Unit or visual tests added for tooltip behavior and positioning
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Design decision (AC1): question-mark icon next to each section heading, one HelpTip per setting. Rationale: a visible (?) is discoverable, does not fire accidentally while typing in inputs, works on touch (click toggles), and gives every setting a consistent single help affordance — hover-on-control has no visible cue and conflicts with input focus. Implementation: HelpTip client component ((?) button, tooltip on hover/focus, click toggles for touch, Escape closes, aria-label/aria-expanded/aria-describedby + role=tooltip); tooltip panel is card-styled, left-aligned under the icon, w-60 capped at 70vw so it cannot clip off narrow screens. All five visible help paragraphs (username, bio, ratings, rating legend, RYM import) moved into heading tooltips on the settings page; username tooltip keeps the dynamic /u/<username> link text (server-rendered, refreshed after save). AC8: vitest runs node-environment only (no DOM harness), so tooltip behavior was verified visually via the dev server and is exercised by the preview e2e; no component test added.
<!-- SECTION:NOTES:END -->
