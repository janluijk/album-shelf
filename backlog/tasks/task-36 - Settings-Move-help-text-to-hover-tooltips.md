---
id: TASK-36
title: 'Settings: Move help text to hover tooltips'
status: To Do
assignee: []
created_date: '2026-07-11 10:55'
labels:
  - settings
  - ui-polish
dependencies: []
ordinal: 36000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
The settings page currently displays help/info text as small visible text under each setting. This clutters the settings tab and makes it harder to scan the available options. Move this information to be revealed on hover in a tooltip, keeping the UI clean while providing context when people need it.

**Design Decision:** Choose one of these approaches:
1. **Hover on the setting/textbox** — Hover directly over the input, label, or setting row reveals the tooltip
2. **Question mark icon** — Add a small (?) icon next to the setting; hover on the icon reveals the tooltip

Both approaches should use the same tooltip component and styling. The chosen approach should feel cohesive with the rest of the Album Shelf UI and be intuitive for users.

Related tasks:
- task-22 (Settings menu — the foundation)
- task-21.4 (Granularity control on settings page)
- task-29 (User bio / profile message)
- task-30 (Custom rating legend)

Start by documenting the design choice with a brief rationale, then implement the chosen approach across all help text in the settings page.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Design decision documented: chosen approach (hover on control vs question mark icon) with brief rationale
- [ ] #2 Tooltip component created or adapted: displays help text on hover with clean, Album Shelf–styled appearance
- [ ] #3 All help text in settings page moved from visible small text to hover tooltip using the chosen approach
- [ ] #4 Tooltip is keyboard-accessible (tab to focus, Enter or Space reveals tooltip, Escape closes)
- [ ] #5 Tooltip positioning is correct in all screen sizes (no clipping on mobile or edge cases)
- [ ] #6 Verified: Settings page is visually clean when no hover/focus is active
- [ ] #7 Verified: Help text is visible and readable when hovering/focusing on the tooltip trigger
- [ ] #8 Unit or visual tests added for tooltip behavior and positioning
<!-- AC:END -->
