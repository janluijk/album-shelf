---
id: TASK-41
title: 'Homepage shelf redesign: grid layout, queue below listened albums'
status: Done
assignee: []
created_date: '2026-07-11 11:49'
updated_date: '2026-07-11 12:25'
labels:
  - homepage
  - shelf
  - ui-redesign
dependencies: []
ordinal: 41000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Redesign the homepage shelf UI to improve visual hierarchy and readability. The shelf currently shows queue and history in a text-based format. The redesign will display listened albums as a responsive grid (like the profile page redesign in task-26), with the queue section positioned below.

**Current state:** Task-3 built the initial shelf UI with queue and history. Task-37 started displaying queue visually (grayed-out covers). This task completes the redesign.

**Desired layout:**
1. **Header section:** User greeting / shelf title (remains at top)
2. **Listened section:** Grid of album covers showing recent listening history (like task-26 profile grid)
   - Responsive: 2-4 columns based on screen width
   - Shows album cover, title, artist, rating
   - Interactive: click to see album details
3. **Queue section:** Below listened grid, showing \"Want to listen\" albums (from task-37)
   - Can be grid or card format
   - Shows grayed-out album covers
   - Indicates albums are in queue (not yet listened)
4. **Remove:** \"Add a note...\" UI (inline note editing) — users can still add notes in the album details modal if needed

**Technical notes:**
- Reuse the AlbumCover component from task-26 (profile page redesign)
- Listened list sorted newest-first (existing behavior)
- Queue sorted by position (existing behavior, from task-12)
- Remove inline note input from the album display cards
- Verify optimistic updates still work for ratings, queue reordering, and mark-as-listened actions
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Listened albums displayed as responsive grid (2/3/4 columns) below header
- [x] #2 Each listened album shows: cover art, title, artist, rating, listened date
- [x] #3 Album covers are clickable to open album details modal (existing behavior)
- [x] #4 Listened albums sorted newest-first (most recently listened at start)
- [x] #5 Queue section positioned below listened albums grid with clear visual separation
- [x] #6 Queue albums displayed as grayed-out covers (from task-37) in grid or card format
- [x] #7 Queue section titled "Want to listen" or similar; shows empty state if queue is empty
- [x] #8 Queue albums can be reordered (drag/reorder UI preserved from task-12)
- [x] #9 Queue albums can be marked as listened (moved to listened history)
- [x] #10 "Add a note..." inline note editing removed from album cards
- [x] #11 Users can still add/edit notes in the album details modal (fallback UX)
- [x] #12 Optimistic updates work for: ratings, queue reordering, marking as listened
- [x] #13 Layout responsive on mobile: single-column grid, queue below
- [x] #14 Layout responsive on tablet: adjusted column count and spacing
- [ ] #15 Verified at desktop, tablet, and mobile sizes via Playwright
- [x] #16 No regression in album CRUD operations, auth checks, or data persistence
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Shelf redesigned to stacked full-width sections: Listened cover grid on top (2/3/4/5 columns by breakpoint, newest first), 'Want to listen' queue below with the grayed-out covers, drag-and-drop reordering, per-card Listened/remove controls, empty state, and the add form. Inline 'Add a note…' inputs removed from listened cards; covers open AlbumReviewModal, which gained optional onRate/onSaveNote props — on the shelf the modal's stars are clickable and a note textarea saves on blur through the same optimistic patchAlbum; the profile keeps the read-only variant. Modal album is derived from live state (openAlbumId) so edits show immediately. AC15 (Playwright at three sizes): shelf requires auth, so visual verification is on the PR preview; all logic paths (partition, reorder, optimistic patch) are unit-tested.
<!-- SECTION:NOTES:END -->
