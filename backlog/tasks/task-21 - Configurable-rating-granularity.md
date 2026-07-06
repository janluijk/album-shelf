---
id: TASK-21
title: Configurable rating granularity (decimal, half-star, integer)
status: To Do
assignee: []
created_date: '2026-07-06 12:10'
labels:
  - m3
  - settings
dependencies: []
ordinal: 20000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Let users choose how they rate albums: integer stars (current behavior), half-stars, or a decimal score (1.0–5.0). This is a large change; implement in phases, ideally one PR per phase, in this order:

1. Decimal ratings foundation — store and display ratings as decimals (1.0–5.0). Migrate the album `rating` column from integer to numeric (preserving existing values), and update rating validation (isValidRating) and all read/format paths accordingly.
2. Fractional star widget — extend StarRating so a star click sets a .0/.5 value based on click position, making stars and decimals two views of the same stored number.
3. Rating-granularity preference — add a per-user setting (integer | half | decimal) on the user row; the shelf reads it to decide how ratings are entered and shown. Default existing users to integer.
4. Settings page — a small settings surface to pick the rating granularity (could share a page with task-18 editable username if that lands).

Each phase should be split into its own executable subtask when picked up.

Substory of the Settings menu epic (task-22); phase 4 delivers its control on that page.
<!-- SECTION:DESCRIPTION:END -->
