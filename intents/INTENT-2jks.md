---
id: INTENT-2jks
title: Refine AI-DLC lifecycle and backlog intent workflow
status: backlog
story_points: 3
retry_count: 0
branch: intent/2jks-refine-ai-dlc-lifecycle-and-backlog-intent-workflow
---

# Description

Improve the AI-DLC workflow for longer and more complex work by adding better backlog refinement support, richer intent relationships, and a blocked lifecycle state.

This includes exploring a dedicated backlog refinement skill that helps an agent refine rough intents with the developer before implementation. The skill should be close in spirit to brainstorming, but more lifecycle-specific: it should inspect an intent, challenge vague scope, ask decision-forcing questions, and run a "grill me" style loop until the intent has enough clarity for planning.

# Acceptance Criteria

- [ ] A backlog refinement workflow is defined for rough or underspecified intents
- [ ] A new refinement skill is designed or created for intent refinement
- [ ] The refinement skill prompts the agent to ask targeted questions that resolve ambiguity with the developer
- [ ] Intent files support an optional `Related Intents` section
- [ ] AI-DLC documentation describes when and how to use related intents
- [ ] The lifecycle supports a `blocked` state for work that cannot currently progress
- [ ] AI-DLC documentation describes when to use `blocked` versus `backlog`, `escalated`, or `closed`
- [ ] CLI validation and lifecycle transitions are updated for any new intent section or status
- [ ] Tests cover blocked status handling and any intent parsing/validation changes

# Related Intents

- `INTENT-a11d` - Establish Codex PR reviewer for GitHub
- `INTENT-2r8t` - Establish project lint and commit push checks

# Related Files

- `.aidlc/config.yaml`
- `AIDLC.md`
- `AGENTS.md`
- `.agents/skills/`
- `scripts/aidlc.ts`
- `tests/aidlc.test.ts`
- `intents/`

# Implementation Notes

Backlog intent created for future planning and implementation. Work has not started.

# Test Notes

# Review Notes

# Commits
