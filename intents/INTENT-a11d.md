---
id: INTENT-a11d
title: Establish Codex PR reviewer for GitHub
status: done
story_points: 3
retry_count: 0
branch: intent/a11d-establish-codex-pr-reviewer-for-github
---

# Description

Create the first CI/CD pipeline foundation for the project, focused on a GitHub pull request code review workflow powered by Codex.

The initial scope is to design and implement a PR reviewer that can run on GitHub pull requests, inspect the proposed changes, and report actionable review feedback without automatically committing, pushing, or merging changes.

# Acceptance Criteria

- [x] A GitHub PR review workflow is defined for running Codex against pull request diffs
- [x] The workflow documents required secrets, permissions, and repository settings
- [x] Codex review output is posted back to the pull request in a predictable format
- [x] The reviewer focuses on bugs, regressions, missing tests, maintainability, and security risks
- [x] The workflow avoids automatic commits, pushes, merges, or lifecycle transitions
- [x] Local or CI validation commands are documented for verifying the reviewer setup
- [x] Follow-up pipeline work is identified separately from the initial PR reviewer scope

# Related Intents

- `INTENT-2jks` - Refine AI-DLC lifecycle and backlog intent workflow
- `INTENT-2r8t` - Establish project lint and commit push checks

# Related Files

- `.github/workflows/codex-pr-review.yml`
- `.github/codex/prompts/review.md`
- `docs/codex-pr-review.md`
- `AGENTS.md`

# Implementation Notes

- Added a GitHub Actions workflow that runs on non-draft pull requests and invokes `openai/codex-action@v1`.
- Checked out the PR merge ref with read-only credentials and configured Codex with a read-only sandbox.
- Added a dedicated prompt for high-signal PR review feedback focused on bugs, regressions, missing tests, maintainability, security, and lifecycle rules.
- Added a `post_feedback` job that creates or updates a single PR comment marked with `<!-- codex-pr-review -->`.
- Documented required `OPENAI_API_KEY` secret, workflow permissions, review scope, local validation commands, and follow-up pipeline work.
- Added repository review guidelines to `AGENTS.md` so Codex has project-specific review instructions.

# Test Notes

- `bun aidlc:doctor` passed.
- `bun test` passed: 13 tests, 0 failures.
- `git diff --check` passed with the existing LF/CRLF warning for `AGENTS.md`.
- Final tester validation:
  - `bun aidlc:doctor` passed.
  - `bun test` passed: 13 tests, 0 failures.
  - `git diff --check` passed with the existing LF/CRLF warning for `AGENTS.md`.
  - `actionlint` was not available locally, so GitHub workflow syntax was inspected manually.

# Review Notes

Approved.

- Acceptance criteria are satisfied.
- The workflow uses `openai/codex-action@v1` on non-draft pull request events.
- Repository checkout uses the PR merge ref with read-only credentials and `persist-credentials: false`.
- Codex runs with a read-only sandbox and the prompt explicitly forbids edits, commits, pushes, merges, and lifecycle transitions.
- Review feedback is posted as a single create-or-update PR comment using the `<!-- codex-pr-review -->` marker.
- Required `OPENAI_API_KEY`, permissions, review scope, validation commands, and follow-up lint/pipeline work are documented.
- No blocking security, maintainability, or lifecycle issues found in review.

# Commits
