---
id: TASK-32
title: Identity by handle and email (drop display name)
status: To Do
assignee: []
created_date: '2026-07-06 15:18'
updated_date: '2026-07-06 15:20'
labels:
  - m3
dependencies: []
ordinal: 31000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Identify accounts by @handle + email; drop the display Name from the UI. Seed the initial @handle from the GitHub display name (slugified, numeric suffix for uniqueness) instead of the email local-part: change deriveUsername to prefer name, falling back to the email prefix, then 'listener'. Keep the user.name column — Auth.js's Drizzle adapter writes it from the OAuth profile on sign-in, and it now serves purely as the handle seed; it is never shown. Remove the Name row from the settings Account card and use @username as the profile heading (not user.name ?? user.username). Existing users keep their current handle (editable via task 18); this only changes the default for new sign-ups. The UI removals share files with PR #16 (settings page, profile) so land after #16 merges; the deriveUsername change is isolated (src/lib/usernames.ts) and can ship anytime.
<!-- SECTION:DESCRIPTION:END -->
