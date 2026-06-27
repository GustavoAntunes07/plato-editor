---
id: INTENT-7b75
title: Establish GitHub Actions quality pipeline
status: backlog
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

- [ ] A GitHub Actions workflow runs project quality checks on pull requests
- [ ] The workflow runs lint, unit tests, AI-DLC validation, and build checks when those commands exist
- [ ] The workflow avoids OpenAI API dependencies by default
- [ ] A pull request template guides authors through AI-DLC intent, validation, and reviewer checklist items
- [ ] Branch protection expectations are documented for `main`, `dev`, and `intent/*` branches
- [ ] The Codex PR review workflow remains available only as an optional documented example
- [ ] The pipeline documentation explains how local checks map to CI checks
- [ ] Validation notes confirm the workflow syntax and project checks were reviewed

# Related Intents

- `INTENT-2r8t` - Establish project lint and commit push checks
- `INTENT-a11d` - Establish Codex PR reviewer for GitHub

# Related Files

- `.github/workflows/`
- `.github/pull_request_template.md`
- `docs/`
- `package.json`
- `.aidlc/config.yaml`

# Implementation Notes

Backlog intent created for future planning and implementation. Work has not started.

# Test Notes

# Review Notes

# Commits
