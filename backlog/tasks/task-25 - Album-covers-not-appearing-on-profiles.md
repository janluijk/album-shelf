---
id: TASK-25
title: Album covers not appearing on profiles
status: To Do
assignee: []
created_date: '2026-07-06 13:46'
labels:
  - m3
dependencies: []
ordinal: 24000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
cover_url is set on add via MusicBrainz + Cover Art Archive (task 11), but profiles show mostly placeholders. Investigate: MusicBrainz lookups likely failing in prod (rate limiting, User-Agent, or the score>=90 gate too strict), or albums added before task 11 have null cover_url. Add resilience (retry / looser match), consider a one-off backfill of existing rows, and confirm CoverThumb renders stored URLs on the profile.
<!-- SECTION:DESCRIPTION:END -->
