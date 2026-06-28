# Codex PR Review

This project keeps an optional GitHub Actions example for asking Codex to perform a focused pull request review.

The workflow is not active by default because it requires OpenAI API credits, an `OPENAI_API_KEY` repository secret, and repository workflow permissions. The active quality pipeline does not depend on OpenAI API access.

## Workflow

The example workflow lives at:

```txt
docs/examples/codex-pr-review.yml
```

If copied into `.github/workflows/` in the future, it runs on non-draft pull requests when they are opened, synchronized, reopened, or marked ready for review.

The workflow:

- Checks out the pull request merge ref with read-only repository credentials
- Installs Bun so Codex can run AI-DLC validation commands when useful
- Runs `openai/codex-action@v1` with the prompt in `.github/codex/prompts/review.md`
- Uses a read-only Codex sandbox
- Posts or updates one PR comment marked with `<!-- codex-pr-review -->`
- Does not commit, push, merge, or update AI-DLC lifecycle status

## Required GitHub Setup For Future Use

Add this repository secret:

```txt
OPENAI_API_KEY
```

The Codex review job uses:

```yaml
permissions:
  contents: read
  pull-requests: read
```

The comment job uses:

```yaml
permissions:
  issues: write
  pull-requests: write
```

If `OPENAI_API_KEY` is not configured, the review step is skipped and no PR comment is posted.

## Review Scope

Codex should focus on:

- Bugs and behavioral regressions
- Missing tests for changed behavior
- Security and privacy risks
- Maintainability issues likely to cause defects
- Violations of `AGENTS.md`, `AIDLC.md`, or intent lifecycle rules

The review prompt asks Codex to report `No blocking findings.` when it does not find actionable issues.

## Local Validation

Before enabling or changing the workflow or prompt, run:

```bash
bun aidlc:doctor
bun test
git diff --check
```

For YAML-only changes, also inspect the workflow for indentation and GitHub expression mistakes before opening a pull request.

## Follow-Up Pipeline Work

This workflow is intentionally limited to optional PR review. Linting, unit tests, AI-DLC validation, optional build checks, PR templates, and branch protection expectations are handled by `INTENT-7b75` and documented in `docs/ci-quality-pipeline.md`.
