---
id: TASK-27
title: Store album release year and richer metadata
status: To Do
assignee: []
created_date: '2026-07-06 13:47'
labels:
  - m3
dependencies: []
ordinal: 26000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Store richer album metadata needed by the review modal, starting with release year. Add column(s) to the album schema (migration) and enrich on add from MusicBrainz (first-release-date) alongside the existing cover lookup. Degrade gracefully like the cover lookup; backfill optional.
<!-- SECTION:DESCRIPTION:END -->
