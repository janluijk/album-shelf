---
id: TASK-11
title: Album cover art via MusicBrainz / Cover Art Archive
status: Done
assignee: []
created_date: '2026-07-03 12:34'
updated_date: '2026-07-03 12:59'
labels:
  - m3
dependencies: []
ordinal: 11000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Look up release art on add, store URL on the album row, show cover thumbnails on shelf and profile.
<!-- SECTION:DESCRIPTION:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Cover art looked up on album add: MusicBrainz release-group search (score >= 90) then Cover Art Archive front-250 thumbnail, verified reachable via HEAD. URL stored in album.cover_url (migration 0001). CoverThumb component with placeholder fallback on shelf and profile.
<!-- SECTION:NOTES:END -->
