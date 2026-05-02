# Design: BFF Integration

## Context Anchor
| Dimension | Content |
|-----------|---------|
| WHY | Consolidated backend logic and optimized data fetching for multiple frontends. |
| WHO | Developers building and testing frontend-backend integration. |
| RISK | Potential complexity in monorepo configuration, CORS issues, and deployment overhead. |
| SUCCESS | A functional BFF app in `apps/bff` communicating with at least one frontend app. |
| SCOPE | Setting up `apps/bff` (Express/TypeScript), basic API endpoints, and integration example in `apps/web`. |

## 1. Overview
The BFF will serve as an intermediary between the frontend applications and downstream services or databases. It will reside in `apps/bff` and be managed as a first-class citizen in the pnpm workspace.

## 2. Architecture Options

### Option A: Minimal Express
- **Description**: A single-file or very flat Express server.
- **Pros**: Extremely fast to set up, minimal boilerplate.
- **Cons**: Difficult to scale or maintain as complexity grows.
- **Suitability**: Best for quick prototyping or very simple backends.

### Option B: Layered Express (Clean-ish)
- **Description**: Express server with separated directories for `routes`, `controllers`, and `services`.
- **Pros**: Better organization, easier to test individual components.
- **Cons**: More boilerplate for a simple testing setup.
- **Suitability**: Best for production-grade backends with multiple contributors.

### Option C: Hono (Modern & Pragmatic)
- **Description**: Use Hono, a modern, ultra-fast web framework for any-runtime.
- **Pros**: Excellent TypeScript support, lightweight, middleware-rich, great performance.
- **Cons**: Slightly different API than Express (though similar).
- **Suitability**: Best for modern BFFs, especially if Edge deployment is a future possibility.

## 3. Comparison & Recommendation

| Criteria | Option A | Option B | Option C |
|----------|----------|----------|----------|
| Complexity | Very Low | Medium | Low |
| Maintainability| Low | High | Medium/High |
| Performance | Medium | Medium | High |
| Development Speed | High | Medium | High |

**Recommendation**: **Option C (Hono)** is recommended for its modern approach, excellent type safety, and minimal overhead, which aligns well with the "testing basic configuration" requirement while providing a solid foundation for the future.

## 4. Implementation Details
- **Directory**: `apps/bff`
- **Language**: TypeScript
- **Dependencies**: `hono`, `@hono/node-server`, `zod` (for validation)
- **Tooling**: `tsx` for development, `vitest` for testing.
- **Workspace Integration**: Add `bff` to `package.json` scripts and Turborepo pipeline.

## 5. Session Guide
- `apps/bff/package.json`: Basic package configuration.
- `apps/bff/src/index.ts`: Entry point with Hono server.
- `apps/bff/tsconfig.json`: TypeScript configuration extending `tsconfig.base.json`.
- `apps/web/app/api/bff-proxy/route.ts`: (Optional) Next.js proxy if needed, or direct fetch from client.
