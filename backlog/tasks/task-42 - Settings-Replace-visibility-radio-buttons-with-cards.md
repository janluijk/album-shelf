---
id: TASK-42
title: 'Settings: Replace visibility radio buttons with cards'
status: To Do
assignee: []
created_date: '2026-07-11 11:57'
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
- [ ] #1 Visibility options displayed as interactive cards instead of radio buttons
- [ ] #2 Each card clearly shows the visibility option (e.g., "Public", "Private") with optional description
- [ ] #3 Selected visibility option is visually distinguished from unselected options (e.g., border color, background, or accent color)
- [ ] #4 Selected card shows clear indicator (e.g., checkmark, filled border, or highlight) using design tokens
- [ ] #5 Card styling is consistent with other settings cards (rounded corners, borders, padding from design tokens)
- [ ] #6 Card styling uses Album Shelf design tokens: --card, --card-border, --accent, --foreground, --muted
- [ ] #7 Only one visibility option can be selected at a time (single-selection behavior preserved)
- [ ] #8 Clicking a card selects that visibility option and updates the user's profile visibility
- [ ] #9 Layout responsive on mobile (cards stack or adjust spacing appropriately)
- [ ] #10 Visual styling consistent with ratings settings tab (task-35) for design cohesion
- [ ] #11 No regression in visibility API calls or data persistence
- [ ] #12 Verified visually at desktop, tablet, and mobile sizes via Playwright
<!-- AC:END -->
