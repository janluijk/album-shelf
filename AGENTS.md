<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Album Shelf

A standalone web app to queue, rate and share music albums. Users sign in with GitHub, keep a listening queue, rate albums 1–5 stars with notes, and share a public shelf at `/u/<username>`.

## Stack

- Next.js 16 (App Router) + React 19 + TypeScript, strict mode
- Tailwind CSS v4 — no component library, custom UI on CSS variable tokens
- Drizzle ORM + Neon Postgres (`@neondatabase/serverless`, HTTP driver)
- Auth.js v5 (next-auth beta) with the Drizzle adapter, GitHub provider, database sessions
- Vitest for unit tests, Playwright for e2e
- Hosted on Vercel; deploys run through GitHub Actions (never push directly to Vercel)

## Commands

- `npm run dev` — dev server
- `npm run lint` / `npm run typecheck` — must both pass with zero warnings
- `npm run test` — Vitest unit tests
- `npm run test:e2e` — Playwright (starts dev server locally; set `PLAYWRIGHT_BASE_URL` to target a deploy)
- `npm run db:generate` — generate SQL migration from schema changes (commit the output in `drizzle/`)
- `npm run db:migrate` — apply migrations to `DATABASE_URL`
- Never use `drizzle-kit push`; migrations are the only path to schema changes

## Architecture and conventions

- `src/lib/db/schema.ts` — single schema file. Albums with `listenedOn = null` are the queue (ordered by `position`); a set date means listening history.
- Database access goes through `getDb()` in `src/lib/db/index.ts` (lazy singleton — keeps builds free of a live `DATABASE_URL`).
- Pure domain logic lives in `src/lib/*.ts` (no framework imports) so it stays unit-testable; UI and routes stay thin.
- Pages fetch data server-side and pass it to client components as `initial*` props; client components update local state optimistically and sync via `fetch` to `/api/*`.
- Every API route guards with `auth()` and returns 401 when unauthenticated; mutations additionally verify the row belongs to the session user.
- Design tokens live in `src/app/globals.css`: `--background #0b0d12`, `--card #14171f`, `--card-border #232733`, `--accent #fc5200`, `--muted #8a92a4`, `--foreground #e6e8ee`. Recurring patterns: cards are `rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-5`; section labels are `text-xs uppercase tracking-wider text-[var(--muted)]`; inputs are transparent with `focus:border-[var(--accent)]`.

## Code style

- No code comments — write code that reads without them
- Guard clauses / early returns, with a named boolean when the condition isn't self-evident
- Avoid try/catch unless it is clearly the better option

## Workflow and quality bar

- Work happens on branches + PRs into `main`; `main` deploys to production automatically
- The pipeline per PR: CI (lint, typecheck, unit tests, build) → preview deploy on an isolated Neon database branch → Playwright e2e against the preview URL → Claude code review. All must be green before merge.
- The task backlog lives in `backlog/` (managed with the `backlog` CLI — see CLAUDE.md). Pick up tasks from there and update their status as you work.
- Before writing code against Next.js, Tailwind v4, Drizzle or Auth.js APIs you are not certain about, resolve current docs via the Context7 MCP (configured in `.mcp.json`) instead of relying on memory — these libraries move fast.
- To verify UI changes visually, use the Playwright MCP against `npm run dev`.

## Branch and task dependencies

- Depend through `main`, not through branches. When task B builds on task A, merge A to `main` first, then branch B off `main`. If a PR lints/builds green *without* its dependency merged, it is carrying a private copy of that dependency — a red flag it will collide (e.g. a settings-dependent PR that renders its own settings page).
- Avoid stacked PRs. If you must stack, do not squash-merge the base — squash rewrites the commit SHA and orphans the child branch into merge conflicts. Use a merge commit for the base, or rebase the child onto `main` the moment the base merges.
- One owner per area at a time. Do not run two Claude sessions against this repo at once (a lingering web session or the `@claude` workflow counts); if unavoidable, partition them to non-overlapping files/tasks. Concurrent edits to the same files/branches are the main source of conflicts and duplicated work.
- Sequential merges also protect migrations: two open PRs that each add `000X` collide. Merge one, then regenerate the other with `npm run db:generate`.
- Encode order in the backlog: `backlog task create --parent <id> --dep <id>` creates real subtasks (`task-21.1`) and dependency edges. Before opening a PR for a task, run `backlog task view <id>` and don't start until its `--dep` tasks are Done/merged.
- Create each backlog task exactly once, on `main` (or one branch) — never re-create the same task both in a PR branch and on `main`, or the files collide (add/add) on merge.

## Dependency gotchas

- `esbuild` and `picomatch` are root devDependencies only to satisfy optional peer ranges of vite 8 and fdir — without them npm hoists older transitive versions into those slots and writes a lockfile that `npm ci` rejects on the Linux CI runners. Do not remove them.
- After adding or updating dependencies on Windows, run `npm ci` locally and check `npm ls` for `invalid` entries before pushing; an invalid tree here can still install locally while breaking CI.

## Environment

Copy `.env.example` to `.env`. Required: `DATABASE_URL` (Neon), `AUTH_SECRET` (`npx auth secret`), `AUTH_GITHUB_ID` / `AUTH_GITHUB_SECRET` (GitHub OAuth app). GitHub Actions additionally needs the secrets listed in `README.md`.

In Claude Code web sessions there is no `.env`: `scripts/web-setup.sh` installs dependencies on session start, and lint/typecheck/tests/build all work with no database or auth env at all (auth is lazily initialized, so `next build` never touches the database). Anything needing live data belongs in a local session or the PR preview.

## Deployed infrastructure

- Production: https://album-shelf-seven.vercel.app — Vercel project `album-shelf` (team `dlg03s-projects`), no Vercel Git integration; GitHub Actions owns all deploys
- Database: Neon project `album-shelf` (`purple-dawn-20749038`, aws-us-west-2, PG17); PR previews run on Neon branches `preview/pr-N`
- GitHub OAuth apps: dev app (localhost:3000) with creds in local `.env`; production app with creds in Vercel env
- `next build` needs no database env: `src/auth.ts` builds the Drizzle adapter lazily via NextAuth's function config, so the build steps run without `DATABASE_URL`. Only the migration steps (`db:migrate`) pass it explicitly.

For pipeline operations and troubleshooting, use the `pipeline` skill; for the develop-and-ship workflow, use the `ship` skill (both in `.claude/skills/`).
