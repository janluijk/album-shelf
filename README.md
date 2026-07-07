# Album Shelf

Queue albums you want to hear, rate the ones you have, and share your shelf at `/u/<username>`.

**Live**: https://album-shelf-seven.vercel.app

Built with Next.js 16, Tailwind v4, Drizzle ORM, Auth.js and Neon Postgres. Deployed to Vercel through GitHub Actions. Agent-facing documentation lives in [AGENTS.md](./AGENTS.md) / [CLAUDE.md](./CLAUDE.md); the task backlog lives in [backlog/](./backlog/) (managed with [backlog.md](https://github.com/MrLesk/Backlog.md)).

## Local development

```bash
npm install
cp .env.example .env   # fill in the values below
npm run db:migrate
npm run dev
```

| Variable | Where it comes from |
| --- | --- |
| `DATABASE_URL` | Neon project connection string (pooled) |
| `AUTH_SECRET` | `npx auth secret` |
| `AUTH_GITHUB_ID` / `AUTH_GITHUB_SECRET` | GitHub OAuth app with callback `http://localhost:3000/api/auth/callback/github` |

Quality gates: `npm run lint`, `npm run typecheck`, `npm run test`, `npm run test:e2e`.

## Deployment pipeline

Everything deploys through GitHub Actions — disable Vercel's own git integration for this repo.

```
PR opened ──> CI (lint, typecheck, unit tests, build)
          ──> Preview: Neon branch preview/pr-N ─> migrate ─> vercel deploy ─> Playwright e2e ─> URL comment
PR closed ──> Neon branch deleted
merge to main ──> tests ─> migrate production DB ─> vercel deploy --prod
@claude in issues/PR comments ──> Claude implements or answers
```

### Required GitHub Actions secrets

| Secret | Purpose |
| --- | --- |
| `VERCEL_TOKEN` | Vercel CLI deploys |
| `VERCEL_ORG_ID` / `VERCEL_PROJECT_ID` | From `.vercel/project.json` after `vercel link` |
| `NEON_API_KEY` / `NEON_PROJECT_ID` | Neon branch create/delete per PR |
| `DATABASE_URL` | Production Neon connection string (migrations on deploy) |
| `VERCEL_AUTOMATION_BYPASS_SECRET` | Lets Playwright through Vercel deployment protection |
| `ANTHROPIC_API_KEY` | `@claude` workflow |

Vercel project env vars (production + preview): `DATABASE_URL`, `AUTH_SECRET`, `AUTH_GITHUB_ID`, `AUTH_GITHUB_SECRET`. Preview deploys get their `DATABASE_URL` overridden per-deployment to the PR's Neon branch.

### Sign-in on preview deploys

Each PR gets a fresh preview URL, but a GitHub OAuth app allows only one callback URL. The deploy workflows inject `AUTH_REDIRECT_PROXY_URL` (the production `/api/auth`) into both preview and production deployments, so Auth.js routes every OAuth flow through the production callback and forwards it back to the originating preview. This means sign-in works on all previews with only the production callback registered — no per-preview OAuth app or callback changes. The variable stays unset locally, where sign-in uses the localhost callback directly.

## Schema changes

Edit `src/lib/db/schema.ts`, then `npm run db:generate` and commit the migration in `drizzle/`. Migrations run automatically: against the PR's Neon branch on preview deploys, against production on merge to `main`. Never use `drizzle-kit push`.
