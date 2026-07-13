---
id: TASK-44
title: Allow searching for correct album cover when the wrong one is added
status: To Do
assignee: []
created_date: '2026-07-13 09:01'
labels: []
dependencies: []
ordinal: 44000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
When a user adds an album to their shelf, sometimes the album cover fetched from the API is incorrect or belongs to a different release/edition. Currently, there's no way to fix this.

This task adds the ability for users to search for and select the correct album cover for any listened album. When viewing an album (either on the shelf or in the details modal), users should be able to open a search dialog to find the correct album and update its cover art.

**Related context:** Task-43 added album search autocomplete with the `AlbumAutocomplete` component for Spotify integration. This feature reuses that component to allow cover replacement.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 User can access album cover search from the album details modal (e.g., via a button or icon on the cover image)
- [ ] #2 Clicking to search opens an album search dialog using the existing AlbumAutocomplete component
- [ ] #3 Search results show album covers so user can visually compare and select the correct one
- [ ] #4 Selecting an album from search updates the listened album's cover art in the database
- [ ] #5 Cover image refreshes immediately in the UI after selection (no page reload needed)
- [ ] #6 User can cancel the search without making changes
- [ ] #7 Update works for any listened album regardless of source (manual entry, import, etc.)
- [ ] #8 No change to the album's other properties (title, artist, rating, notes) when updating cover
- [ ] #9 Verify optimistic update behavior works correctly
<!-- AC:END -->
