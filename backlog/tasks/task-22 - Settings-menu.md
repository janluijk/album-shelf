---
id: TASK-22
title: Settings menu
status: Done
assignee: []
created_date: '2026-07-06 12:31'
updated_date: '2026-07-06 13:20'
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

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Shared settings surface delivered: /settings route (server component, auth-guarded, redirects to / when signed out) with an Account card showing the current username (links to the public profile) and email, styled with the design tokens. Entry point is a gear icon (inline SVG, aria-label "Settings") in the shelf header — no text label, per request. The substories extend this page: task-18 makes the username editable in place, task-21 (phase 4) adds a rating-granularity card. Those remain open as separate tasks.
<!-- SECTION:NOTES:END -->
