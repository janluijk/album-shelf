---
id: TASK-21.2
title: Fractional star widget
status: Done
assignee:
  - '@claude'
created_date: '2026-07-06 13:05'
updated_date: '2026-07-06 13:10'
labels:
  - m3
  - settings
dependencies: []
parent_task_id: TASK-21
ordinal: 25000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Extend StarRating so a click on the left/right half of a star sets a .5/.0 value, and stars render partial fill for fractional values. Stars and decimals are two views of the same stored number.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 clicking left half of star N sets N-0.5, right half sets N
- [x] #2 fractional values render half-filled stars
- [x] #3 quality gates pass
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
Rebuild StarRating: each star is a relative span with an outline glyph plus an accent overlay clipped to the fill fraction (generalizes to any decimal). When editable, two invisible half-width hit areas per star set N-0.5 / N with aria-labels. Read-only mode renders a role=img star row labeled with the value. Keep the numeric badge only for values not representable in halves.
<!-- SECTION:PLAN:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
StarRating rebuilt: each star is a relative span with an outline glyph and an accent overlay clipped by width to the fill fraction (renders any decimal, e.g. 3.7). Editable mode adds two invisible half-width hit buttons per star (N-0.5 / N) with aria-labels; read-only mode is a role=img labeled 'Rated X out of 5'. A muted x.y badge shows for values not on a half-step. Gates green.
<!-- SECTION:FINAL_SUMMARY:END -->
