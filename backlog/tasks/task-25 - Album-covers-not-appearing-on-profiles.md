---
id: TASK-25
title: Album covers not appearing on profiles
status: Done
assignee: []
created_date: '2026-07-06 13:46'
updated_date: '2026-07-07 08:44'
labels:
  - m3
dependencies: []
ordinal: 24000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
cover_url is set on add via MusicBrainz + Cover Art Archive (task 11), but profiles show mostly placeholders. Investigate: MusicBrainz lookups likely failing in prod (rate limiting, User-Agent, or the score>=90 gate too strict), or albums added before task 11 have null cover_url. Add resilience (retry / looser match), consider a one-off backfill of existing rows, and confirm CoverThumb renders stored URLs on the profile.
<!-- SECTION:DESCRIPTION:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Root cause: all 5 null-cover rows predated task 11 (created 2026-07-03, cover-art merged 2026-07-06) — the lookup itself works (probed all 3 titles: score 100, CAA 200). Fixes: (1) lookupCoverUrl now searches with limit=5 and tries every candidate with score>=90 until one has art on Cover Art Archive (top hit can 404 on CAA while a lower-scored release group has art); (2) one-off backfill script scripts/backfill-covers.ts (npx tsx, 1.1s MusicBrainz rate-limit spacing) — ran it against the production DB, all 5 albums now have covers. CoverThumb on the profile already renders stored URLs correctly.
<!-- SECTION:NOTES:END -->
