---
id: TASK-31
title: General notification / toast system
status: Done
assignee: []
created_date: '2026-07-06 15:15'
updated_date: '2026-07-07 09:01'
labels:
  - m3
dependencies: []
ordinal: 30000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Extract the ad-hoc settings toast (from task 21's rating-mode change) into a reusable notification system: a small animated toast (slide/fade in, auto-dismiss) that any client component can trigger for transient success/info/error messages. Likely a context/provider + a useNotify() hook, with a single toast container mounted in the root layout. Then replace the inline toast in RatingModeForm with it. Support stacking multiple messages and manual dismiss.
<!-- SECTION:DESCRIPTION:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
New ToastProvider (src/components/ToastProvider.tsx): context + useNotify() hook, stacked toasts bottom-right with slide/fade enter-exit animations, 6s auto-dismiss, manual dismiss button, info/success/error variants (error gets accent border), aria-live polite. Mounted once in the root layout. RatingModeForm's inline toast replaced with useNotify, including a new error toast on failed saves.
<!-- SECTION:NOTES:END -->
