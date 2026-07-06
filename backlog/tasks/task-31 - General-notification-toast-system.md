---
id: TASK-31
title: General notification / toast system
status: To Do
assignee: []
created_date: '2026-07-06 15:15'
labels:
  - m3
dependencies: []
ordinal: 30000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Extract the ad-hoc settings toast (from task 21's rating-mode change) into a reusable notification system: a small animated toast (slide/fade in, auto-dismiss) that any client component can trigger for transient success/info/error messages. Likely a context/provider + a useNotify() hook, with a single toast container mounted in the root layout. Then replace the inline toast in RatingModeForm with it. Support stacking multiple messages and manual dismiss.
<!-- SECTION:DESCRIPTION:END -->
