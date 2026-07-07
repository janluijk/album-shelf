---
name: pr-info
description: Report the current branch's PR URL, branch name, and deployed preview URL. Use after opening a PR, when the user asks where to test a change, or after pushing review fixes.
allowed-tools: Bash(git branch:*), Bash(gh pr view:*), Bash(gh pr checks:*)
---

# PR info

## Current state

- Branch: !`git branch --show-current`
- PR: !`gh pr view --json number,url,state,title --jq '"#\(.number) \(.state) \(.url) — \(.title)"'`
- Preview comment: !`gh pr view --json comments --jq '[.comments[].body | select(contains("<!-- preview-url -->"))] | last'`
- Checks: !`gh pr checks 2>&1 | tail -5`

## Report

Reply with exactly these three labeled lines, then one status sentence:

- **PR:** the PR URL
- **Branch:** the current branch
- **Preview:** the deployment URL from the preview comment (the line starting with 🔍)

If there is no PR for this branch yet, say so and suggest `gh pr create` via the ship skill. If the preview comment is missing, the preview deploy hasn't finished — report what `gh pr checks` shows for the `preview` job instead, and re-run `/pr-info` once it's green.
