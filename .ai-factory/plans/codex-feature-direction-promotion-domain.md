# Plan: Direction Promotion Domain

- Branch: `codex/feature-direction-promotion-domain`
- Created: `2026-03-18`
- Status: `in_progress`

## Settings

- Testing: `yes`
- Logging: `verbose`
- Docs: `yes`

## Roadmap Linkage

- Milestone: `Direction Promotion`
- Rationale: The roadmap already reserves a separate milestone for editorial promotion, and the
  architecture explicitly requires it to stay isolated from deterministic recommendation logic.

## Research Context

- Recommendation logic is already deterministic and explainable in
  `src/modules/recommendation` and must remain free from editorial influence.
- The internal contour now has a first analytics/dashboard backend slice, which gives the team a
  protected admin seam for operational controls.
- Prisma currently persists applicant-facing `Direction` records, but there is no promotion
  model, no promotion policy, and no admin-facing mutation flow.
- The architecture rules explicitly state: recommendation logic must not mix with editorial
  promotion logic.

## Scope

Introduce the first domain-owned editorial promotion subsystem for directions.

This feature should provide:

- an explicit promotion domain model owned by the `admin` contour;
- persistence for promotion rules or campaign-style boosts attached to directions;
- application services for creating, listing, activating, deactivating, and ordering promotions;
- a protected admin API for promotion management;
- a read model that exposes promoted directions separately from recommendation output;
- tests that prove recommendation ranking remains untouched by promotion data.

Out of scope for this feature:

- redesign of public pages;
- replacing recommendation scoring with blended ranking;
- CMS-grade content editing;
- advanced scheduling automation beyond a practical MVP policy;
- release stabilization work unrelated to promotion behavior.

## Current Gap Summary

### Domain gap

There is currently no first-class concept of:

- promotion rule;
- promotion status;
- promotion time window;
- promotion priority or weight;
- rationale/audit note for why a direction is editorially promoted.

### Persistence gap

`prisma/schema.prisma` stores directions and analytics events, but no admin-owned tables exist for
editorial promotion decisions.

### API gap

The internal contour has dashboard reads, but no protected mutation or listing endpoint for
promotion management.

### Behavioral gap

Public recommendation flow already states that it is not promotion-driven, but the codebase still
lacks a formal guard proving that editorial promotion cannot leak into recommendation ranking.

### Observability gap

There is not yet a clear operational view of:

- which directions are actively promoted;
- why they are promoted;
- when promotions start and end;
- how promotion state should later be surfaced to internal tooling.

## Implementation Phases

### Phase 1: Freeze The Promotion Domain Contract

#### Task 1.1: Define the editorial promotion language and invariants

- Files to inspect and update:
  - `src/modules/admin/`
  - `src/modules/recommendation/`
  - `src/shared/kernel/direction.ts`
  - `docs/current-system-reference.md`
- Deliverable:
  - clear definition of promotion concepts such as:
    - draft vs active state;
    - promotion priority;
    - active window;
    - editorial note;
    - separation from recommendation output
  - explicit invariants for invalid states, for example:
    - end date before start date;
    - promotion for unknown direction;
    - duplicate active promotion policy if unsupported
- Logging requirements:
  - no runtime logging changes yet
  - document the vocabulary and invariants in code-level types and docs
- Dependency notes:
  - this task must finish before schema and API work

#### Task 1.2: Decide the MVP promotion interaction model

- Files to inspect and update:
  - `.ai-factory/RESEARCH.md` if needed
  - `README.md`
  - `docs/current-system-reference.md`
- Deliverable:
  - explicit decision on whether MVP supports:
    - one active promotion per direction;
    - multiple promotions with priority ordering;
    - optional time windows;
    - manual activation only
  - clear statement of how promoted directions may later be surfaced without altering
    recommendation ranking
- Logging requirements:
  - none
- Dependency notes:
  - blocks schema shape and repository design

### Phase 2: Add Prisma Persistence For Promotion

#### Task 2.1: Extend Prisma schema with a promotion model owned by the admin contour

- Files to change:
  - `prisma/schema.prisma`
  - `prisma/migrations/*` (new migration)
- Deliverable:
  - new promotion persistence capable of storing:
    - direction reference;
    - state;
    - priority or weight;
    - start/end timestamps if enabled by the MVP contract;
    - editorial note or reason;
    - created/updated metadata
- Logging requirements:
  - no app logs here
  - migration name should clearly reference direction promotion
- Dependency notes:
  - depends on Tasks 1.1-1.2

#### Task 2.2: Seed and test fixtures for promotion scenarios

- Files to change:
  - `prisma/seed.ts`
  - `tests/integration/helpers/prisma.ts`
- Deliverable:
  - baseline promoted and non-promoted direction fixtures for integration coverage
  - fixture combinations that prove ordering and activation behavior
- Logging requirements:
  - keep seed output concise
  - add seed summary only if it materially helps local debugging
- Dependency notes:
  - depends on Task 2.1

### Phase 3: Implement Admin Domain, Application, And Infra

#### Task 3.1: Add admin promotion domain contracts and repository ports

- Files to change:
  - `src/modules/admin/domain/*`
  - `src/modules/admin/index.ts`
- Deliverable:
  - domain types or entities for promotion records
  - repository ports for listing and mutating promotions
  - validation of state transitions and invalid windows
- Logging requirements:
  - no infra logs here
  - domain errors should be explicit and typed where practical
- Dependency notes:
  - depends on Tasks 1.1-2.2

#### Task 3.2: Implement Prisma repository for promotion management

- Files to change:
  - `src/modules/admin/infra/*`
- Deliverable:
  - Prisma-backed repository supporting:
    - list promotions;
    - create promotion;
    - activate/deactivate promotion;
    - update priority or note;
    - resolve currently active promotions
- Logging requirements:
  - `info`: operation name, promotion id or direction id
  - `debug`: counts, active filters, resolved ordering
  - `warn`: unexpected missing records or invalid state transitions reaching infra boundaries
- Dependency notes:
  - depends on Task 3.1

#### Task 3.3: Implement application services for admin promotion flows

- Files to change:
  - `src/modules/admin/application/*`
  - `src/app/*` composition files if needed
- Deliverable:
  - use cases for:
    - get promotion list;
    - create promotion;
    - change promotion status;
    - reorder or reprioritize promotions
  - DTOs shaped for the internal contour
- Logging requirements:
  - `info`: high-level admin actions
  - `debug`: sanitized filters and resulting counts
- Dependency notes:
  - depends on Tasks 3.1-3.2

### Phase 4: Expose Protected Internal Promotion APIs

#### Task 4.1: Add protected admin route handlers for promotion reads and mutations

- Files to change:
  - `app/api/admin/**`
  - existing auth/admin wiring if required
- Deliverable:
  - protected API endpoints for:
    - listing promotions;
    - creating promotions;
    - changing status or priority
  - request validation and stable response DTOs
- Logging requirements:
  - `info`: route, action, actor id if available
  - `debug`: validated input shape without leaking sensitive payload noise
  - `warn`: rejected invalid operations
- Dependency notes:
  - depends on Task 3.3

#### Task 4.2: Add a minimal internal admin view or placeholder integration

- Files to change:
  - `app/admin/**`
  - optionally `src/shared/ui/**` if presentation helpers are needed
- Deliverable:
  - minimal internal surface proving the promotion API is consumable
  - enough rendering to inspect active promotion state without a full redesign
- Logging requirements:
  - preserve current shell and admin page logging style
- Dependency notes:
  - depends on Task 4.1

### Phase 5: Lock The Separation From Recommendation Logic

#### Task 5.1: Add tests proving promotion data does not alter recommendation ranking

- Files to change:
  - `tests/integration/recommendation/*`
  - `tests/integration/admin/*`
  - `tests/e2e/*` only if a smoke assertion is warranted
- Deliverable:
  - failing-first or newly added tests that prove:
    - recommendation results stay deterministic with or without active promotions;
    - promotion lists are an admin concern, not a recommendation input;
    - promoted direction exposure remains explicit and separate
- Logging requirements:
  - none beyond existing test output
- Dependency notes:
  - depends on Tasks 3.1-4.2

#### Task 5.2: Update docs and operator guidance

- Files to change:
  - `README.md`
  - `docs/current-system-reference.md`
  - optional `.ai-factory/RESEARCH.md` notes if implementation decisions need to persist
- Deliverable:
  - docs explaining:
    - what promotion is;
    - where it lives;
    - how it differs from recommendation;
    - what is implemented in the MVP slice
- Logging requirements:
  - none
- Dependency notes:
  - final task before verification

## Verification Strategy

- `pnpm format:check`
- `pnpm lint`
- `pnpm typecheck`
- `pnpm test:integration`
- targeted admin/recommendation smoke coverage if the internal contour behavior changes materially

## Expected Outcome

After this feature:

- editorial promotion exists as a first-class admin-owned subsystem;
- recommendation logic remains deterministic and separate;
- the internal contour can manage active promotions through protected APIs;
- the codebase is ready for later UI polish or richer promotion workflows without breaking the
  public recommendation contract.
