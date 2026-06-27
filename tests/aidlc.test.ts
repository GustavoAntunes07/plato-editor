import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const cliPath = join(repoRoot, "scripts", "aidlc.ts");
const checkBranchPath = join(repoRoot, "scripts", "check-branch.ts");
const configPath = join(repoRoot, ".aidlc", "config.yaml");

let workspace = "";

function runAidlc(args: string[]) {
  return Bun.spawnSync({
    cmd: [process.execPath, cliPath, ...args],
    cwd: workspace,
    stdout: "pipe",
    stderr: "pipe",
  });
}

function runCheckBranch(stdin?: string) {
  const stdinFile = stdin === undefined ? null : join(workspace, "pre-push-stdin.txt");

  if (stdinFile) {
    writeFile(stdinFile, stdin);
  }

  return Bun.spawnSync({
    cmd: [process.execPath, checkBranchPath],
    cwd: workspace,
    stdin: stdinFile ? Bun.file(stdinFile) : null,
    stdout: "pipe",
    stderr: "pipe",
  });
}

function output(result: ReturnType<typeof runAidlc>) {
  return `${result.stdout.toString()}${result.stderr.toString()}`;
}

function writeFile(path: string, content: string) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content);
}

function createConfiguredProject() {
  mkdirSync(join(workspace, ".aidlc"), { recursive: true });
  mkdirSync(join(workspace, ".codex", "agents"), { recursive: true });
  mkdirSync(join(workspace, "docs"), { recursive: true });
  mkdirSync(join(workspace, "intents"), { recursive: true });

  writeFile(join(workspace, "AGENTS.md"), "# Agents\n");
  writeFile(join(workspace, "AIDLC.md"), "# AI-DLC\n");
  writeFile(
    join(workspace, ".aidlc", "state.json"),
    JSON.stringify({ version: "1.0.0", initialized: true }, null, 2),
  );
  writeFile(join(workspace, ".aidlc", "config.yaml"), readFileSync(configPath, "utf-8"));

  for (const agent of [
    "aidlc-orchestrator",
    "reader",
    "planner",
    "builder",
    "tester",
    "reviewer",
    "documenter",
  ]) {
    writeFile(join(workspace, ".codex", "agents", `${agent}.toml`), `name = "${agent}"\n`);
  }
}

function setCurrentBranch(branch: string) {
  writeFile(join(workspace, ".git", "HEAD"), `ref: refs/heads/${branch}\n`);
}

function createBranch(branch: string) {
  writeFile(join(workspace, ".git", "refs", "heads", ...branch.split("/")), "abc123\n");
}

function writeIntent(status: string, options: { omitCommitsHeading?: boolean } = {}) {
  writeFile(
    join(workspace, "intents", "INTENT-001.md"),
    `---
id: INTENT-001
title: Test intent
status: ${status}
story_points: 1
retry_count: 0
branch: intent/001-test-intent
---

# Description

Test the lifecycle.

# Acceptance Criteria

- [x] It works

# Related Files

- scripts/aidlc.ts

# Implementation Notes

# Test Notes

- Tests passed.

# Review Notes

Approved by reviewer.
${options.omitCommitsHeading ? "" : `
# Commits
`}
`,
  );
}

beforeEach(() => {
  workspace = mkdtempSync(join(tmpdir(), "aidlc-test-"));
});

afterEach(() => {
  if (workspace && existsSync(workspace)) {
    rmSync(workspace, { recursive: true, force: true });
  }
});

describe("AI-DLC CLI", () => {
  test("setup creates state and config files", () => {
    const result = runAidlc(["setup"]);

    expect(result.exitCode).toBe(0);
    expect(existsSync(join(workspace, ".aidlc", "state.json"))).toBe(true);
    expect(existsSync(join(workspace, ".aidlc", "config.yaml"))).toBe(true);
  });

  test("doctor validates config, required agents, and intents", () => {
    createConfiguredProject();
    writeIntent("ready_for_testing");

    const result = runAidlc(["doctor"]);

    expect(result.exitCode).toBe(0);
    expect(output(result)).toContain("AI-DLC doctor completed");
  });

  test("doctor accepts closed intents as terminal records", () => {
    createConfiguredProject();
    writeIntent("closed");

    const result = runAidlc(["doctor"]);

    expect(result.exitCode).toBe(0);
    expect(output(result)).toContain("AI-DLC doctor completed");
  });

  test("doctor fails when a required agent is missing", () => {
    createConfiguredProject();
    writeIntent("ready_for_testing");
    rmSync(join(workspace, ".codex", "agents", "reviewer.toml"));

    const result = runAidlc(["doctor"]);

    expect(result.exitCode).toBe(1);
    expect(output(result)).toContain("Missing required agent");
  });

  test("transition blocks invalid lifecycle jumps", () => {
    createConfiguredProject();
    setCurrentBranch("intent/001-test-intent");
    writeIntent("in_development");

    const result = runAidlc(["transition", "INTENT-001", "done"]);

    expect(result.exitCode).toBe(1);
    expect(output(result)).toContain("Invalid transition");
  });

  test("transition updates status and reports approval gates", () => {
    createConfiguredProject();
    setCurrentBranch("intent/001-test-intent");
    writeIntent("ready_for_testing");

    const result = runAidlc(["transition", "INTENT-001", "review"]);
    const updatedIntent = readFileSync(
      join(workspace, "intents", "INTENT-001.md"),
      "utf-8",
    );

    expect(result.exitCode).toBe(0);
    expect(output(result)).toContain("Approval gate reached");
    expect(updatedIntent).toContain("status: review");
  });

  test("transition to done reads review notes at end of file", () => {
    createConfiguredProject();
    setCurrentBranch("intent/001-test-intent");
    writeIntent("approved", { omitCommitsHeading: true });

    const result = runAidlc(["transition", "INTENT-001", "done"]);
    const updatedIntent = readFileSync(
      join(workspace, "intents", "INTENT-001.md"),
      "utf-8",
    );

    expect(result.exitCode).toBe(0);
    expect(updatedIntent).toContain("status: done");
  });

  test("close marks a non-terminal intent as closed with a reason", () => {
    createConfiguredProject();
    writeIntent("backlog");

    const result = runAidlc(["close", "INTENT-001", "duplicate"]);
    const updatedIntent = readFileSync(
      join(workspace, "intents", "INTENT-001.md"),
      "utf-8",
    );

    expect(result.exitCode).toBe(0);
    expect(output(result)).toContain("Closed INTENT-001: duplicate");
    expect(updatedIntent).toContain("status: closed");
    expect(updatedIntent).toContain("closed_reason: duplicate");
  });

  test("close refuses to close done intents", () => {
    createConfiguredProject();
    writeIntent("done");

    const result = runAidlc(["close", "INTENT-001", "stale"]);

    expect(result.exitCode).toBe(1);
    expect(output(result)).toContain("Cannot close terminal intent: done");
  });

  test("new creates shorter intent IDs and branch names", () => {
    createConfiguredProject();

    const result = runAidlc(["new", "Short ID example"]);

    expect(result.exitCode).toBe(0);
    expect(output(result)).toMatch(/Created intents[\\/]INTENT-[a-z0-9]{4}\.md/);

    const fileName = output(result).match(/INTENT-[a-z0-9]{4}\.md/)?.[0];
    expect(fileName).toBeDefined();

    const createdIntent = readFileSync(join(workspace, "intents", fileName!), "utf-8");
    const shortId = fileName!.replace("INTENT-", "").replace(".md", "");

    expect(shortId.length).toBeLessThan(6);
    expect(createdIntent).toContain(`id: INTENT-${shortId}`);
    expect(createdIntent).toContain(
      `branch: intent/${shortId}-short-id-example`,
    );
  });

  test("branch reports when current branch matches the intent branch", () => {
    createConfiguredProject();
    setCurrentBranch("intent/001-test-intent");
    createBranch("intent/001-test-intent");
    writeIntent("context_ready");

    const result = runAidlc(["branch", "INTENT-001"]);

    expect(result.exitCode).toBe(0);
    expect(output(result)).toContain("Intent branch exists: yes");
    expect(output(result)).toContain("Branch status: ok");
  });

  test("branch check rejects pre-push updates targeting main", () => {
    createConfiguredProject();
    setCurrentBranch("intent/001-test-intent");
    const result = runCheckBranch(
      "HEAD abc123 refs/heads/main 0000000000000000000000000000000000000000\n",
    );

    expect(result.exitCode).toBe(1);
    expect(output(result)).toContain("Direct pushes to main are not allowed");
  });

  test("branch check accepts pre-push updates from allowed local branches", () => {
    createConfiguredProject();
    const result = runCheckBranch(
      "refs/heads/intent/001-test-intent abc123 refs/heads/intent/001-test-intent 0000000000000000000000000000000000000000\n" +
        "refs/heads/dev def456 refs/heads/dev 0000000000000000000000000000000000000000\n",
    );

    expect(result.exitCode).toBe(0);
    expect(output(result)).toContain("Branch check passed for pre-push refs.");
  });

  test("branch check rejects pre-push updates from disallowed local branches", () => {
    createConfiguredProject();
    const result = runCheckBranch(
      "refs/heads/feature/test abc123 refs/heads/feature/test 0000000000000000000000000000000000000000\n",
    );

    expect(result.exitCode).toBe(1);
    expect(output(result)).toContain('Local branch "feature/test" is not allowed');
  });

  test("transition to development suggests switching to an existing branch", () => {
    createConfiguredProject();
    setCurrentBranch("main");
    createBranch("intent/001-test-intent");
    writeIntent("context_ready");

    const result = runAidlc(["transition", "INTENT-001", "in_development"]);

    expect(result.exitCode).toBe(1);
    expect(output(result)).toContain("Intent branch mismatch");
    expect(output(result)).toContain("git switch intent/001-test-intent");
  });

  test("transition to development suggests creating a missing branch", () => {
    createConfiguredProject();
    setCurrentBranch("main");
    writeIntent("context_ready");

    const result = runAidlc(["transition", "INTENT-001", "in_development"]);

    expect(result.exitCode).toBe(1);
    expect(output(result)).toContain("Intent branch mismatch");
    expect(output(result)).toContain("git switch -c intent/001-test-intent");
  });
});
