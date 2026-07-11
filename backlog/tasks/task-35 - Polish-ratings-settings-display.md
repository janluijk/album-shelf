---
id: TASK-35
title: Polish ratings settings display
status: Done
assignee: []
created_date: '2026-07-07 08:40'
updated_date: '2026-07-11 11:53'
labels:
  - ui-polish
dependencies: []
priority: medium
ordinal: 35000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
The ratings granularity options in the settings page currently display as plain bullet points, which feels inconsistent with the app's polished design. Replace the bullet-point list with a more visually appealing presentation that better integrates with the app's design system.

The functionality remains unchanged — users select between integer, half-star, and decimal rating granularities. Only the visual presentation should be improved.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Ratings granularity options display with custom styling instead of default bullet points
- [x] #2 All three granularity options (integer, half-star, decimal) remain selectable and functional
- [x] #3 Selected option is visually distinguished from unselected options
- [x] #4 Visual styling is consistent with the app's design tokens (colors, spacing, typography, borders, rounded corners)
- [x] #5 Display is responsive and looks good on mobile, tablet, and desktop viewports
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Replaced the radio bullet list in RatingModeForm with a segmented card group: three role=radio buttons in a responsive grid (stacked on mobile, 3-up from sm), each showing the mode label plus a small example (whole ★★★★, half ★★★★½, decimal 4.3). Selected card gets an accent border and tinted background; unselected cards use card-border with a muted hover. Same choose() logic and optimistic save, styled purely with design tokens.
<!-- SECTION:NOTES:END -->
