---
id: TASK-21.2
title: Fractional star widget
status: To Do
assignee: []
created_date: '2026-07-06 13:05'
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
- [ ] #1 clicking left half of star N sets N-0.5, right half sets N
- [ ] #2 fractional values render half-filled stars
- [ ] #3 quality gates pass
<!-- AC:END -->
