---
id: TASK-41
title: 'Homepage shelf redesign: grid layout, queue below listened albums'
status: To Do
assignee: []
created_date: '2026-07-11 11:49'
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
- [ ] #1 Listened albums displayed as responsive grid (2/3/4 columns) below header
- [ ] #2 Each listened album shows: cover art, title, artist, rating, listened date
- [ ] #3 Album covers are clickable to open album details modal (existing behavior)
- [ ] #4 Listened albums sorted newest-first (most recently listened at start)
- [ ] #5 Queue section positioned below listened albums grid with clear visual separation
- [ ] #6 Queue albums displayed as grayed-out covers (from task-37) in grid or card format
- [ ] #7 Queue section titled "Want to listen" or similar; shows empty state if queue is empty
- [ ] #8 Queue albums can be reordered (drag/reorder UI preserved from task-12)
- [ ] #9 Queue albums can be marked as listened (moved to listened history)
- [ ] #10 "Add a note..." inline note editing removed from album cards
- [ ] #11 Users can still add/edit notes in the album details modal (fallback UX)
- [ ] #12 Optimistic updates work for: ratings, queue reordering, marking as listened
- [ ] #13 Layout responsive on mobile: single-column grid, queue below
- [ ] #14 Layout responsive on tablet: adjusted column count and spacing
- [ ] #15 Verified at desktop, tablet, and mobile sizes via Playwright
- [ ] #16 No regression in album CRUD operations, auth checks, or data persistence
<!-- AC:END -->
