const messagePath = Bun.argv[2];

if (!messagePath) {
  console.error("Usage: bun scripts/check-commit-message.ts <commit-msg-file>");
  process.exit(1);
}

const message = (await Bun.file(messagePath).text()).trim();
const firstLine = message.split(/\r?\n/, 1)[0] ?? "";

const conventionalCommitPattern =
  /^(build|chore|ci|docs|feat|fix|perf|refactor|revert|style|test)(\([a-z0-9._-]+\))?!?: .{1,72}$/;
const intentCommitPattern = /^intent\/[a-z0-9-]+: .{1,72}$/;
const mergeCommitPattern = /^Merge /;
const revertCommitPattern = /^Revert "/;
const fixupCommitPattern = /^(fixup|squash)! /;

if (
  conventionalCommitPattern.test(firstLine) ||
  intentCommitPattern.test(firstLine) ||
  mergeCommitPattern.test(firstLine) ||
  revertCommitPattern.test(firstLine) ||
  fixupCommitPattern.test(firstLine)
) {
  process.exit(0);
}

console.error("Commit message must use an AI-DLC intent commit or Conventional Commit:");
console.error("  intent/<id>: short summary");
console.error("  type(scope): short summary");
console.error("Examples:");
console.error("  intent/2r8t: add eslint and local hooks");
console.error("  feat(aidlc): add branch validation");
console.error("  fix: handle missing intent status");
process.exit(1);
