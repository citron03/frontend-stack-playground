---
name: first-run-setup
description: Run first-time repository bootstrap and superpowers setup.
---

Run:
- `pnpm install`
- `git submodule sync --recursive`
- `git submodule update --init --recursive`
- `pnpm ai:setup-stack`
- `pnpm ai:check-stack`
- `pnpm ai:check-config-sync`
