# NPS Choice Platform

Foundation baseline for a modular monolith that helps applicants compare NPS directions and prepares an internal contour for admissions analytics.

## Branch model

- `main` - stable branch
- `develop` - integration branch for foundation and subsequent feature work

## Current status

Foundation is implemented and locally verified.

Active implementation note for `feature/nps-comparison`:

- applicant-facing catalog, direction detail, and comparison are being built on mock data first
- the mock source is derived from the richer `hosts.txt` example shape
- the first UI iteration may surface:
  - code, qualification, department, study duration
  - budget and paid seats
  - tuition per year
  - passing score trends
  - key subject blocks and total subject-hour context
- real database integration for this richer academic structure will be connected later through repository or adapter replacement, not through a UI rewrite

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

`feature/nps-comparison` now includes:

- `/directions` - mock-backed catalog for 4 comparison-ready directions
- `/directions/[slug]` - direction detail page with structured applicant-facing data
- `/compare` - compare page with 2-4 direction selection states and a real differences view
- event emission for catalog, direction detail, compare start, and comparison run

`feature/profile-test` adds:

- `/profile-test` - applicant questionnaire with single-choice and multi-select answers
- deterministic explainable recommendation scoring based on module-owned contracts
- direct compare handoff via `source=recommendation-flow`
- recommendation result analytics through `recommendation_generated`

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
- for `feature/profile-test`, merge readiness also requires the profile-test smoke path to pass

## Recommendation constraints

- recommendation logic is explainable and deterministic
- recommendation logic must not include editorial promotion
- the profile test routes users into comparison instead of pretending to return one objectively correct direction
- recommendation analytics should distinguish profile-test-driven compare journeys from catalog-driven ones

## Local and test flags

- `NPS_DISABLE_EVENT_WRITE=false` by default and keeps applicant analytics on the Prisma-backed event path
- set `NPS_DISABLE_EVENT_WRITE=true` for local or test runs when you need public routes and smoke flows to work without a writable event database
- Playwright smoke runs set this flag intentionally so e2e coverage validates the applicant flow instead of failing on local event persistence setup

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
