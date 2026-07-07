---
id: TASK-34
title: Add unit tests for critical classes
status: To Do
assignee: []
created_date: '2026-07-07 08:52'
labels:
  - testing
  - quality
dependencies: []
priority: medium
ordinal: 33000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Establish a testing baseline for the application by adding unit tests for critical and necessary classes in the codebase. Focus on classes that contain significant business logic or are core to application behavior.

Tests should verify class behavior end-to-end, treating each class as a unit with its dependencies. Avoid testing individual methods in isolation; instead, test the public interface and verify the class works correctly in realistic usage scenarios.

Start with the domain logic layer (`src/lib/*.ts`) which contains pure business logic and is ideal for testing, then expand to other critical classes as needed.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Unit tests exist for critical classes in the domain logic layer (`src/lib/*.ts`)
- [ ] #2 Tests are written with Vitest and follow the project's test conventions
- [ ] #3 Each test treats the class as a unit and exercises its public interface with realistic inputs
- [ ] #4 Tests verify behavior and side effects, not implementation details or individual methods
- [ ] #5 All tests pass locally and in CI (`npm run test` passes with zero failures)
- [ ] #6 Tests focus only on code that benefits from testing; skip utilities or wrappers that are trivial or well-covered by e2e tests
- [ ] #7 Test files are colocated with their source (e.g., `src/lib/foo.test.ts` next to `src/lib/foo.ts`)
<!-- AC:END -->
