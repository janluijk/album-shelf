---
id: TASK-20
title: Increase album cover art size
status: Done
assignee:
  - '@claude'
created_date: '2026-07-06 12:10'
updated_date: '2026-07-06 13:01'
labels:
  - m3
dependencies: []
ordinal: 19000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
The CoverThumb thumbnails (currently 40x40) feel too small. Increase the cover art size across the shelf queue, listened list and public profile. Keep the rows aligned and the ♪ placeholder the same size as real covers, and update the next/image width/height plus the reserved box so larger images stay crisp and rows don't shift.
<!-- SECTION:DESCRIPTION:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
Bump CoverThumb from 40x40 to 56x56 (h-14 w-14): next/image width/height 56, placeholder box same size so rows stay aligned. Source art is 250px CAA thumbs so 56px @2x (112px) stays crisp. Queue, listened list and public profile all render via CoverThumb, so one change covers all three.
<!-- SECTION:PLAN:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
CoverThumb bumped 40x40 -> 56x56: next/image width/height now 56 and both the image and the missing-art placeholder use h-14 w-14, so queue/listened/profile rows stay aligned and the reserved box matches. 250px CAA source art stays crisp at 2x. Verified: lint, typecheck, unit tests, build green.
<!-- SECTION:FINAL_SUMMARY:END -->
