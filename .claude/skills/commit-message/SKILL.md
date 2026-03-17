---
name: commit-message
description: Generate a conventional commit message from the current git diff.
---

1. Run `git status --short` and `git diff --staged`.
2. If nothing is staged, ask whether to use `git diff` instead.
3. Summarize changes in 1 short line (<= 72 chars) using Conventional Commits.
4. Use optional scope when it is obvious (e.g., web, tanstack, ds).
5. Do not include unrelated files or refactors in the summary.
6. Output only the final commit message line unless asked to explain.
