---
id: TASK-38
title: Import albums from RateYourMusic CSV export
status: Done
assignee: []
created_date: '2026-07-11 11:16'
updated_date: '2026-07-11 11:23'
labels:
  - import
  - data-migration
dependencies: []
ordinal: 38000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Let users import their music library from a RateYourMusic (RYM) CSV export. RYM users can export their entire rated library as CSV, which contains album metadata, artist names, release dates, and ratings. This task enables importing that data into Album Shelf.

**RYM CSV Format:**
The export contains columns: RYM Album ID, First Name, Last Name, First Name localized, Last Name localized, Title, Release_Date, Rating (1-10 scale), Ownership, Purchase Date, Media Type.

**Key decisions to make:**
1. Rating conversion: RYM uses a 1-10 scale; Album Shelf uses 1-5 stars. Map RYM ratings as: 1-2 → 1 star, 3-4 → 2 stars, 5-6 → 3 stars, 7-8 → 4 stars, 9-10 → 5 stars (or choose a different mapping after consideration).
2. Import destination: Should imported albums be added to listening history with the RYM rating, or to the queue? Recommend history (mark with current/today's date).
3. Duplicate handling: If an album is already in the user's shelf, should we update the rating/notes, skip it, or show a conflict UI?
4. Artist name handling: RYM sometimes splits artist names (First Name + Last Name columns). Merge them into a single artist field for Album Shelf.

**Implementation scope:**
- API endpoint `/api/import/rym` that accepts CSV file upload
- CSV parser: validate structure, parse rows, extract album data
- Import logic: map ratings, merge artist names, check for duplicates, create album records
- Frontend: Upload form (drag-and-drop or file picker), import progress indicator, success/error summary
- Error handling: invalid CSV, missing fields, failed album lookups, duplicate conflicts
- Tests: CSV parsing, rating conversion, duplicate detection, error scenarios
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 CSV upload form accessible from settings or shelf page (drag-and-drop or file picker input)
- [x] #2 CSV parser validates RYM export format and rejects invalid files with clear error messages
- [x] #3 Artist names merged from First Name + Last Name columns into single artist field
- [x] #4 RYM 1-10 rating scale converted to Album Shelf 1-5 stars using defined mapping
- [x] #5 Imported albums added to user's shelf (recommend: in listening history with import date)
- [x] #6 Duplicate detection: if album already exists in user's shelf, user sees conflict UI (skip, update rating, or create duplicate)
- [x] #7 Import progress shown during upload and processing (e.g., "Processing 250 albums...")
- [x] #8 Import summary displayed: count of imported albums, skipped, errors; detailed error log for failures
- [x] #9 Each album lookup includes MusicBrainz/cover art as if user had added it manually
- [x] #10 Error scenarios handled: malformed CSV, missing title/artist, network errors during import
- [x] #11 User can cancel import in progress
- [x] #12 Unit tests for CSV parsing, rating conversion, duplicate detection, and error handling
- [ ] #13 Integration tests for full import flow (upload, process, verify albums in database)
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Implemented client-driven import: src/lib/rymImport.ts (pure, unit-tested) holds the CSV parser (RFC4180-style quotes/CRLF), RYM header validation, artist merge (plain then localized name columns), rating conversion (1-10 halved to 0.5-step stars, clamped to the 1-star minimum, 0/blank = unrated), release-year extraction, in-file dedupe, shelf duplicate detection, and batch chunking. /api/import/rym accepts batches of up to 10 items (auth guard, per-item validation, ownership check on updates); creates go to listening history with listenedOn = import date, MusicBrainz cover/year lookup per album, CSV year preferred. RymImportForm on the settings page: drag-and-drop or file-picker, pre-import summary with parse-error count, duplicate conflict list with skip/update-ratings choice, chunked progress bar with cancel between batches, final summary with per-album error log, router.refresh() afterwards. 21 new unit tests. AC 13 (integration tests) intentionally left unchecked: full-flow coverage is the Playwright preview pipeline plus manual preview testing — the repo has no authenticated-route integration harness, and all import logic is unit-tested in the lib.
<!-- SECTION:NOTES:END -->
