---
name: pipeline
description: Operate and troubleshoot the album-shelf deployment pipeline — GitHub Actions workflows, Vercel deploys, Neon database branches, secrets, and known failure modes. Use when CI fails, a deploy misbehaves, or checking pipeline and deployment status.
---

# Pipeline operations

## Deployed infrastructure

- Production: **https://album-shelf-seven.vercel.app** — Vercel project `album-shelf`, team `dlg03s-projects`. No Vercel Git integration; GitHub Actions owns all deploys.
- Database: Neon project `album-shelf` (`purple-dawn-20749038`, aws-us-west-2, PG17). Each PR preview runs on Neon branch `preview/pr-N`, deleted when the PR closes.
- Secrets: 8 GitHub Actions secrets, listed in README.md. Vercel holds runtime env for Production + Preview; preview deploys get `DATABASE_URL` overridden per-deployment to the PR's Neon branch.

## Workflows (.github/workflows/)

| Workflow | Trigger | Does |
| --- | --- | --- |
| `ci.yml` | PR + push main | lint, typecheck, unit tests, build |
| `preview.yml` | PR | Neon branch → migrate → vercel build+deploy → Playwright e2e → URL comment |
| `preview-cleanup.yml` | PR closed | delete the Neon branch |
| `production.yml` | push main | tests → migrate prod DB → vercel deploy --prod |
| `claude.yml` | @claude mention | Claude implements/answers in the issue/PR |

## Everyday commands

```bash
gh pr checks <n> --watch          # check status of a PR's pipeline
gh run list --limit 10            # recent workflow runs
gh run view <id> --log-failed     # why a run failed
gh run rerun <id>                 # rerun a failed or stale run
vercel ls / vercel logs <url>     # deployments and runtime logs
npx neonctl branches list --project-id purple-dawn-20749038
```

## Known failure modes

| Symptom | Cause | Fix |
| --- | --- | --- |
| `npm ci` fails on runners but works on Windows | lockfile written with invalid optional-peer resolution | see "Dependency gotchas" in AGENTS.md; regenerate with clean `node_modules`, keep `esbuild`/`picomatch` root devDeps |
| `next build` in a workflow can't reach env vars | `vercel build` does not inject pulled env into `next build` | pass `DATABASE_URL` (and friends) explicitly in the step `env:` — ci/preview/production already do |
| Playwright e2e gets 401 on preview | Vercel deployment protection | `VERCEL_AUTOMATION_BYPASS_SECRET` must be set; playwright.config sends the bypass header |
| Production sign-in fails | OAuth callback mismatch | GitHub OAuth app callback must be exactly `https://album-shelf-seven.vercel.app/api/auth/callback/github` |
| Rollback needed | bad deploy on main | `vercel rollback` (or promote a previous deployment in the Vercel dashboard), then revert the commit on main |

## Schema migrations

Migrations in `drizzle/` run automatically: against the PR's Neon branch in `preview.yml`, against production in `production.yml` before deploy. They must be backward-compatible with the currently deployed code (deploy happens after migrate).
