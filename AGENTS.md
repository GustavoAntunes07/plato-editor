# AI-DLC - Codex Context

This repository uses an AI-assisted development lifecycle.

## Core Rules

- Never commit without explicit user approval.
- Never push without explicit user approval.
- Always work from an intent file for implementation work.
- Always update the intent status after each completed stage.
- Always create a new branch for the intent before make any changes in code.
- Before moving an intent to `in_development`, verify the current branch with `bun aidlc:branch <intent-id>`.
- Use `bun aidlc transition <intent-id> <status>` for lifecycle status changes.
- Use `bun aidlc close <intent-id> [reason]` for intents that should be terminal without becoming `done`.
- Every change made in the AIDLC.md about the lifecycle architecture also has to be in the AIDLC.template.md.
- Always run project validation commands before marking work as complete.
- Run `bun run check` before moving implementation work to review.

## Out-Of-Lifecycle Questions

Questions, brainstorming, read-only analysis, and meta discussion do not require an intent.

An intent is required before:

- Editing files
- Running implementation, testing, review, or documentation stages
- Changing lifecycle status
- Making persistent repo/process changes

## Session Start And Script Rules

At the beginning of every session, run:

```bash
bun aidlc:check
```

If the setup is incomplete, run:

```bash
bun aidlc:setup
```

Periodically, to verify if everything is all right in the AI-DLC repo, run:

```bash
bun aidlc:doctor
```

For local quality validation, run:

```bash
bun run check
```

## Runtime Configuration

The executable lifecycle configuration lives in:

```txt
.aidlc/config.yaml
```

It defines:

- Active governance profile
- Required agents
- Lifecycle transitions
- Terminal `done` and `closed` statuses
- Approval gates
- Validation commands
- Branch enforcement

## Workflow

0. AI-DLC Orchestrator checks setup, reads workflow status, and recommends the next agent.
1. Reader resolves context.
2. Planner refines the intent if needed.
3. Builder verifies the intent branch, then implements.
4. Tester validates.
5. Reviewer approves or rejects.
6. Documenter updates docs.

The active governance profile decides where the workflow must pause for user approval.

## Review Guidelines

- Prioritize concrete bugs, behavioral regressions, security risks, missing tests, and lifecycle rule violations.
- Keep review feedback focused on actionable P0/P1 issues.
- Verify that implementation work is tied to an intent and happens on that intent's branch.
- Flag automatic commits, pushes, merges, or lifecycle transitions unless the developer explicitly approved them.
- Treat changes to GitHub workflows, secrets, permissions, and automation triggers as security-sensitive.

## Agents

Agent definitions live in `.codex/agents/`.

Required agents:

- `aidlc-orchestrator`
- `reader`
- `planner`
- `builder`
- `tester`
- `reviewer`
- `documenter`

## Source Of Truth

- Global project rules: `AIDLC.md`
- Runtime workflow config: `.aidlc/config.yaml`
- Agent behavior: `.codex/agents/` and `skills/`
- Unit of work: `intents/INTENT-*.md`
- Architecture docs: `docs/`

## Codex Model Verification

Codex model defaults belong in `~/.codex/config.toml` or trusted project `.codex/config.toml`.

Common keys:

```toml
model = "gpt-5.5"
model_reasoning_effort = "high"
```

For runtime evidence, use Codex logs or OpenTelemetry events when enabled; conversation start events include model and reasoning settings.
