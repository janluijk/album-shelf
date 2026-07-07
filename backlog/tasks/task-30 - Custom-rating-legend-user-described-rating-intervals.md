---
id: TASK-30
title: 'Custom rating legend: user-described rating intervals'
status: Done
assignee: []
created_date: '2026-07-06 13:47'
updated_date: '2026-07-07 09:07'
labels:
  - m3
  - settings
dependencies:
  - TASK-22
ordinal: 29000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Let users describe their own rating scale as intervals with descriptions (e.g. '1-1.5: did not finish', '5.0: all-time favorite'). Editable on the settings page, displayed on the public profile as the user's rating legend. Store intervals per user (JSON column or related table), validate ranges. Settings feature that builds on task-22.
<!-- SECTION:DESCRIPTION:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Added jsonb rating_legend column to user (migration 0005_loving_thena — regenerate if PR 22's 0005 merges first). Pure lib src/lib/ratingLegend.ts: LegendInterval {min,max,label}, isValidLegend (bounds 1-5, one decimal, min<=max, non-blank label <=60 chars, max 10 intervals, no overlaps), normalizeLegend (sort + trim), formatInterval. PATCH /api/user accepts ratingLegend. Settings gains a Rating legend section (RatingLegendForm: add/remove interval rows, client validation, save). Public profile renders the legend card above the listened list when non-empty.
<!-- SECTION:NOTES:END -->
