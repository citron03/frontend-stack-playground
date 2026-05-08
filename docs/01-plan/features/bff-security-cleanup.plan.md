# bff-security-cleanup Planning Document

> **Summary**: Enhance BFF security with CORS and environment variables, route test requests through proxy, and clean up unused dependencies.
>
> **Project**: practice-next-15
> **Version**: 0.1.0
> **Author**: Gemini CLI
> **Date**: 2026-05-08
> **Status**: Draft

---

## Executive Summary

This plan addresses several code review suggestions to improve the security, flexibility, and maintainability of the BFF (Backend For Frontend) integration. Key improvements include securing CORS settings, using environment variables for ports and URLs, routing test traffic through the official API proxy, and removing unused dependencies.

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

### 1.1 Purpose

Secure the BFF integration and align with the intended architectural pattern (Next.js API Proxy).

### 1.2 Background

Initial implementation used hardcoded URLs and ports, and wide-open CORS for rapid prototyping. Now it's time to harden and clean up.

### 1.3 Related Documents

- BFF Integration Plan: `docs/01-plan/features/bff-integration.plan.md`

---

## 2. Scope

### 2.1 In Scope

- [x] Restrict CORS in `apps/bff/src/index.ts`.
- [x] Use environment variables for BFF port.
- [x] Use environment variables for BFF URL in Next.js proxy.
- [x] Route `bff-test` page requests through the Next.js API proxy.
- [x] Remove unused `zod` dependency from `apps/bff`.

### 2.2 Out of Scope

- Implementing full authentication/authorization.
- Adding new BFF features.

---

## 3. Requirements

### 3.1 Functional Requirements

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| FR-01 | BFF port should be configurable via `PORT` env var (default 3001). | High | Pending |
| FR-02 | BFF URL in proxy should be configurable via `BFF_BASE_URL` env var. | High | Pending |
| FR-03 | `bff-test` page must use `/api/bff-proxy` instead of direct BFF port. | High | Pending |

### 3.2 Non-Functional Requirements

| Category | Criteria | Measurement Method |
|----------|----------|-------------------|
| Security | CORS origin should be restricted to the Web app origin. | Manual verification / Browser check |
| Maintainability | Unused dependencies should be removed. | `package.json` check |

---

## 4. Success Criteria

### 4.1 Definition of Done

- [ ] BFF starts on `process.env.PORT` or 3001.
- [ ] CORS restricted to allowed origins.
- [ ] `bff-test` page works via proxy.
- [ ] `zod` removed from `apps/bff`.
- [ ] Unit tests (if applicable) pass.

### 4.2 Quality Criteria

- [ ] Zero lint errors in changed files.
- [ ] Environment variables have sensible defaults for development.

---

## 5. Risks and Mitigation

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Connection Failure | High | Medium | Provide sensible defaults for env vars; verify local dev works. |
| CORS Block | Medium | Low | Ensure both `localhost:3000` (Web) and other dev origins are considered if needed. |

---

## 6. Architecture Considerations

### 6.1 Project Level Selection

| Level | Characteristics | Recommended For | Selected |
|-------|-----------------|-----------------|:--------:|
| **Dynamic** | Feature-based modules, services layer | Web apps with backend, SaaS MVPs | ☑ |

### 6.2 Key Architectural Decisions

| Decision | Options | Selected | Rationale |
|----------|---------|----------|-----------|
| BFF Proxy | Direct vs Proxy | Proxy | Security and endpoint centralization. |
| Env Var Management | Hardcoded vs Env | Env | Flexibility across environments. |

---

## 7. Convention Prerequisites

### 7.3 Environment Variables Needed

| Variable | Purpose | Scope | To Be Created |
|----------|---------|-------|:-------------:|
| `PORT` | BFF server port | Server (BFF) | ☐ |
| `BFF_BASE_URL` | BFF API URL | Server (Web) | ☐ |

---

## 8. Next Steps

1. [ ] Write design document (`bff-security-cleanup.design.md`)
2. [ ] Implementation
3. [ ] Verification

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 0.1 | 2026-05-08 | Initial draft based on code review | Gemini CLI |
