---
id: TASK-32
title: Identity by handle and email (drop display name)
status: To Do
assignee: []
created_date: '2026-07-06 15:18'
updated_date: '2026-07-06 15:24'
labels:
  - m3
dependencies: []
ordinal: 31000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Remove the display Name entirely (no name column) and identify accounts by @handle + email (email is the unique key). Auth.js's Drizzle adapter createUser inserts name/email/emailVerified/image, so dropping the column needs a custom adapter: wrap DrizzleAdapter and override createUser to derive a unique @handle from the incoming GitHub profile name (slugified via deriveUsername with a numeric suffix for uniqueness; fall back to the email local-part, then listener) and insert only existing columns (username, email, emailVerified, image, id) with no name. Then drop the user.name column via a generated migration, fold the current events.createUser username assignment into the custom createUser, remove the Name row from the settings Account card, and use @username as the profile heading. Update deriveUsername to prefer name over the email prefix. Existing users keep their handle. Adapter/schema work plus UI that shares files with PR #16 (settings page, profile), so land after #16 merges.
<!-- SECTION:DESCRIPTION:END -->
