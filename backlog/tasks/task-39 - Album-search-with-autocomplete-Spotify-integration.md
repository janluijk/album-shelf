---
id: TASK-39
title: Album search with autocomplete (Spotify integration)
status: To Do
assignee: []
created_date: '2026-07-11 11:18'
labels:
  - search
  - spotify
  - add-album
dependencies: []
ordinal: 39000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Add album search functionality to Album Shelf. Users should be able to search by album name or artist name with instant suggestions as they type (autocomplete). This enables users to quickly find and add albums without knowing the exact title or artist.

**Integration approach:**
Use Spotify Web API to search for albums. Spotify provides reliable metadata, cover art URLs, and high availability. The search endpoint is `GET /v1/search?q={query}&type=album` returning album + artist metadata that maps directly to Album Shelf's schema.

**Setup required:**
1. Create a Spotify Developer app (free tier supports unlimited searches)
   - Register at https://developer.spotify.com/dashboard
   - Create a new app (name: \"Album Shelf\")
   - Accept terms, get Client ID and Client Secret
2. Store credentials in Vercel env vars: `SPOTIFY_CLIENT_ID` and `SPOTIFY_CLIENT_SECRET`
3. Implement Spotify OAuth token endpoint to get access tokens (Client Credentials flow)
4. Add `.env.example` entries for local development

**Search UX:**
- Input field on the album-add form or as a dedicated search page
- Show 5-10 results as autocomplete dropdown
- Display: album cover, album title, artist(s), release year
- User taps/clicks result → auto-fills the form or creates the album
- Debounce search requests (300-500ms) to avoid excessive API calls
- Show loading state while searching
- Handle empty results gracefully

**Acceptance criteria focus:**
- Spotify API credentials working in local dev and production
- Search API endpoint returns results in <200ms (typical response time)
- Autocomplete UI shows suggestions as user types
- Album selection from autocomplete populates the add-album form (or auto-creates)
- Rate limiting: cache duplicate searches, handle rate limit errors gracefully
- No exposure of Spotify credentials in client-side code
- Tests cover search parsing, Spotify API calls, error scenarios
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Spotify Developer app created and credentials stored in Vercel env vars (SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET)
- [ ] #2 Spotify OAuth Client Credentials token flow implemented; fresh token obtained and cached
- [ ] #3 Search input field integrated into album-add form or dedicated search page
- [ ] #4 Search API endpoint (GET /api/albums/search?q=...) returns top 5-10 album matches from Spotify
- [ ] #5 Search results display: album cover art, album title, artist name(s), release year
- [ ] #6 Autocomplete dropdown appears while typing; hidden on blur or when empty
- [ ] #7 Autocomplete requests debounced (300-500ms) to reduce API calls
- [ ] #8 Selecting a result from autocomplete pre-fills the add-album form with fetched metadata
- [ ] #9 Loading state shown during search (spinner or skeleton)
- [ ] #10 Empty results message shown when no albums match
- [ ] #11 Spotify rate limit errors caught and shown to user gracefully
- [ ] #12 Search works on mobile and desktop (responsive autocomplete positioning)
- [ ] #13 Spotify credentials never exposed in client-side code or API responses
- [ ] #14 Cache duplicate searches within a session (5-10min) to avoid redundant API calls
- [ ] #15 Unit tests for search query parsing, Spotify API client, error handling
- [ ] #16 Integration tests for full search flow (query → results → selection)
- [ ] #17 Local dev setup documented: .env.example updated with SPOTIFY_CLIENT_ID/SECRET placeholders
<!-- AC:END -->
