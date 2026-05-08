---
name: commit-message
description: Generate a conventional commit message, stage changes, and create the commit.
---

1. Run `git status --short`.
2. If there are no changes, stop and report "nothing to commit".
3. Build commit intent from `git diff --staged` first.
4. If nothing is staged, stage all current changes with `git add -A`, then read `git diff --staged`.
5. Summarize changes in 1 short line (<= 72 chars) using Conventional Commits.
6. Use optional scope when it is obvious (e.g., web, tanstack, ds, docs, ai).
7. Do not include unrelated files or refactors in the summary.
8. Commit directly with `git commit -m "<final-message>"`.
9. Final output format:
   - First line: final commit message only
   - Second line: `Committed: yes|no`
