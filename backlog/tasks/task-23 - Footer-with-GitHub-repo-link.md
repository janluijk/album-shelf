---
id: TASK-23
title: Footer with GitHub repo link
status: Done
assignee:
  - '@claude'
created_date: '2026-07-06 12:31'
updated_date: '2026-07-06 13:00'
labels:
  - m3
dependencies: []
ordinal: 22000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Add a site footer with a GitHub icon linking to the repository (https://github.com/janluijk/album-shelf). Style it with the existing design tokens (muted text, subtle top border) and show it across pages, including the public profile. Use an inline SVG for the icon (no new icon dependency) and open the link in a new tab with rel="noopener noreferrer".
<!-- SECTION:DESCRIPTION:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
Add a shared <footer> in src/app/layout.tsx (renders on all pages incl. /u/[username]): muted text, subtle top border, inline GitHub SVG icon linking to the repo in a new tab with rel=noopener noreferrer.
<!-- SECTION:PLAN:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Added a site footer in src/app/layout.tsx so it renders on every page (shelf, landing, public profile). Muted text on a subtle top border per design tokens, inline GitHub SVG (no icon dependency) linking to the repo in a new tab with rel=noopener noreferrer. Verified: lint, typecheck, 24 unit tests, production build all green.
<!-- SECTION:FINAL_SUMMARY:END -->
