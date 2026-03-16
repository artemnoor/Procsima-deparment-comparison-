# NPS Choice Platform

Foundation baseline for a modular monolith that helps applicants compare NPS directions and prepares an internal contour for admissions analytics.

## Branch model

- `main` - stable branch
- `develop` - integration branch for foundation and subsequent feature work

## Current status

Foundation and the first applicant comparison flow are implemented and locally verified.

Active implementation note for `feature/learning-content`:

- applicant-facing catalog, direction detail, and comparison now depend on a structured learning-content model
- `src/modules/content` owns source normalization
- `src/modules/learning-content` owns applicant-facing shaping of normalized direction content
- mock records already surface:
  - learning outcomes
  - technology highlights
  - practical skills
  - study focus groups
  - explicit deferred fields for data that is not part of MVP yet
- Prisma-backed repositories intentionally fall back to partial/default learning-content until the real academic schema is expanded

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

## Current applicant flow

The current applicant flow includes:

- `/directions` - mock-backed catalog for 4 comparison-ready directions
- `/directions/[slug]` - direction detail page with structured applicant-facing data and learning-content sections
- `/compare` - compare page with 2-4 direction selection states, real differences view, and side-by-side learning-content highlights
- event emission for catalog, direction detail, compare start, and comparison run

## Mock-to-real data seam

The current branch is intentionally `mock first`.

Source switching is centralized in [public-direction-data.ts](/C:/Users/artem/admission/nps-choice-platform/src/app/public-direction-data.ts):

- `createDirectionCatalogRepository()`
- `createDirectionDetailsRepository()`
- `createDirectionComparisonRepository()`

Current behavior:

- default public source is `mock`
- setting `NPS_PUBLIC_DIRECTION_SOURCE=prisma` switches applicant-facing reads to Prisma-backed repositories
- routes and UI do not know whether data came from mock records or Prisma
- structured learning-content contracts stay stable across both sources
- when Prisma is active, applicant-facing pages receive fallback learning-content placeholders until real structured fields are persisted

Current MVP-visible learning-content fields:

- summary
- learning outcomes
- technology highlights
- practical skills
- study focus groups

Currently deferred learning-content fields:

- semester-by-semester curriculum progression
- certification mapping
- compliance or vendor-matrix metadata
- full normalized curriculum taxonomy

When the richer academic database model arrives later:

- replace or extend the current Prisma-backed repositories to map the real schema into the same read models
- keep `loadMockDirectionSourceRecords()` only as a development fallback or remove it after parity is reached
- do not rewrite `/directions`, `/directions/[slug]`, or `/compare` for the data migration

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
- for `feature/nps-comparison`, merge readiness also requires the mock-backed applicant flow smoke test to pass

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
