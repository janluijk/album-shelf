---
id: TASK-28
title: Album review modal on the profile
status: Done
assignee: []
created_date: '2026-07-06 13:47'
updated_date: '2026-07-11 11:56'
labels:
  - m3
dependencies:
  - TASK-26
  - TASK-27
ordinal: 27000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Clicking an album on a profile opens a review modal: an animated overlay (window on top of the page) showing the large cover, title, artist/band, release year, rating and review notes. Accessible: focus trap, Esc to close, backdrop click. Builds on the profile cover grid and album metadata.
<!-- SECTION:DESCRIPTION:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Profile album grid moved into a client component (ProfileAlbumGrid) where each cover is a button opening AlbumReviewModal: animated overlay (CSS keyframes modal-fade backdrop + modal-pop panel, 200ms), large cover, title, artist, release year, star rating in the profile's granularity, listened date, and the review note. Accessible: role=dialog aria-modal, focus moves to the close button on open, Tab cycle trapped inside the panel, Esc closes, backdrop click closes (panel clicks stop propagation).
<!-- SECTION:NOTES:END -->
