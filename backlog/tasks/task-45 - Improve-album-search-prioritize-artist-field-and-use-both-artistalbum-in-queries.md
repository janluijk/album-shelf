---
id: TASK-45
title: >-
  Improve album search: prioritize artist field and use both artist+album in
  queries
status: To Do
assignee: []
created_date: '2026-07-13 09:02'
labels: []
dependencies: []
ordinal: 45000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
The album search autocomplete feature (TASK-39) currently allows searching by album title and artist, but the UI doesn't emphasize the artist field and the search may not be using both fields optimally in the MusicBrainz query.

This task improves the search experience by:
1. **UI reordering:** Move the artist field above the album field so users naturally enter artist first
2. **Better search:** Use both artist AND album name together in the MusicBrainz search query to get more relevant results
3. **Stronger matching:** Prioritize results where both artist and album match over partial matches

This makes the search more intuitive and returns higher-quality results, especially for albums with common titles.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Artist field appears above the album field in the add-album form
- [ ] #2 Search query includes both artist and album name parameters (e.g., 'artist:X album:Y' format if supported by MusicBrainz)
- [ ] #3 Results are prioritized by relevance: exact artist+album match scores highest
- [ ] #4 Search works when only artist is entered (matches any album by that artist)
- [ ] #5 Search works when only album is entered (falls back to current behavior)
- [ ] #6 Both artist and album fields are auto-filled from search results, not just the album
- [ ] #7 AlbumAutocomplete component displays both artist and album in the input field
- [ ] #8 Autocomplete suggestions clearly show artist name alongside album title for visual matching
- [ ] #9 Responsive on mobile: fields stack vertically, artist field still appears first
- [ ] #10 Verify search quality improvement with test cases (e.g., albums with duplicate titles by different artists)
<!-- AC:END -->
