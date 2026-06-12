import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";

type IntentStatus =
  | "backlog"
  | "context_ready"
  | "in_development"
  | "ready_for_testing"
  | "review"
  | "approved"
  | "done"
  | "escalated";

const INTENTS_DIR = "intents";
const DOCS_DIR = "docs";
const AIDLC_DIR = ".aidlc";

const REQUIRED_FILES = ["AGENTS.md", "AIDLC.md"];

const REQUIRED_DIRS = [INTENTS_DIR, DOCS_DIR, ".codex", ".codex/agents"];

const PLACEHOLDERS = [
  "[Project-name]",
  "[Project-description]",
  "[Tech-stack]",
  "Description: ...",
  "- ...",
  "TODO",
];

const VALID_STATUSES: IntentStatus[] = [
  "backlog",
  "context_ready",
  "in_development",
  "ready_for_testing",
  "review",
  "approved",
  "done",
  "escalated",
];

function ensureDir(path: string) {
  if (!existsSync(path)) {
    mkdirSync(path, { recursive: true });
  }
}

function read(path: string) {
  return readFileSync(path, "utf-8");
}

function getField(content: string, field: string) {
  return content.match(new RegExp(`^${field}:\\s*(.+)$`, "m"))?.[1]?.trim();
}

function getIntentFiles() {
  ensureDir(INTENTS_DIR);

  return readdirSync(INTENTS_DIR)
    .filter((file) => file.endsWith(".md"))
    .map((file) => join(INTENTS_DIR, file));
}

function createState() {
  ensureDir(AIDLC_DIR);

  const statePath = join(AIDLC_DIR, "state.json");

  if (!existsSync(statePath)) {
    writeFileSync(
      statePath,
      JSON.stringify(
        {
          version: "1.0.0",
          initialized: true,
          created_at: new Date().toISOString(),
        },
        null,
        2,
      ),
    );
  }
}

function setup() {
  for (const dir of REQUIRED_DIRS) {
    ensureDir(dir);
  }

  createState();

  console.log("✅ AI-DLC structure initialized");
}

function checkSetup() {
  const errors: string[] = [];

  for (const file of REQUIRED_FILES) {
    if (!existsSync(file)) {
      errors.push(`Missing file: ${file}`);
    }
  }

  for (const dir of REQUIRED_DIRS) {
    if (!existsSync(dir)) {
      errors.push(`Missing directory: ${dir}`);
    }
  }

  if (!existsSync(join(AIDLC_DIR, "state.json"))) {
    errors.push("Missing .aidlc/state.json. Run `bun aidlc setup`.");
  }

  for (const file of REQUIRED_FILES) {
    if (!existsSync(file)) continue;

    const content = read(file);

    for (const placeholder of PLACEHOLDERS) {
      if (content.includes(placeholder)) {
        errors.push(`Placeholder found in ${file}: ${placeholder}`);
      }
    }
  }

  if (errors.length > 0) {
    console.error("\n❌ AI-DLC setup incomplete\n");

    for (const error of errors) {
      console.error(`- ${error}`);
    }

    process.exit(1);
  }

  console.log("✅ AI-DLC setup complete");
}

function createIntent(title: string) {
  ensureDir(INTENTS_DIR);

  const numericId = String(Date.now()).slice(-6);
  const id = `INTENT-${numericId}`;
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  const branch = `intent/${numericId}-${slug || "untitled"}`;
  const filePath = join(INTENTS_DIR, `${id}.md`);

  const content = `---
id: ${id}
title: ${title}
status: backlog
story_points: 1
retry_count: 0
branch: ${branch}
---

# Description

${title}

# Acceptance Criteria

- [ ] Define acceptance criteria

# Related Files

# Implementation Notes

# Test Notes

# Review Notes

# Commits
`;

  writeFileSync(filePath, content);

  console.log(`✅ Created ${filePath}`);
}

function status() {
  const files = getIntentFiles();

  const counts: Record<string, number> = {};

  for (const validStatus of VALID_STATUSES) {
    counts[validStatus] = 0;
  }

  for (const file of files) {
    const content = read(file);
    const currentStatus = getField(content, "status");

    if (currentStatus) {
      counts[currentStatus] = (counts[currentStatus] ?? 0) + 1;
    }
  }

  console.log("\nAI-DLC Status\n");

  for (const [key, value] of Object.entries(counts)) {
    console.log(`${key}: ${value}`);
  }
}

function listIntents() {
  const files = getIntentFiles();

  for (const file of files) {
    const content = read(file);

    console.log(
      `${getField(content, "id")} | ${getField(content, "status")} | ${getField(content, "title")}`,
    );
  }
}

function nextIntent() {
  const priority: IntentStatus[] = [
    "review",
    "ready_for_testing",
    "in_development",
    "context_ready",
    "backlog",
  ];

  const intents = getIntentFiles().map((file) => {
    const content = read(file);

    return {
      file,
      id: getField(content, "id"),
      title: getField(content, "title"),
      status: getField(content, "status") as IntentStatus,
      branch: getField(content, "branch"),
    };
  });

  const selected = intents
    .filter((intent) => priority.includes(intent.status))
    .sort((a, b) => priority.indexOf(a.status) - priority.indexOf(b.status))[0];

  if (!selected) {
    console.log("No pending intents found.");
    return;
  }

  console.log(JSON.stringify(selected, null, 2));
}

function validateIntents() {
  const requiredFields = [
    "id",
    "title",
    "status",
    "story_points",
    "retry_count",
    "branch",
  ];

  const errors: string[] = [];

  for (const file of getIntentFiles()) {
    const content = read(file);

    for (const field of requiredFields) {
      if (!getField(content, field)) {
        errors.push(`${file} is missing field: ${field}`);
      }
    }

    const currentStatus = getField(content, "status");

    if (
      currentStatus &&
      !VALID_STATUSES.includes(currentStatus as IntentStatus)
    ) {
      errors.push(`${file} has invalid status: ${currentStatus}`);
    }
  }

  if (errors.length > 0) {
    console.error("\n❌ Invalid intents\n");

    for (const error of errors) {
      console.error(`- ${error}`);
    }

    process.exit(1);
  }

  console.log("✅ All intents are valid");
}

function doctor() {
  console.log("\nAI-DLC Doctor\n");

  try {
    checkSetup();
  } catch {
    process.exit(1);
  }

  validateIntents();

  console.log("\n✅ AI-DLC doctor completed");
}

function help() {
  console.log(`
AI-DLC CLI

Usage:
  bun scripts/aidlc.ts setup
  bun scripts/aidlc.ts check-setup
  bun scripts/aidlc.ts new "Add login page"
  bun scripts/aidlc.ts status
  bun scripts/aidlc.ts list
  bun scripts/aidlc.ts next
  bun scripts/aidlc.ts validate
  bun scripts/aidlc.ts doctor
`);
}

const [command, ...args] = process.argv.slice(2);

switch (command) {
  case "setup":
    setup();
    break;

  case "check-setup":
    checkSetup();
    break;

  case "new":
    createIntent(args.join(" ") || "Untitled intent");
    break;

  case "status":
    status();
    break;

  case "list":
    listIntents();
    break;

  case "next":
    nextIntent();
    break;

  case "validate":
    validateIntents();
    break;

  case "doctor":
    doctor();
    break;

  default:
    help();
}
