# AI-DLC

AI-assisted Development Lifecycle for this repository.

---

# Project

## Description

Describe the project, its goals, business context, and primary users.

## Tech Stack

* ...
* ...
* ...

## Main Commands

### Install

```bash
bun install
```

### Development

```bash
bun dev
```

### Lint

```bash
bun lint
```

### Tests

```bash
bun test
```

### Build

```bash
bun build
```

---

# Core Rules

These rules override any agent-specific behavior.

* Always work from an intent file.
* Never commit.
* Never push.
* Update the intent after each completed stage.
* Run project validation before marking an intent as approved or done.
* Never modify unrelated code.
* Never change architecture without notifying the developer.
* Every intent should have its own development branch.

Branch naming convention:

```txt
intent/<intent-id>-<short-description>
```

Example:

```txt
intent/001-add-login-page
```

Unless explicitly requested by the developer, development should not occur directly in the default development branch.

---

# Human Approval Gates

The workflow must stop after every stage.

Agents must never automatically continue to the next stage.

After completing a stage, the agent must ask the developer whether to:

* Continue to the next stage
* Repeat the current stage
* Stop the workflow
* Modify the intent
* Change the implementation approach

Example:

```txt
Builder completed INTENT-005.

The implementation is ready for testing.

Would you like me to:
1. Continue to Tester
2. Review the implementation together
3. Rework the implementation
4. Stop here
```

---

# Intent Lifecycle

```txt
backlog
    ↓
context_ready
    ↓
in_development
    ↓
ready_for_testing
    ↓
review
    ↓
approved
    ↓
done
```

Rejected intents return to:

```txt
in_development
```

Rejected intents may be rejected by:

* The developer
* The Reviewer agent

Escalated intents return to:

```txt
backlog
```

after being rewritten.

---

# Definition of Ready

An intent may only move from `backlog` to `context_ready` when:

* Description exists
* Acceptance criteria exist
* Scope is reasonably clear
* Required project context is available

---

# Definition of Done

An intent may only be marked as `done` when:

* Acceptance criteria are satisfied
* Tests pass
* Reviewer approved the implementation
* Documentation was updated if necessary
* Developer explicitly approved completion

---

# Agents

## Reader

### Purpose

Find relevant project context.

### Responsibilities

* Read the intent
* Explore the codebase
* Identify relevant files
* Identify dependencies
* Identify related documentation
* Populate the Related Files section

### Output

* Context manifest
* Related files list

### Restrictions

* Never implement code
* Never modify architecture
* Never perform testing

---

## Planner

### Purpose

Refine requirements and implementation strategy.

### Responsibilities

* Clarify scope
* Improve acceptance criteria
* Break large intents into smaller intents
* Suggest implementation approaches
* Suggest architectural changes when needed

### Output

* Updated intent
* Refined acceptance criteria
* Technical plan

### Restrictions

* Never implement code

---

## Builder

### Purpose

Implement the intent.

### Responsibilities

* Read the intent
* Read related files
* Follow acceptance criteria
* Implement the required functionality
* Update Implementation Notes
* Create or update the intent branch

### Output

* Working implementation
* Updated Implementation Notes

### Restrictions

* Never perform review
* Never approve its own work
* Never modify unrelated code
* Never continue to another stage automatically

---

## Tester

### Purpose

Validate functionality.

### Responsibilities

* Create missing tests
* Update outdated tests
* Execute project validation commands
* Document test results
* Update Test Notes

### Output

* Passing tests
* Updated Test Notes

### Restrictions

* Never approve implementation
* Never perform code review

---

## Reviewer

### Purpose

Validate quality and readiness.

### Responsibilities

* Validate acceptance criteria
* Validate architecture consistency
* Validate security concerns
* Validate maintainability
* Validate test coverage
* Validate coding standards
* Approve or reject implementation

### Output

* Approval decision
* Review Notes

### Restrictions

* May reject implementation
* Must not implement code
* Must not modify implementation

---

## Documenter

### Purpose

Keep documentation synchronized.

### Responsibilities

* Update documentation
* Update changelog
* Update architecture docs when necessary
* Remove outdated information

### Output

* Updated documentation

### Restrictions

* Never modify business logic

---

# Pipeline Configuration

```yaml
max_review_cycles: 3

default_branch: main

default_development_branch: dev

review_mode: manual

branch_prefix: intent/
```

---

# Intent Schema

Each intent is stored inside:

```txt
intents/
```

Example:

```md
---
id: INTENT-001
title: Add login page
status: backlog
story_points: 3
retry_count: 0
branch: null
---

# Description

Add user authentication with email and password.

# Acceptance Criteria

- [ ] User can log in
- [ ] User can log out
- [ ] Errors are handled correctly

# Related Files

# Implementation Notes

# Test Notes

# Review Notes

# Commits
```

---

# Repository Structure

```txt
.
├── AGENTS.md
├── AIDLC.md
├── intents/
├── docs/
├── skills/
├── .codex/
│   └── agents/
└── src/
```

---

# Agent Configuration

Agent-specific behavior belongs in:

```txt
.codex/agents/
```

Examples:

```txt
reader.toml
planner.toml
builder.toml
tester.toml
reviewer.toml
documenter.toml
```

Agent files define responsibilities.

Workflow rules belong in:

```txt
AIDLC.md
```

Global repository instructions belong in:

```txt
AGENTS.md
```
