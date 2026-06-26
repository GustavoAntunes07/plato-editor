const allowedBranches = [/^dev$/, /^intent\/.+/];
const forbiddenBranches = new Set(["main"]);

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

if (forbiddenBranches.has(branch)) {
  console.error("Direct pushes from main are not allowed. Use dev or an intent/* branch.");
  process.exit(1);
}

if (!allowedBranches.some((pattern) => pattern.test(branch))) {
  console.error(`Branch "${branch}" is not allowed for push checks. Use dev or intent/*.`);
  process.exit(1);
}

console.log(`Branch check passed: ${branch}`);
