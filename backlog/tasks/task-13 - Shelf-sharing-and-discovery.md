---
id: TASK-13
title: Shelf sharing and discovery
status: Done
assignee: []
created_date: '2026-07-03 12:34'
updated_date: '2026-07-07 09:11'
labels:
  - m3
dependencies: []
ordinal: 13000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Opt-out visibility + discovery. Decided with the user (2026-07-07): shelves stay public by default (shelf_public boolean, default true, toggle in settings); private shelves 404 for everyone but the owner; public browse page at /shelves listing public shelves (@handle, bio snippet, listened count) linked from the footer.
<!-- SECTION:DESCRIPTION:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Scope decided with user: public by default + browse page. Added boolean shelf_public (default true, migration 0005_sour_typhoid_mary — regenerate when merging after the other 0005 PRs). VisibilityForm radio (public/private) in a new settings Visibility section; PATCH /api/user accepts shelfPublic boolean. /u/[username] 404s for private shelves unless the session user owns it. New /shelves page (force-dynamic) lists public shelves with @handle, listened count and 2-line bio, ordered by listened count; footer links Browse shelves.
<!-- SECTION:NOTES:END -->
