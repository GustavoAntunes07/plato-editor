# CI Quality Pipeline

The active GitHub Actions quality pipeline lives at:

```txt
.github/workflows/quality.yml
```

It validates pull requests and pushes to the repository's protected branch families without requiring OpenAI API credits.

## Triggers

The workflow runs for:

- Pull requests opened, synchronized, reopened, or marked ready for review
- Pushes to `main`
- Pushes to `dev`
- Pushes to `intent/**`
- Manual `workflow_dispatch` runs

## Checks

The workflow installs Bun dependencies with:

```bash
bun install --frozen-lockfile
```

Then it runs:

```bash
bun run lint
bun test
bun aidlc:doctor
```

If `package.json` defines a `build` script, CI also runs:

```bash
bun run build
```

When no build script exists, the build step reports that it was skipped. This keeps CI ready for the future Tauri/Vite workspace without failing before the application scaffold exists.

## Local To CI Mapping

Local validation is documented in `docs/local-quality-checks.md`.

The local command:

```bash
bun run check
```

currently maps to these CI steps:

```bash
bun run lint
bun test
bun aidlc:doctor
```

CI keeps these as separate steps so failures are easier to identify in GitHub Actions logs.

## Branch Protection Expectations

Repository settings should require the `Project quality checks` job before merging into:

- `main`
- `dev`

For `intent/*` branches, the workflow should run on pushes and pull requests, but direct branch protection can remain lighter unless a specific intent branch is shared by multiple contributors.

Recommended branch rules:

- Require pull requests before merging to `main` and `dev`
- Require the `Project quality checks` status check on `main` and `dev`
- Block direct pushes to `main`
- Keep `dev` and `intent/*` aligned with the local branch rules documented in `docs/local-quality-checks.md`
- Treat workflow, secret, permission, and automation-trigger changes as security-sensitive during review

## Codex PR Review

The Codex PR review workflow is not active in CI by default because it depends on OpenAI API credits and repository secret configuration.

The optional future example remains documented at:

```txt
docs/codex-pr-review.md
docs/examples/codex-pr-review.yml
```
