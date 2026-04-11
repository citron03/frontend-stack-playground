---
name: commit-auto
description: Stage all changes and create a conventional commit from current diff.
---

Run:
- `git add -A`
- `git status --short`
- `git diff --staged`
- `git commit -m "<conventional-commit-message>"`
