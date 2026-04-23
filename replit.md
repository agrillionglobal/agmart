# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

## Artifacts

- **Agrillion Mart (`artifacts/ag-mart`)** — React + Vite web marketplace at `/`. Connects buyers with verified farmers and vendors. Uses local in-browser cart/order persistence (no backend yet). Pages: Home, Browse, Product, Vendors, Vendor, Cart, Checkout, Orders. Brand logo at `src/assets/logo.jpeg` and `public/logo.jpeg`.
- **API Server (`artifacts/api-server`)** — Express 5 API at `/api`. Currently only health check; ready for future server-backed features.
- **Mockup Sandbox (`artifacts/mockup-sandbox`)** — Vite preview server for canvas mockups.

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
