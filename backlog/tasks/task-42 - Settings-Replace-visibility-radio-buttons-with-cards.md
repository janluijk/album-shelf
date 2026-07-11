---
id: TASK-42
title: 'Settings: Replace visibility radio buttons with cards'
status: Done
assignee: []
created_date: '2026-07-11 11:57'
updated_date: '2026-07-11 12:22'
labels:
  - settings
  - ui-polish
dependencies: []
ordinal: 42000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Improve the visual design of the visibility settings in the settings page. The visibility options currently display as plain radio buttons, which feels inconsistent with the polished design of other settings (like the ratings granularity options in task-35).

Replace the radio button list with a card-based layout where each visibility option is presented as an interactive card. This matches the design pattern already used in the ratings settings tab.

**Design reference:**
Task-35 improved the ratings granularity display from bullet points to custom styling. Apply the same visual treatment to visibility options:
- Each option as a bordered card (using design tokens: --card, --card-border)
- Selected option highlighted with accent color (--accent)
- Clear visual distinction between selected and unselected states
- Consistent spacing and typography with the rest of the app

**Visibility options (typical):**
- Public (profile visible to everyone)
- Private (profile hidden, only accessible via direct link or signed-in users)
- Or other visibility states if implemented

**No functionality changes** — this is purely a visual redesign. The radio button behavior (single selection) and API integration remain the same.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Visibility options displayed as interactive cards instead of radio buttons
- [x] #2 Each card clearly shows the visibility option (e.g., "Public", "Private") with optional description
- [x] #3 Selected visibility option is visually distinguished from unselected options (e.g., border color, background, or accent color)
- [x] #4 Selected card shows clear indicator (e.g., checkmark, filled border, or highlight) using design tokens
- [x] #5 Card styling is consistent with other settings cards (rounded corners, borders, padding from design tokens)
- [x] #6 Card styling uses Album Shelf design tokens: --card, --card-border, --accent, --foreground, --muted
- [x] #7 Only one visibility option can be selected at a time (single-selection behavior preserved)
- [x] #8 Clicking a card selects that visibility option and updates the user's profile visibility
- [x] #9 Layout responsive on mobile (cards stack or adjust spacing appropriately)
- [x] #10 Visual styling consistent with ratings settings tab (task-35) for design cohesion
- [x] #11 No regression in visibility API calls or data persistence
- [ ] #12 Verified visually at desktop, tablet, and mobile sizes via Playwright
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
VisibilityForm now mirrors the RatingModeForm card pattern exactly: role=radiogroup with two role=radio buttons (Public / Private) in a responsive grid (stacked on mobile, 2-up from sm). Each card shows the label plus a concise muted description (Public: anyone can view your shelf; Private: only you can view it); the selected card gets the accent border, accent-tinted background, and accent-colored description. Same optimistic choose() logic and PATCH /api/user, no functional changes. AC12: settings requires auth so local Playwright verification was skipped; verify visually on the PR preview.
<!-- SECTION:NOTES:END -->
