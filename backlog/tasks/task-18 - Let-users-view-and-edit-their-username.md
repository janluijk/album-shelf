---
id: TASK-18
title: Let users view and edit their username
status: Done
assignee:
  - '@claude'
created_date: '2026-07-03 14:38'
updated_date: '2026-07-06 13:47'
labels:
  - m3
  - settings
dependencies:
  - TASK-22
ordinal: 17000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Usernames are auto-derived from the GitHub primary email prefix (e.g. luijk-jan), which users never chose. Add a small settings surface to change it: unique-check, slug validation, and update links. Public profile URLs change with it - acceptable pre-launch.

Substory of the Settings menu epic (task-22).
<!-- SECTION:DESCRIPTION:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. src/lib/usernames.ts: add isValidUsername (lowercase slug, 3-30 chars, no leading/trailing hyphen) + unit tests. 2. PATCH /api/user: auth guard 401, validate 400, uniqueness check 409, update and return username. 3. UsernameForm client component on /settings: shows current username + public URL, saves via fetch, surfaces invalid/taken errors. Header/profile links read username per request so they follow automatically.
<!-- SECTION:PLAN:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Username is now viewable and editable on /settings. Added isValidUsername + usernameRules to src/lib/usernames.ts (lowercase slug, 3-30 chars, no edge hyphens) with unit tests; PATCH /api/user guards auth (401), validates (400), uniqueness-checks against other users (409), then updates; UsernameForm client component saves via fetch, surfaces errors, and shows the /u/<username> link which changes with the name. Verified: lint, typecheck, 28 unit tests, build green.
<!-- SECTION:FINAL_SUMMARY:END -->
