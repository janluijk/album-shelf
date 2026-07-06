---
id: TASK-21.1
title: Decimal ratings foundation
status: Done
assignee:
  - '@claude'
created_date: '2026-07-06 13:05'
updated_date: '2026-07-06 13:07'
labels:
  - m3
  - settings
dependencies: []
parent_task_id: TASK-21
ordinal: 24000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Store and display ratings as decimals (1.0-5.0). Migrate album.rating from integer to numeric via a generated migration (preserving values), update isValidRating to accept one-decimal values in range, and update all read/format paths (StarRating display, API validation).
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 album.rating column is numeric and existing integer values survive the migration
- [x] #2 isValidRating accepts 1.0-5.0 in 0.1 steps and rejects out-of-range/imprecise values
- [x] #3 lint, typecheck, unit tests and build pass
<!-- AC:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
album.rating is now numeric(2,1) in number mode (Album.rating stays number|null). Generated migration drizzle/0002_album-rating-numeric.sql (ALTER COLUMN TYPE preserves integer values). isValidRating accepts 1.0-5.0 with at most one decimal (Math.round(v*10)/10 === v guards float noise) with new unit tests; StarRating shows a muted x.y badge for fractional values until the half-star widget lands. Gates green (30 tests).
<!-- SECTION:FINAL_SUMMARY:END -->
