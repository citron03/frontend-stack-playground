# bff-security-cleanup Design Document

> **Summary**: Secure and clean up the BFF integration using environment variables, restricted CORS, and proxy routing.
>
> **Project**: practice-next-15
> **Version**: 0.1.0
> **Author**: Gemini CLI
> **Date**: 2026-05-08
> **Status**: Draft
> **Planning Doc**: [bff-security-cleanup.plan.md](../01-plan/features/bff-security-cleanup.plan.md)

## Context Anchor

| Dimension | Content |
|-----------|---------|
| WHY | Improve security (CORS) and flexibility (env vars) while following the intended proxy architecture. |
| WHO | Developers maintaining the BFF and Web apps. |
| RISK | Breaking the connection between Web and BFF if env vars are misconfigured. |
| SUCCESS | BFF runs on a configurable port; Web app uses proxy for all BFF calls; CORS is restricted to known origins; unused `zod` is removed. |
| SCOPE | `apps/bff` (security/cleanup), `apps/web` (proxy routing/env vars). |

---

## 1. Overview

### 1.1 Design Goals

- Remove hardcoded configurations (ports, URLs).
- Restrict cross-origin resource sharing (CORS) to trusted origins.
- Centralize all BFF communication through the Next.js API proxy.
- Reduce dependency bloat in the BFF service.

---

## 2. Architecture

### 2.1 Component Diagram

```
┌─────────────┐     ┌──────────────┐     ┌──────────────┐
│  Web App    │────▶│ Next.js Proxy│────▶│  BFF Server  │
│ (bff-test)  │     │ (/api/bff-*) │     │ (Hono Server)│
└─────────────┘     └──────────────┘     └──────────────┘
```

### 2.2 Data Flow

1. `bff-test` page requests `/api/bff-proxy`.
2. Next.js Route Handler (`apps/web/app/api/bff-proxy/route.ts`) reads `BFF_BASE_URL`.
3. Next.js fetches from `BFF_BASE_URL/api/hello`.
4. BFF Server (`apps/bff/src/index.ts`) verifies origin via CORS and processes request.

---

## 3. Architecture Options

### Option A — Minimal Changes (Selected)
- Modify existing files to use environment variables with fallback values.
- Update `bff-test` to use relative proxy path.
- Remove `zod` from `package.json`.

---

## 4. Environment Variables

| Variable | Purpose | Location | Default (Dev) |
|----------|---------|----------|---------------|
| `PORT` | BFF server port | `apps/bff` | `3001` |
| `BFF_BASE_URL` | BFF API URL | `apps/web` | `http://localhost:3001` |

---

## 5. Implementation Guide

### 5.1 BFF (apps/bff)
- Update `src/index.ts` to use `process.env.PORT`.
- Update `src/index.ts` to restrict `cors()` to `http://localhost:3000` (and potentially other origins via env var if needed).
- Run `pnpm remove zod` in `apps/bff`.

### 5.2 Web App (apps/web)
- Update `app/api/bff-proxy/route.ts` to use `process.env.BFF_BASE_URL`.
- Update `app/bff-test/page.tsx` to fetch from `/api/bff-proxy`.

---

## 6. Security Considerations

- [x] CORS restricted to `http://localhost:3000`.
- [x] Sensitive URLs moved to environment variables.
- [x] Proxy used to hide actual BFF port/location from client browser.

---

## 7. Test Plan

### 7.1 Test Cases
- [ ] **BFF Port**: Start BFF with `PORT=3005` and verify it listens on 3005.
- [ ] **Proxy Fetch**: Fetch from `/api/bff-proxy` and verify it returns data from BFF.
- [ ] **CORS Verification**: Verify that direct browser requests to BFF from non-allowed origins are blocked (if applicable).
- [ ] **Test Page**: Open `/bff-test` in the browser and verify data is displayed correctly via proxy.

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 0.1 | 2026-05-08 | Initial draft | Gemini CLI |
