---
id: TASK-26
title: 'Profile page: recent-activity cover grid with ratings'
status: Done
assignee: []
created_date: '2026-07-06 13:47'
updated_date: '2026-07-07 08:56'
labels:
  - m3
dependencies: []
ordinal: 25000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Redesign the public profile (/u/[username]) to show recent listening activity as a grid of large album covers with the rating shown on or under each cover, replacing the current text list. Covers render via CoverThumb (see task-25 for the cover-availability bug). Sets up clicking a cover to open its details.
<!-- SECTION:DESCRIPTION:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Profile /u/[username] now shows listening history as a responsive cover grid (2/3/4 columns) titled Recent activity: new AlbumCover component (large square next/image fill with placeholder fallback), title/artist truncated under each cover, StarRating + listened date below. Notes dropped from the grid (return in the task-28 details modal). CoverThumb untouched (still used by Shelf). Verified visually at desktop and mobile widths via Playwright MCP.
<!-- SECTION:NOTES:END -->
