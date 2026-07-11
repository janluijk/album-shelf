---
id: TASK-37
title: Display queue (want to listen) as grayed-out album covers on shelf
status: To Do
assignee: []
created_date: '2026-07-11 11:00'
labels:
  - shelf
  - queue
  - ui
dependencies: []
ordinal: 37000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Add a visual queue section to the shelf UI showing albums the user wants to listen to. Currently, the queue exists in the database (albums with `listenedOn = null`, ordered by `position`), but it's not visually distinct on the shelf.

Display queue albums as a separate section above or alongside the listening history, with grayed-out/desaturated album covers to visually distinguish them from listened albums. This gives users an at-a-glance view of what's next on their list.

The queue functionality already exists:
- Database schema: `album.listenedOn = null` indicates a queue entry (vs a date for listened albums)
- API: Already supports fetching and reordering queue items
- Current shelf UI: Shows queue and history together; this task separates them visually

Design considerations:
- Section title: \"Queue\" or \"Want to listen\"?
- Layout: Grid of covers like the history section, but with reduced opacity or grayscale
- Interaction: Users should still be able to rate/note queue items before listening, mark as listened, reorder, or remove
- Empty state: Message when no queue items (e.g., \"Your queue is empty\")
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Queue section added to shelf UI above or clearly separated from listening history
- [ ] #2 Queue album covers displayed as grayed-out (reduced opacity, desaturated, or other visual technique) to distinguish from listened albums
- [ ] #3 Queue section title displayed ("Queue" or "Want to listen")
- [ ] #4 Empty state shown when queue has no items
- [ ] #5 Users can still interact with queue items: mark as listened, reorder, add/edit ratings and notes, remove
- [ ] #6 Layout is responsive on mobile (covers don't overflow, text is readable)
- [ ] #7 Verified: Queue and history are not mixed together visually
- [ ] #8 Unit or integration tests added for queue section display logic
<!-- AC:END -->
