# Claude Code Project Setup

This folder contains project-specific Claude Code automation assets.

Layout:
- skills/: reusable task playbooks
- commands/: shortcut commands mapped to common workflows
- hooks/: event-triggered behaviors (session start, pre-change, pre-test)
- ai/: security-first AI policy (MCP/plugins/multi-agent/project analysis)
  - includes `superpowers.json` for Codex capability profile

If your Claude Code version expects a different schema, keep the intent and
adjust file headers/structure accordingly.
