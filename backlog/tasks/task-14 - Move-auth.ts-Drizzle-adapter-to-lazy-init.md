---
id: TASK-14
title: Move auth.ts Drizzle adapter to lazy init
status: To Do
assignee: []
created_date: '2026-07-03 13:55'
labels:
  - m2
dependencies: []
ordinal: 14000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
src/auth.ts constructs DrizzleAdapter(getDb()) at module scope, contradicting the lazy-init convention and forcing workflows to pass DATABASE_URL at build time. Investigate NextAuth v5 lazy config (function form) so builds need no database env at all.
<!-- SECTION:DESCRIPTION:END -->
