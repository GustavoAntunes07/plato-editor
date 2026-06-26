---
id: INTENT-2r8t
title: Establish ESLint and versioned local checks
status: ready_for_testing
story_points: 3
retry_count: 0
branch: intent/2r8t-establish-project-lint-and-commit-push-checks
---

# Description

Establish the project's ESLint baseline and versioned local verification checks that run before commits and pushes.

This intent owns local developer safeguards: lint scripts, local quality scripts, versioned Git hooks, branch checks, and commit message checks. The lint/check setup should be ready for the planned Plato Editor workspace, including future `apps/desktop` Tauri/Vite code and `packages/*` TypeScript/React code. GitHub Actions CI and build enforcement should be implemented separately in `INTENT-7b75` after these commands are stable.

# Blockers

- None. `INTENT-a11d` is complete.

# Acceptance Criteria

- [x] The project uses ESLint as its linting baseline
- [x] ESLint is configured for the current TypeScript/Bun codebase
- [x] ESLint is prepared for future TypeScript/React code in `apps/*` and `packages/*`
- [x] ESLint ignores generated build output, including Tauri/Rust `target` output
- [x] A `lint` script is added to the project command surface
- [x] A local `check` or equivalent script runs lint, tests, and AI-DLC validation
- [x] Versioned Git hooks are added for commit-time and push-time checks
- [x] Commit-time checks include intent-based commit message linting or an equivalent local convention check
- [x] Push-time checks include branch validation that prevents pushing directly from `main`
- [x] Push-time checks allow `dev` and `intent/*` branches
- [x] The hook setup is documented for future contributors
- [x] The setup avoids blocking unrelated AI-DLC lifecycle operations unnecessarily
- [x] Tests or validation notes confirm ESLint and hook scripts work

# Related Intents

- `INTENT-a11d` - Establish Codex PR reviewer for GitHub
- `INTENT-7b75` - Establish GitHub Actions quality pipeline
- `INTENT-2jks` - Refine AI-DLC lifecycle and backlog intent workflow

# Related Files

- `package.json`
- `eslint.config.mjs`
- `.githooks/`
- `scripts/check-branch.ts`
- `scripts/check-commit-message.ts`
- `docs/local-quality-checks.md`
- `.aidlc/config.yaml`
- `AIDLC.md`
- `AIDLC.template.md`
- `AGENTS.md`

# Implementation Notes

- Added ESLint flat config in `eslint.config.mjs`.
- Configured ESLint for current Bun/TypeScript files and future TSX/browser/React code in the planned `apps/` and `packages/` workspace.
- Ignored generated output directories, including Tauri/Rust `target` directories.
- Added `lint`, `lint:fix`, `check`, hook install, and hook runner scripts to `package.json`.
- Added versioned hooks in `.githooks/` for `pre-commit`, `commit-msg`, and `pre-push`.
- Added `scripts/check-branch.ts` to prevent pushing from `main` and allow `dev` and `intent/*`.
- Added `scripts/check-commit-message.ts` to accept AI-DLC intent commit messages and Conventional Commit-style messages while allowing merge, revert, fixup, and squash commits.
- Updated AI-DLC validation commands to include `bun run check`.
- Documented local quality checks and hook setup in `docs/local-quality-checks.md`.
- Removed stale `package-lock.json` after Bun migrated dependency locking to `bun.lock`.
- Created `INTENT-7b75` for the separate GitHub Actions quality pipeline.
- Refined commit message validation to prefer AI-DLC intent commits such as `intent/2r8t: add eslint and local hooks`.

# Test Notes

- `bun run lint` passed.
- `bun test` passed: 13 tests, 0 failures.
- `bun aidlc:doctor` passed.
- `bun run check` passed.
- `bun scripts/check-branch.ts` passed on `intent/2r8t-establish-project-lint-and-commit-push-checks`.
- `bun scripts/check-commit-message.ts .git/COMMIT_EDITMSG` rejected the current non-conventional message file as expected.
- `bun run hooks:install` configured this clone to use `.githooks`.
- Commit message validation accepted `intent/2r8t: add eslint and local hooks`.
- Commit message validation accepted `chore(lint): add eslint and local hooks`.
- Commit message validation rejected `Adding eslint hooks`.
- Final validation after intent commit format update:
  - `bun run check` passed.
  - `git diff --check` passed with LF/CRLF warnings for touched files.

# Review Notes

# Commits
