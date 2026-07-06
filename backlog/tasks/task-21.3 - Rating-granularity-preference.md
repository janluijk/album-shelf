---
id: TASK-21.3
title: Rating granularity preference
status: Done
assignee: []
created_date: '2026-07-06 13:05'
updated_date: '2026-07-06 14:54'
labels:
  - m3
  - settings
dependencies: []
parent_task_id: TASK-21
ordinal: 26000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Add ratingGranularity (integer | half | decimal) to the user row, default integer, via generated migration. The shelf reads it to decide how ratings are entered and shown: integer -> whole-star clicks, half -> half-star clicks, decimal -> numeric input alongside stars. PATCH /api/user accepts the preference.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 user.ratingGranularity column exists with default integer
- [ ] #2 shelf entry/display honors the preference
- [ ] #3 PATCH /api/user validates and saves the preference
- [ ] #4 quality gates pass
<!-- AC:END -->
