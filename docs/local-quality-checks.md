# Local Quality Checks

This repository uses ESLint and versioned Git hooks for local quality checks.

## Commands

Run the full local check before moving an intent toward review:

```bash
bun run check
```

The check command runs:

```bash
bun run lint
bun test
bun aidlc:doctor
```

Run lint only:

```bash
bun run lint
```

Apply automatic lint fixes when available:

```bash
bun run lint:fix
```

## Hook Setup

Install the versioned hooks once per clone:

```bash
bun run hooks:install
```

This sets:

```bash
git config core.hooksPath .githooks
```

## Hook Behavior

`pre-commit` runs:

```bash
bun run lint
```

`commit-msg` prefers AI-DLC intent commit messages and also accepts Conventional Commit-style messages:

```txt
intent/2r8t: add eslint and local hooks
intent/a01b: add login page
```

Conventional Commit examples:

```txt
feat(scope): short summary
fix: short summary
docs: short summary
```

`pre-push` runs:

```bash
bun scripts/check-branch.ts
bun run check
```

Branch checks prevent pushes from `main` and allow pushes from:

```txt
dev
intent/*
```

The `pre-push` branch check inspects the refs Git passes to the hook on stdin, so explicit refspecs that target `refs/heads/main` are blocked even when the current worktree branch is allowed.

## Workspace Scope

The ESLint config is prepared for the planned Plato Editor workspace:

```txt
apps/
packages/
scripts/
tests/
```

It supports TypeScript, TSX, browser globals, Bun scripts, and React hook rules. Generated outputs are ignored, including `dist`, `build`, and Tauri/Rust `target` directories.

Rust formatting and Tauri build checks should be added when the Tauri app is scaffolded.

## CI Mapping

GitHub Actions runs the same quality surface in `.github/workflows/quality.yml`.

Local `bun run check` maps to these CI steps:

```bash
bun run lint
bun test
bun aidlc:doctor
```

CI keeps them as separate steps so GitHub Actions can show which stage failed. CI also runs `bun run build` when a `build` script exists in `package.json`.

See `docs/ci-quality-pipeline.md` for branch protection expectations and workflow details.
