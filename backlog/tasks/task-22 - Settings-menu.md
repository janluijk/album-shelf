---
id: TASK-22
title: Settings menu
status: Done
assignee:
  - '@claude'
created_date: '2026-07-06 12:31'
updated_date: '2026-07-06 13:02'
labels:
  - m3
  - settings
dependencies: []
ordinal: 21000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Epic: a user settings menu/page. Gives the per-user preferences that currently have no home a place to live, and room for future settings. Substories (tracked as separate tasks, grouped by the `settings` label):

- task-18 — view and edit username (slug validation + uniqueness check)
- task-21 — configurable rating granularity (integer / half-star / decimal); its final phase surfaces the preference here

Build the shared settings surface once — a route plus an entry point from the shelf — and let each substory plug its controls in incrementally.
<!-- SECTION:DESCRIPTION:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Add /settings server page: auth() guard (redirect to / when signed out), fetch the user row, render a settings card shell with account info and a back link. 2. Entry point: a Settings link in the shelf header. Substories (18, 21 phase 4) plug their controls into this page.
<!-- SECTION:PLAN:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Built the shared settings surface: /settings server page (auth() guard redirecting signed-out visitors to /, fetches the user row, Account card with name/email, back link) plus a Settings entry link in the shelf header. Substories 18 and 21 plug controls into this page. Verified: lint, typecheck, unit tests, build green (/settings appears as dynamic route).
<!-- SECTION:FINAL_SUMMARY:END -->
