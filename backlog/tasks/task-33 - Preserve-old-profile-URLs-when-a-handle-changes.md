---
id: TASK-33
title: Preserve old profile URLs when a handle changes
status: To Do
assignee: []
created_date: '2026-07-06 15:18'
labels:
  - m3
dependencies:
  - TASK-18
ordinal: 32000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
When a user changes their @handle, the old /u/<old> URL must keep resolving to the same account at the new /u/<new>. Add a username-alias table (alias text primary key -> userId fk) via a generated migration. On handle change in PATCH /api/user, insert the old username as an alias for that user (and remove the alias if they reclaim their own old handle). Extend the uniqueness check so a handle held in any other user's alias history counts as taken (old handles stay reserved -> aliases resolve unambiguously). In /u/[username]: if no current user matches, look up the alias and permanent-redirect (308) to the current /u/<currentHandle>; else notFound. Shares /api/user and the profile route with PR #16, so land after #16 merges.
<!-- SECTION:DESCRIPTION:END -->
