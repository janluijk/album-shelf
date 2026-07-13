---
id: TASK-43
title: 'Limit listened albums on homepage to 5 recent, add link to full history page'
status: To Do
assignee: []
created_date: '2026-07-13 08:56'
labels: []
dependencies: []
ordinal: 43000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Currently, the homepage shelf displays all listened albums as a massive list. This creates visual clutter and makes the page feel overwhelming. The goal is to show only the 5 most recently listened albums on the main shelf, with a clear link to view the full listening history on a dedicated page.

This improves the homepage UX by keeping it focused and scannable, while still allowing users to access their complete listening history when needed.

**Related tasks:** TASK-41 covers the grid redesign for the shelf layout; this task focuses on pagination and the history page.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Homepage shelf displays only the 5 most recently listened albums (ordered by listenedOn DESC)
- [ ] #2 A 'View all' or 'All albums' link appears on the homepage that navigates to the full history page
- [ ] #3 New page at /shelf/history (or /listened-history) displays the complete listening history in the same grid format as the homepage
- [ ] #4 Full history page is paginated or has infinite scroll to handle large libraries
- [ ] #5 Clicking an album on either the homepage or history page opens the album details modal (existing behavior)
- [ ] #6 History page shows album count or total number of albums listened
- [ ] #7 History page has clear navigation back to the homepage shelf
- [ ] #8 Ratings, notes, and other album interactions work identically on both the homepage and history page
- [ ] #9 Verify responsive layout on mobile, tablet, and desktop for both pages
<!-- AC:END -->
