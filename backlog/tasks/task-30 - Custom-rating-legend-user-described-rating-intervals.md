---
id: TASK-30
title: 'Custom rating legend: user-described rating intervals'
status: Done
assignee: []
created_date: '2026-07-06 13:47'
updated_date: '2026-07-07 10:24'
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
Reworked to partition model: legend stored as {cuts, labels} jsonb (same column, no SQL change) — cuts partition [1,5] so every rating falls in exactly one segment by construction. Cut = first value of its right segment; segmentsFor(legend, mode) renders inclusive ranges per granularity (left max = cut − step) and hides segments that collapse on coarser grids; all arithmetic in integer tenths. Editor: segmented bar (accent color-mix tints), draggable pointer-captured cut handles snapping to the mode grid with arrow-key support, star ruler, synced list below with color chip, boundary dropdown, label input, split/merge; create/remove legend flows; success toast on save. API accepts {cuts,labels} or null.
<!-- SECTION:NOTES:END -->
