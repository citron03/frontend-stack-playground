---
name: gh-pr-review-apply
description: Analyze GitHub PR/MR comments, decide what to adopt or reject with reasons, apply accepted changes safely, and summarize outcomes. Use when asked to read PR review feedback and reflect it in the current branch.
---

1. Collect review context from GitHub.
- Prefer GitHub app tools for PR comments and review threads.
- If unavailable, use `gh pr view <number> --comments` and review APIs.
- Gather: top-level comments, inline threads, review state, and current diff scope.

2. Extract actionable items only.
- Ignore noise logs, duplicate bot text, and already-resolved non-actionable chatter.
- Split each actionable item into one unit: file target, requested change, rationale, urgency.

3. Decide per item with explicit status.
- `Adopt`: correct, in-scope, and low regression risk.
- `Reject`: incorrect, out-of-scope, or conflicts with product/design intent.
- `Defer`: valid but too large/risky for this PR.
- Always attach one short reason for each decision.

4. Apply only `Adopt` items.
- Make minimal edits that satisfy the request.
- Preserve unrelated local changes.
- If feedback implies tests/config updates, apply them in the same pass.

5. Validate before finishing.
- Run the smallest relevant tests/lint/typecheck for touched areas.
- If validation cannot run, state exactly what was skipped and why.

6. Report clearly.
- Provide a table or bullet summary with `Adopt/Reject/Defer`.
- Include changed files, validation results, and residual risks.

7. Post a PR reply by default after applying changes.
- Post one concise PR comment summarizing: decision table, applied files, validation outcomes.
- Prefer GitHub app comment tools first; if unavailable, use `gh pr comment`.
- If posting fails (for example `403 Resource not accessible by integration`), report the exact failure reason and provide a ready-to-run fallback command for manual posting.
- Include the posted comment URL when successful.
