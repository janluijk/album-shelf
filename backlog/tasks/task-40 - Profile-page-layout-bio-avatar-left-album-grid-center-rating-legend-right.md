---
id: TASK-40
title: 'Profile page layout: bio/avatar left, album grid center, rating legend right'
status: To Do
assignee: []
created_date: '2026-07-11 11:48'
labels:
  - profile
  - ui-polish
  - layout
dependencies: []
ordinal: 40000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Rework the public profile page layout (/u/[username]) to better organize the content. Currently the layout doesn't optimally display the profile information and rating legend.

**Current state:** Task-26 redesigned the profile to show a cover grid with recent activity. Task-29 added user bio. Both are done, but the layout needs refinement.

**Desired layout:**
- **Left sidebar:** Profile picture (avatar/circle image) and bio text (editable max 280 chars)
- **Center:** Album cover grid showing recent listening activity (from task-26)
- **Right sidebar:** Rating legend (custom rating intervals, from task-30)

This three-column layout maximizes use of desktop space and keeps related information grouped.

**Issues to fix:**
1. Bio is not displaying correctly on the current profile page (verify if it's a rendering bug or visibility issue)
2. Rating legend needs to be repositioned from its current location to the right sidebar
3. Profile picture/avatar should be prominently displayed on the left
4. Layout should be responsive: stack to single column on mobile/tablet

**Design details:**
- Left sidebar: fixed width (200-250px), sticky on scroll (or stop at bottom of grid)
- Center: responsive grid (2-4 columns based on screen size)
- Right sidebar: fixed width (200-250px), sticky on scroll (or stop at bottom of grid)
- Mobile: single column stack (avatar+bio above, grid in middle, legend below)
- Ensure all three sections are visually balanced and scan naturally left-to-right
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Profile picture displayed prominently in left sidebar (avatar/circle image, ~150px)
- [ ] #2 User bio displayed under profile picture in left sidebar; full 280 chars supported
- [ ] #3 Bio displays correctly with line breaks and text wrapping (verify rendering bug fix)
- [ ] #4 Album cover grid (recent activity) centered as main content area
- [ ] #5 Rating legend positioned in right sidebar showing custom rating intervals
- [ ] #6 Layout responsive on mobile: elements stack vertically (avatar+bio, then grid, then legend)
- [ ] #7 Layout responsive on tablet: 2-column or adjusted spacing
- [ ] #8 Left and right sidebars remain visible while scrolling through album grid (sticky or smart positioning)
- [ ] #9 All three sections (left sidebar, center grid, right legend) are visually balanced
- [ ] #10 Username and profile header remain at top above three-column layout
- [ ] #11 Cover grid still shows proper dimensions and responsive columns (2/3/4 based on viewport)
- [ ] #12 Rating legend is readable and doesn't overlap with other content
- [ ] #13 Verified at desktop, tablet (iPad), and mobile sizes via Playwright
- [ ] #14 Unit or visual tests added for layout responsiveness
<!-- AC:END -->
