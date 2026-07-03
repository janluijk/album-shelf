---
id: task-16
title: Preview deploy sign-in via Auth.js redirectProxyUrl
status: To Do
assignee: []
created_date: '2026-07-03 14:08'
labels:
  - m2
dependencies: []
ordinal: 14000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
GitHub OAuth apps accept one callback URL, so sign-in fails on per-PR preview URLs. Configure Auth.js redirectProxyUrl (production URL as proxy) so authenticated flows become testable on previews. Until then, preview manual testing covers signed-out surfaces only.
<!-- SECTION:DESCRIPTION:END -->
