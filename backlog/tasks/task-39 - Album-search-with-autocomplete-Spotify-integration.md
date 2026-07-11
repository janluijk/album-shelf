---
id: TASK-39
title: Album search with autocomplete (using existing API)
status: To Do
assignee: []
created_date: '2026-07-11 11:18'
updated_date: '2026-07-11 12:13'
labels:
  - search
  - add-album
  - musicbrainz
dependencies: []
ordinal: 39000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Add album search functionality to Album Shelf with instant autocomplete suggestions as users type. Search by album name or artist name to quickly find and add albums without knowing the exact title.

**Integration approach:**
Use the existing album lookup API (MusicBrainz + Cover Art Archive) that already powers the app's album cover retrieval. Instead of adding a new external API dependency, leverage the current metadata fetching to provide search results. This approach reuses proven infrastructure and avoids additional third-party API credentials.

**Search implementation:**
- Query against the existing MusicBrainz integration to find albums by title/artist
- Fetch cover art from Cover Art Archive for search results
- Use the same album metadata pipeline already in place for manual album additions
- No new API credentials or rate limits to manage

**Search UX:**
- Input field on the album-add form or as a dedicated search page
- Show 5-10 results as autocomplete dropdown as user types
- Display: album cover, album title, artist(s), release year
- User taps/clicks result → auto-fills the form or creates the album
- Debounce search requests (300-500ms) to avoid excessive lookups
- Show loading state while searching
- Handle empty results gracefully (album not found in MusicBrainz)

**Acceptance criteria focus:**
- Search returns results quickly using existing infrastructure
- Autocomplete UI shows suggestions as user types
- Album selection from autocomplete populates the add-album form (or auto-creates)
- Cover art and metadata fetched same as manual album addition
- Search cached within session to minimize redundant lookups
- Tests cover search parsing, MusicBrainz lookup, error scenarios
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Search input field integrated into album-add form or dedicated search page
- [ ] #2 Search API endpoint (GET /api/albums/search?q=...) queries MusicBrainz for albums by title/artist
- [ ] #3 Search results display: album cover art (from Cover Art Archive), album title, artist name(s), release year
- [ ] #4 Autocomplete dropdown appears while typing; hidden on blur or when empty
- [ ] #5 Autocomplete requests debounced (300-500ms) to reduce MusicBrainz lookups
- [ ] #6 Selecting a result from autocomplete pre-fills the add-album form with fetched metadata
- [ ] #7 Cover art fetched from Cover Art Archive (same as manual album addition)
- [ ] #8 Loading state shown during search (spinner or skeleton)
- [ ] #9 Empty results message shown when album not found in MusicBrainz
- [ ] #10 MusicBrainz lookup errors caught and shown to user gracefully
- [ ] #11 Search works on mobile and desktop (responsive autocomplete positioning)
- [ ] #12 Cache duplicate searches within a session (5-10min) to avoid redundant lookups
- [ ] #13 Album metadata and covers retrieved using same pipeline as manual album addition (no inconsistency)
- [ ] #14 Unit tests for search query parsing, MusicBrainz API calls, error handling
- [ ] #15 Integration tests for full search flow (query → results → selection)
<!-- AC:END -->
