---
id: TASK-6
title: Provision Neon project and generate first migration
status: Done
assignee: []
created_date: '2026-07-03 12:33'
updated_date: '2026-07-03 13:01'
labels:
  - m2
dependencies: []
ordinal: 6000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Create Neon project, set DATABASE_URL in .env, run npm run db:generate and db:migrate. Enable branch-per-PR in the pipeline afterwards.
<!-- SECTION:DESCRIPTION:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Neon project album-shelf created (id purple-dawn-20749038, aws-us-west-2, PG17). Pooled DATABASE_URL written to local .env, existing migration applied via npm run db:migrate, 5 tables verified (user, account, session, verificationToken, album). NEON_API_KEY created manually in console for GitHub Actions.
<!-- SECTION:NOTES:END -->
