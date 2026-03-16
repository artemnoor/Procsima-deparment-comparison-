# NPS Choice Platform

Foundation baseline for a modular monolith that helps applicants compare NPS directions and prepares an internal contour for admissions analytics.

## Branch model

- `main` - stable branch
- `develop` - integration branch for foundation and subsequent feature work

## Current status

Foundation is implemented and locally verified.

Current baseline includes:

- Next.js application shell
- public and internal contours
- health and readiness endpoints
- Prisma schema, migrations, and seed
- baseline domain entities and module entry points
- analytics event publishing path
- internal auth skeleton for dashboard routes
- unit, integration, and e2e coverage
- local quality gates and CI workflow

## Baseline stack

- `Next.js`
- `TypeScript`
- `PostgreSQL`
- `Prisma`
- `Zod`
- `Vitest`
- `Playwright`
- `pnpm`

## Foundation structure

- `app/` - application shell, public and internal routes, HTTP endpoints
- `src/modules/` - product modules with explicit public APIs
- `src/shared/` - shared kernel, shared UI primitives, small utilities
- `src/env/` - runtime environment validation
- `src/app/` - composition root and bootstrap wiring
- `prisma/` - schema, migrations, seed entry point
- `tests/` - unit, integration, and e2e suites

## Local quality gates

- `pnpm format:check` - formatting check
- `pnpm lint` - ESLint checks
- `pnpm typecheck` - TypeScript validation
- `pnpm test` - unit tests
- `pnpm test:integration` - integration tests
- `pnpm test:e2e` - smoke/e2e tests
- `pnpm check` - required local gate before merge into `develop`
- `pnpm check:develop` - full local gate including e2e

Rule for `develop`:

- code should not be merged into `develop` unless `pnpm check` is green
- before declaring foundation work ready, `pnpm check:develop` should be green

## CI baseline

- GitHub Actions workflow: `.github/workflows/ci.yml`
- Pipeline stages:
  - dependency install
  - Prisma generate
  - database migrate and seed
  - format check
  - lint
  - typecheck
  - unit tests
  - integration tests
  - e2e smoke tests

Branch policy:

- pull requests into `develop` and `main` must keep CI green
- `develop` is not considered ready for feature-branch integration if CI is red

## Foundation completion criteria

- application starts locally
- database migrations and seed are reproducible
- unit, integration, and e2e checks are green
- module boundaries are explicit
- public event flow is wired
- internal admin routes are protected
- `develop` is ready to accept `feature/*` branches
