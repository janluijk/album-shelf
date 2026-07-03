---
id: TASK-12
title: Queue reordering
status: Done
assignee: []
created_date: '2026-07-03 12:34'
updated_date: '2026-07-03 12:50'
labels:
  - m3
dependencies: []
ordinal: 12000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Drag-and-drop or up/down controls updating position.
<!-- SECTION:DESCRIPTION:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Up/down controls on queue rows swap position values via two optimistic PATCHes. Pure swap logic in src/lib/albums.ts (swapWithNeighbor) with unit tests; PATCH route accepts validated position.
<!-- SECTION:NOTES:END -->
