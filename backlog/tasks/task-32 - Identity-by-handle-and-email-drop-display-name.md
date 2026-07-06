---
id: TASK-32
title: Identity by handle and email (drop display name)
status: To Do
assignee: []
created_date: '2026-07-06 15:18'
labels:
  - m3
dependencies: []
ordinal: 31000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Identify accounts by @handle (username) + email (already the unique key); stop using the display Name. Remove the Name row from the settings Account card and use @username as the profile heading instead of user.name ?? user.username. Keep the user.name column — Auth.js's Drizzle adapter writes it from the OAuth profile on sign-in, so removing it needs adapter customization and risks breaking sign-in; just stop surfacing it in the UI. Shares files with PR #16 (settings page, profile), so land after #16 merges.
<!-- SECTION:DESCRIPTION:END -->
