---
id: task-16
title: Preview deploy sign-in via Auth.js redirectProxyUrl
status: Done
assignee: []
created_date: '2026-07-03 14:08'
updated_date: '2026-07-03 15:26'
labels:
  - m2
dependencies: []
ordinal: 14000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
GitHub OAuth apps accept one callback URL, so sign-in fails on per-PR preview URLs. Configure Auth.js redirectProxyUrl (production URL as proxy) so authenticated flows become testable on previews. Until then, preview manual testing covers signed-out surfaces only.
<!-- SECTION:DESCRIPTION:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Enabled via Auth.js redirectProxyUrl. auth.ts reads AUTH_REDIRECT_PROXY_URL; preview.yml and production.yml inject the production /api/auth URL at deploy time. Previews send the production callback as redirect_uri (stashing their own origin in OAuth state); production recognizes itself as the proxy and forwards the callback back to the preview, which completes the token exchange. Sign-in now works on every preview with only the production callback registered. Unset locally, so localhost dev uses its own callback directly.
<!-- SECTION:NOTES:END -->
