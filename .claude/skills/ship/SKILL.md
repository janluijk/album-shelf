---
name: ship
description: End-to-end workflow for developing and shipping a change in album-shelf — pick a backlog task, branch, implement against the quality gates, open a PR, and watch the pipeline. Use when starting any coding task, picking up a backlog item, or shipping a feature/fix.
---

# Shipping a change

## 1. Pick and claim a task

```bash
npx backlog.md task list --plain
npx backlog.md task edit <id> -s "In Progress"
```

If the work has no task yet, create one first (`npx backlog.md task create "..." -d "..." -l <m2|m3>`).

## 2. Branch

Branch from up-to-date main: `feat/<slug>`, `fix/<slug>`, or `docs/<slug>`. If another session may be working in this checkout, use a git worktree instead of switching branches.

## 3. Implement

Follow AGENTS.md conventions. The load-bearing ones:

- Pure domain logic in `src/lib/*.ts` (framework-free, unit-tested); routes and components stay thin
- Server pages pass `initial*` props; client components update optimistically and sync to `/api/*`
- Every mutation route: `auth()` guard → 401, then ownership check → 404
- Style with the design tokens in `globals.css`; no new colors, no component libraries
- Schema change? Edit `src/lib/db/schema.ts` → `npm run db:generate` → commit the `drizzle/` output. Never `drizzle-kit push`.

## 4. Quality gates (all must pass, zero warnings)

```bash
npm run lint
npm run typecheck
npm run test
npm run build   # needs DATABASE_URL and AUTH_SECRET set; dummy values work
```

Changed dependencies? Also run `npm ci` and check `npm ls` for `invalid` entries — see the dependency gotchas in AGENTS.md before touching `esbuild`/`picomatch` dev dependencies.

## 5. Ship

```bash
npx backlog.md task edit <id> -s Done --notes "<what and how>"
git push -u origin <branch>
gh pr create --title "..." --body "..."
gh pr checks <n> --watch
```

The PR pipeline: `quality` (CI) → `preview` (Neon branch `preview/pr-N` + migrate + Vercel preview + Playwright e2e + URL comment). All green before merge.
