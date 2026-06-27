const allowedBranches = [/^dev$/, /^intent\/.+/];
const forbiddenBranches = new Set(["main"]);

function validateBranch(branch: string, label = "Branch") {
  if (forbiddenBranches.has(branch)) {
    console.error("Direct pushes from main are not allowed. Use dev or an intent/* branch.");
    process.exit(1);
  }

  if (!allowedBranches.some((pattern) => pattern.test(branch))) {
    console.error(`${label} "${branch}" is not allowed for push checks. Use dev or intent/*.`);
    process.exit(1);
  }
}

function currentBranch() {
  const branchResult = Bun.spawnSync({
    cmd: ["git", "branch", "--show-current"],
    stdout: "pipe",
    stderr: "pipe",
  });

  if (branchResult.exitCode !== 0) {
    process.stderr.write(branchResult.stderr.toString());
    process.exit(branchResult.exitCode);
  }

  const branch = branchResult.stdout.toString().trim();

  if (!branch) {
    console.error("Cannot validate branch: detached HEAD or unknown current branch.");
    process.exit(1);
  }

  return branch;
}

function branchNameFromRef(ref: string) {
  return ref.startsWith("refs/heads/") ? ref.slice("refs/heads/".length) : null;
}

const pushUpdates = process.stdin.isTTY ? "" : await Bun.stdin.text();
const updateLines = pushUpdates
  .split(/\r?\n/)
  .map((line) => line.trim())
  .filter(Boolean);

if (updateLines.length === 0) {
  const branch = currentBranch();
  validateBranch(branch);
  console.log(`Branch check passed: ${branch}`);
  process.exit(0);
}

for (const line of updateLines) {
  const [localRef, , remoteRef] = line.split(/\s+/);
  const remoteBranch = branchNameFromRef(remoteRef ?? "");

  if (remoteBranch && forbiddenBranches.has(remoteBranch)) {
    console.error("Direct pushes to main are not allowed. Use dev or an intent/* branch.");
    process.exit(1);
  }

  if (localRef === "delete") {
    continue;
  }

  const localBranch = localRef === "HEAD" ? currentBranch() : branchNameFromRef(localRef ?? "");

  if (localBranch) {
    validateBranch(localBranch, "Local branch");
  }
}

console.log("Branch check passed for pre-push refs.");
