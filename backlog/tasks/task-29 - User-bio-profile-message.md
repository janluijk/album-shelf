---
id: TASK-29
title: User bio / profile message
status: Done
assignee: []
created_date: '2026-07-06 13:47'
updated_date: '2026-07-07 08:34'
labels:
  - m3
  - settings
dependencies:
  - TASK-22
ordinal: 28000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Let users write a short bio / personal message, editable on the settings page and shown on their public profile. Add a bio column to the user row, validate length, render on /u/[username]. Settings feature that builds on task-22.
<!-- SECTION:DESCRIPTION:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Added nullable bio column to user (migration 0004), pure validation/normalization in src/lib/bio.ts (280-char max, trim, empty->null) with unit tests, bio handling in PATCH /api/user, BioForm textarea with live character counter on /settings, and bio rendered under the profile header on /u/[username] when set.
<!-- SECTION:NOTES:END -->
