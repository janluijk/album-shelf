---
id: TASK-27
title: Store album release year and richer metadata
status: Done
assignee: []
created_date: '2026-07-06 13:47'
updated_date: '2026-07-07 09:04'
labels:
  - m3
dependencies: []
ordinal: 26000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Store richer album metadata needed by the review modal, starting with release year. Add column(s) to the album schema (migration) and enrich on add from MusicBrainz (first-release-date) alongside the existing cover lookup. Degrade gracefully like the cover lookup; backfill optional.
<!-- SECTION:DESCRIPTION:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Added integer release_year column to album (migration 0005). Refactored coverArt lib: lookupCoverUrl -> lookupAlbumMetadata returning {coverUrl, releaseYear}; year parsed from the first confident release-group's first-release-date (parseReleaseYear validates 1000-2999), cover still from the first candidate with art on CAA. POST /api/albums stores both. Backfill script renamed to scripts/backfill-metadata.ts and now fills covers and years (coalesce, only missing values) — run it after this merges (column must exist in prod first).
<!-- SECTION:NOTES:END -->
