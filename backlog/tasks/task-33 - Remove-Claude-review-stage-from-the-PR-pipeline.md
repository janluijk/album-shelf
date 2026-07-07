---
id: TASK-33
title: Remove Claude review stage from the PR pipeline
status: Done
assignee: []
created_date: '2026-07-07 08:47'
updated_date: '2026-07-07 08:49'
labels:
  - m3
dependencies: []
ordinal: 32000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Drop the automatic AI code review (claude-review.yml) from the PR pipeline; the @claude mention workflow (claude.yml) stays. Update AGENTS.md, README.md and the ship/pipeline skills that describe the review stage.
<!-- SECTION:DESCRIPTION:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Deleted .github/workflows/claude-review.yml (auto-review on PR open); claude.yml (@claude mention responder) kept, so ANTHROPIC_API_KEY stays. Updated pipeline descriptions in AGENTS.md, README.md, ship and pipeline skills.
<!-- SECTION:NOTES:END -->
