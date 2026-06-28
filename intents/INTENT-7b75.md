---
id: INTENT-7b75
title: Establish GitHub Actions quality pipeline
status: ready_for_testing
story_points: 3
retry_count: 0
branch: intent/7b75-establish-github-actions-quality-pipeline
---

# Description

Establish the repository's GitHub Actions quality pipeline after local linting and hook checks are in place.

The pipeline should validate pull requests and relevant branch pushes with the project's standard quality checks, without depending on paid OpenAI API credits. The Codex PR review workflow should remain documented as an optional future example until API credits and GitHub workflow permissions are available.

# Blockers

- `INTENT-2r8t` should be completed first so the pipeline can reuse the finalized lint, test, build, and local check commands.

# Acceptance Criteria

- [x] A GitHub Actions workflow runs project quality checks on pull requests
- [x] The workflow runs lint, unit tests, AI-DLC validation, and build checks when those commands exist
- [x] The workflow avoids OpenAI API dependencies by default
- [x] A pull request template guides authors through AI-DLC intent, validation, and reviewer checklist items
- [x] Branch protection expectations are documented for `main`, `dev`, and `intent/*` branches
- [x] The Codex PR review workflow remains available only as an optional documented example
- [x] The pipeline documentation explains how local checks map to CI checks
- [x] Validation notes confirm the workflow syntax and project checks were reviewed

# Related Intents

- `INTENT-2r8t` - Establish project lint and commit push checks
- `INTENT-a11d` - Establish Codex PR reviewer for GitHub

# Related Files

- `.github/workflows/`
- `.github/workflows/quality.yml`
- `.github/pull_request_template.md`
- `.github/codex/prompts/review.md`
- `docs/ci-quality-pipeline.md`
- `docs/local-quality-checks.md`
- `docs/codex-pr-review.md`
- `docs/examples/codex-pr-review.yml`
- `docs/`
- `package.json`
- `.aidlc/config.yaml`

# Implementation Notes

Reader context:

- `INTENT-2r8t` is `done`, so the local quality commands are available for CI reuse.
- `package.json` exposes `lint`, `test`, `check`, and `aidlc:doctor`; `check` currently runs lint, Bun tests, and AI-DLC doctor.
- `.github/workflows/` exists but has no active workflows yet.
- The optional Codex PR review workflow is documented in `docs/codex-pr-review.md` and parked as an example at `docs/examples/codex-pr-review.yml`.
- `docs/local-quality-checks.md` documents how local lint, tests, AI-DLC validation, and hooks fit together.

Planner notes:

- Keep the active GitHub Actions quality pipeline independent from OpenAI API keys or paid API credits.
- Leave Codex PR review as future optional documentation only; the example workflow and explanation stay under `docs/`.
- Add one active CI workflow that installs Bun, installs dependencies from `bun.lock`, and runs the same project quality surface used locally.
- Prefer explicit CI steps for lint, tests, and AI-DLC validation so failures point to the failing stage, while documenting that `bun run check` maps to those same checks locally.
- Document expected branch protection for `main`, `dev`, and `intent/*` without trying to configure repository settings from code.

Builder implementation:

- Added `.github/workflows/quality.yml` for pull requests, pushes to `main`, `dev`, and `intent/**`, and manual workflow dispatch.
- The quality workflow installs dependencies with `bun install --frozen-lockfile`, then runs lint, unit tests, AI-DLC doctor, and `bun run build` only when a `build` script exists.
- Added `.github/pull_request_template.md` with AI-DLC intent, validation, and reviewer checklist prompts.
- Added `docs/ci-quality-pipeline.md` documenting triggers, local-to-CI command mapping, branch protection expectations, and the inactive Codex PR review path.
- Updated `docs/local-quality-checks.md` to point local checks at the CI mapping.
- Updated `docs/codex-pr-review.md` to clarify that Codex PR review is an optional future workflow, not active CI.

# Test Notes

- `bun run check` passed after rerunning outside the sandbox because Bun could not read the current directory inside the sandbox.
- `bun run check` covered `bun run lint`, `bun test` with 16 passing tests, and `bun aidlc:doctor`.
- `git diff --check` passed with LF-to-CRLF working-copy warnings only.
- Workflow syntax was manually reviewed for triggers, permissions, checkout credential persistence, Bun setup, and OpenAI API independence.

# Review Notes

# Commits
