---
id: TASK-19
title: Add-form overflows the queue card
status: Done
assignee: []
created_date: '2026-07-03 15:09'
updated_date: '2026-07-03 15:11'
labels:
  - m2
dependencies: []
ordinal: 18000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
The two inputs in the add row have flex min-width:auto so they cannot shrink; the row overflows the card and the Add button renders behind the Listened card. Fix: min-w-0 on the inputs, shrink-0 on the button. Pre-existing on main, found while testing PR 1.
<!-- SECTION:DESCRIPTION:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
min-w-0 on both add-form inputs lets them shrink inside the flex row; shrink-0 keeps the Add button its natural size. No markup changes.
<!-- SECTION:NOTES:END -->
