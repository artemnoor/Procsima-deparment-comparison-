# Architecture: Modular Monolith

## Overview

`nps-choice-platform` is a single deployable modular monolith. The repository contains one product
application with one primary runtime and one primary database, but internal module boundaries must stay
explicit so applicant-facing flows, recommendation logic, analytics, and internal admissions tooling do
not collapse into route-level code.

The current implementation baseline is:

- Next.js
- TypeScript
- PostgreSQL
- Prisma
- Zod
- Vitest
- Playwright
- pnpm

## Decision Rationale

- the product is still moving through MVP and early release stages;
- public applicant experience and internal admissions tooling already define clear capability areas;
- the team needs fast delivery and low operational overhead more than service-level isolation;
- explicit module APIs are enough to keep later extraction possible without paying the cost now.

## System Shape

```text
+-------------------------------------------------------------------+
|                       nps-choice-platform                         |
+-------------------------------------------------------------------+
| Next.js app router shell                                          |
| public UI routes, internal/admin routes, route handlers           |
+----------------------------+--------------------------------------+
                             |
                             v
+-------------------------------------------------------------------+
|                             modules                               |
|                                                                   |
| catalog | direction-pages | comparison | recommendation           |
| learning-content | content | analytics | users | auth | admin     |
+-------------------------------------------------------------------+
                             |
                             v
+-------------------------------------------------------------------+
|                   shared kernel, ui, and utilities                |
+-------------------------------------------------------------------+
                             |
                             v
+-------------------------------------------------------------------+
|                  PostgreSQL, Prisma, external infra               |
+-------------------------------------------------------------------+
```

## Folder Structure

```text
nps-choice-platform/
|-- app/
|   |-- (public)/
|   |-- admin/
|   `-- api/
|-- docs/
|   |-- product-concept.md
|   `-- process/
|-- prisma/
|   |-- migrations/
|   `-- schema.prisma
|-- src/
|   |-- app/
|   |-- env/
|   |-- instrumentation/
|   |-- modules/
|   |   |-- catalog/
|   |   |-- direction-pages/
|   |   |-- comparison/
|   |   |-- recommendation/
|   |   |-- learning-content/
|   |   |-- content/
|   |   |-- analytics/
|   |   |-- users/
|   |   |-- auth/
|   |   `-- admin/
|   `-- shared/
|-- tests/
|   |-- unit/
|   |-- integration/
|   `-- e2e/
|-- .ai-factory/
|   |-- DESCRIPTION.md
|   |-- ARCHITECTURE.md
|   |-- ROADMAP.md
|   |-- RULES.md
|   |-- RESEARCH.md
|   |-- patches/
|   `-- plans/
`-- README.md
```

## Contours

### Public Contour

The public contour owns:

- directions catalog and detail pages;
- structured learning-content presentation;
- comparison flow;
- profile-test and recommendation result flow;
- applicant analytics events.

### Internal Contour

The internal contour owns:

- dashboard access;
- analytics views;
- editorial and operational controls;
- protected internal routes and role checks.

## Module Rules

Modules are the primary structural unit. Each module owns its business logic and exports a public API
through `index.ts` only.

- OK: routes, server actions, and UI adapters depend on a module public API
- OK: a module `application/` layer depends on its own `domain/` layer and `shared/kernel`
- OK: `infra/` implements ports defined by the same module
- OK: one module consumes another only through the other module's public API
- OK: analytics consumes explicit events rather than hidden side effects
- NO: direct imports from another module's internal files
- NO: business logic living in `app/` route files
- NO: public flows depending on admin internals
- NO: recommendation logic mixed with editorial promotion logic
- NO: `shared/` becoming a dumping ground for feature-specific behavior

## Layer Responsibilities

- `api/`: transport adapters, request parsing, DTO mapping, response shaping
- `application/`: use cases, orchestration, transaction boundaries
- `domain/`: entities, value objects, invariants, ports, business rules
- `infra/`: Prisma repositories, mock adapters, external clients, framework-specific implementations
- `index.ts`: supported public entry point for the module

## Current Data Seam

Public read flows must preserve the current source seam:

- `src/app/public-direction-data.ts` selects public repositories;
- default public source is `mock`;
- `NPS_PUBLIC_DIRECTION_SOURCE=prisma` enables Prisma-backed reads;
- pages and components must not care whether data came from mock records or Prisma;
- Prisma-backed learning-content may still use fallback placeholders until richer academic fields are
  persisted.

## Gitflow Impact

Architecture changes are not made directly on `main` or `develop`.

- structural changes start in `feature/*` branches;
- integration happens through `develop`;
- release branches may stabilize architecture docs but must not introduce new feature scope;
- hotfix branches must stay minimal and be merged back into both `main` and `develop`.

## Practical Rule for Daily Work

Before adding code, answer four questions:

1. Which module owns this behavior?
2. Is this public contour, internal contour, or shared foundation?
3. Does the code belong in `api`, `application`, `domain`, or `infra`?
4. Am I consuming another module through its public API only?

If any answer is unclear, resolve the boundary before writing more code.
