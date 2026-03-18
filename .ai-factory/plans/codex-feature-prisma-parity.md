# Plan: Prisma Parity For Public Applicant Flows

- Branch: `codex/feature-prisma-parity` (proposed; create from `develop` before implementation)
- Created: `2026-03-18`
- Status: `planned`

## Settings

- Testing: `yes`
- Logging: `verbose`
- Docs: `yes`

## Roadmap Linkage

- Milestone: `Release 0.1.0`
- Rationale: Prisma parity is the main blocker between the current mock-first public flow and a release candidate that can run against the real database without major feature loss.

## Research Context

- Current public read seam lives in `src/app/public-direction-data.ts`.
- `mock` currently powers the richest applicant experience; `prisma` is intentionally thinner.
- Catalog, detail, compare, and recommendation already share stable domain contracts in `src/shared/kernel/direction.ts`.
- The biggest current mismatch is not route logic, but data completeness and repository mapping.

## Scope

Bring Prisma-backed public read flows to practical parity with the current mock-backed applicant experience for:

- catalog
- direction detail
- comparison
- recommendation candidates

Parity here means:

- the same pages and use cases remain usable with `NPS_PUBLIC_DIRECTION_SOURCE=prisma`
- core applicant-facing fields are available from Prisma instead of returning `null` or empty collections
- fallback learning-content is reduced to a temporary safety net rather than the default experience
- integration and smoke coverage prove that Prisma mode is a valid runtime, not just a scaffold

Out of scope for this feature:

- admin dashboard UI
- editorial promotion logic
- redesign of public pages
- replacing all mock content sources immediately if some fallback is still needed during migration

## Current Gap Summary

### Catalog gap

`mock` catalog returns rich `context` fields through:

- `src/modules/catalog/infra/mock-direction-repository.ts`
- `src/modules/content/domain/direction-source.ts`
- `src/modules/learning-content/application/map-learning-content-view-model.ts`

`prisma` catalog in `src/modules/catalog/infra/prisma-direction-repository.ts` currently returns:

- no code
- no qualification
- no department
- no study duration
- no budget/paid seats
- no tuition

### Direction detail gap

`prisma` detail in `src/modules/direction-pages/infra/prisma-direction-details-repository.ts` currently returns:

- fallback learning content
- empty `subjects`
- empty `passingScores`
- `null` URLs
- `null` catalog context fields

### Comparison gap

`prisma` comparison in `src/modules/comparison/infra/prisma-direction-comparison-repository.ts` currently inherits the same missing detail payload:

- no subject data
- no passing scores
- fallback learning-content only
- no catalog context

### Recommendation gap

`prisma` recommendation candidates in `src/modules/recommendation/infra/prisma-recommendation-candidate-repository.ts` currently return:

- no subject blocks
- thinner candidate profile than mock

### Data model gap

`prisma/schema.prisma` currently stores only a thin `Direction` model and lacks persistence for:

- qualification
- department
- study duration
- seat counts
- tuition
- passing score history
- subject list
- structured learning-content blocks
- program/curriculum URLs

### Seed and test gap

`prisma/seed.ts` and `tests/integration/helpers/prisma.ts` currently seed only two thin English-language directions, which is not enough to validate parity with the richer mock dataset.

## Implementation Phases

### Phase 1: Freeze The Target Parity Contract

#### Task 1.1: Document the Prisma parity contract against the current mock-backed public flows

- Files to inspect and update:
  - `docs/current-system-reference.md`
  - `.ai-factory/RESEARCH.md` if extra investigation notes are needed
  - `src/shared/kernel/direction.ts`
- Deliverable:
  - explicit list of applicant-facing fields that must exist in Prisma mode for catalog/detail/compare/recommendation
  - clear distinction between mandatory parity fields and allowed temporary fallback fields
- Logging requirements:
  - no runtime logging change
  - add developer-facing notes only in docs/plan artifacts
- Dependency notes:
  - this task must complete before schema and repository changes so the team is aligning to one target contract

#### Task 1.2: Define the canonical Prisma read-model shape for applicant direction data

- Files to inspect and update:
  - `prisma/schema.prisma`
  - `src/shared/kernel/direction.ts`
  - `src/modules/content/domain/direction-source.ts`
  - `src/modules/learning-content/application/map-learning-content-view-model.ts`
- Deliverable:
  - agreed mapping from persisted Prisma entities to `DirectionSummary`, `DirectionDetail`, and `RecommendationCandidate`
  - explicit choice of which nested data becomes first-class relational tables versus JSON payloads
- Logging requirements:
  - preserve current repository-level `info` and `debug` logs
  - define future logging fields for parity completeness, for example `missingFields`, `fallbackFields`, `source`
- Dependency notes:
  - blocks all migration and repository work

### Phase 2: Expand Prisma Schema And Persistence

#### Task 2.1: Extend the Prisma schema to store the missing catalog and detail context

- Files to change:
  - `prisma/schema.prisma`
  - `prisma/migrations/*` (new migration)
- Deliverable:
  - `Direction` data storage expanded or normalized to cover:
    - qualification
    - department
    - study duration
    - budget seats
    - paid seats
    - tuition per year
    - program description URL
    - curriculum URL
  - relational or JSON storage added for:
    - passing scores
    - subjects
    - structured learning content
- Logging requirements:
  - no application logs here
  - migration naming must clearly state parity purpose
- Dependency notes:
  - depends on Task 1.2
  - blocks seed and repository parity

#### Task 2.2: Seed Prisma with a parity-oriented applicant dataset

- Files to change:
  - `prisma/seed.ts`
  - optional new seed fixtures under `prisma/` if needed
- Deliverable:
  - seed data expanded from 2 thin records to a richer set aligned with current public applicant flows
  - at minimum, seeded records should cover enough variety to exercise compare and recommendation logic
- Logging requirements:
  - keep existing seed failure logging
  - add `console.info` checkpoints for seeded direction counts and seeded nested records only if helpful during migration debugging
- Dependency notes:
  - depends on Task 2.1
  - blocks runtime verification in Prisma mode

#### Task 2.3: Bring integration-test fixtures to the same richer contract

- Files to change:
  - `tests/integration/helpers/prisma.ts`
- Deliverable:
  - integration test seeding mirrors the new schema enough to prove the repositories return non-placeholder applicant data
- Logging requirements:
  - no new logs required
- Dependency notes:
  - depends on Task 2.1
  - blocks repository integration tests

### Phase 3: Lift Repositories To Real Parity

#### Task 3.1: Upgrade Prisma catalog repository to return full context

- Files to change:
  - `src/modules/catalog/infra/prisma-direction-repository.ts`
  - `src/modules/catalog/domain/direction-repository.ts` only if contract changes are unavoidable
- Deliverable:
  - `listDirections()` returns the same practical catalog context shape as mock mode for all mandatory fields
  - remove `null` placeholders where Prisma now has real data
- Logging requirements:
  - `info`: source and requested operation
  - `debug`: count, ids, and any remaining deferred field names
- Dependency notes:
  - depends on Tasks 2.1-2.3

#### Task 3.2: Upgrade Prisma direction-details repository to return rich detail payloads

- Files to change:
  - `src/modules/direction-pages/infra/prisma-direction-details-repository.ts`
  - `src/modules/learning-content/application/map-learning-content-view-model.ts`
- Deliverable:
  - `findDirectionBySlug()` returns:
    - real catalog context
    - real passing scores
    - real subject list
    - real URLs
    - real or near-real structured learning content
  - fallback learning content remains only for explicitly deferred subfields, not as the dominant path
- Logging requirements:
  - `info`: source and slug
  - `debug`: direction id, counts for `subjects`, `passingScores`, `learningContent` sections, and list of truly deferred fields
  - `warn`: only when a direction or nested payload is genuinely missing unexpectedly
- Dependency notes:
  - depends on Tasks 2.1-2.3
  - blocks comparison parity

#### Task 3.3: Upgrade Prisma comparison repository to consume the richer detail model

- Files to change:
  - `src/modules/comparison/infra/prisma-direction-comparison-repository.ts`
- Deliverable:
  - comparison flow returns the same meaningful payload shape needed by `/compare` as mock mode
  - selected directions preserve request order and no longer lose context fields or subject data
- Logging requirements:
  - `info`: source and requested ids
  - `debug`: requested count, resolved count, and summary of populated nested sections
- Dependency notes:
  - depends on Task 3.2

#### Task 3.4: Upgrade Prisma recommendation candidate repository to restore recommendation richness

- Files to change:
  - `src/modules/recommendation/infra/prisma-recommendation-candidate-repository.ts`
  - `src/modules/recommendation/domain/recommendation-candidate.ts` only if unavoidable
- Deliverable:
  - candidate payload includes the minimum rich fields needed for current deterministic recommendation behavior
  - subject blocks and related recommendation signals are available from Prisma mode
- Logging requirements:
  - `info`: source and provider
  - `debug`: candidate count plus whether any scoring inputs still rely on fallback/default values
- Dependency notes:
  - depends on Tasks 2.1-2.3

### Phase 4: Verify Source Seam At The Application Boundary

#### Task 4.1: Add integration coverage for Prisma repository parity

- Files to change:
  - `tests/integration/catalog/prisma-direction-repository.test.ts`
  - `tests/integration/direction-pages/prisma-direction-details-repository.test.ts`
  - new `tests/integration/comparison/prisma-comparison-flow.test.ts`
  - new `tests/integration/recommendation/prisma-profile-test-flow.test.ts`
- Deliverable:
  - tests assert not only that Prisma mode works, but that it returns materially useful applicant-facing data
  - tests should assert counts and presence for:
    - context fields
    - subjects
    - passing scores
    - structured learning content
    - recommendation ranking inputs
- Logging requirements:
  - no new test logs unless needed for diagnostics
- Dependency notes:
  - depends on Phase 3

#### Task 4.2: Add route-level verification for `NPS_PUBLIC_DIRECTION_SOURCE=prisma`

- Files to change:
  - existing or new e2e smoke specs under `tests/e2e/`
  - optional route-level integration tests if e2e setup is too heavy for all scenarios
- Deliverable:
  - smoke coverage proves that:
    - `/directions`
    - `/directions/[slug]`
    - `/compare`
    - `/profile-test`
      work in Prisma mode without collapsing into placeholder data
- Logging requirements:
  - no new runtime logs required
- Dependency notes:
  - depends on Task 4.1

#### Task 4.3: Tighten `docs/current-system-reference.md` and README around Prisma mode

- Files to change:
  - `docs/current-system-reference.md`
  - `README.md`
- Deliverable:
  - docs reflect the new true state of Prisma mode
  - any remaining non-parity areas are explicitly listed as temporary follow-ups instead of hidden debt
- Logging requirements:
  - none
- Dependency notes:
  - depends on verification so documentation matches reality

## Risks And Decision Points

- The biggest design decision is whether structured learning content should be normalized into multiple tables or stored as JSON for release-speed parity.
- If the mock dataset contains fields not worth preserving for release, that must be decided explicitly in Phase 1 rather than silently dropped during migration.
- Recommendation behavior may shift if Prisma candidate data is not aligned carefully with current mock subject blocks and axis signals.
- Large migration scope can destabilize seed and integration tests; schema expansion should be merged before dashboard or promotion backend work begins.

## Commit Plan

1. `feat(prisma): extend direction schema for applicant parity`
   - Schema migration
   - seed updates
   - integration helper updates

2. `feat(prisma): enrich public catalog and detail repositories`
   - catalog repository
   - detail repository
   - learning-content mapping adjustments

3. `feat(prisma): restore comparison and recommendation parity`
   - comparison repository
   - recommendation candidate repository
   - related domain mapping fixes

4. `test(prisma): verify public flows in prisma mode`
   - integration tests
   - e2e or route smoke coverage
   - docs updates that reflect verified behavior

## Exit Criteria

- `NPS_PUBLIC_DIRECTION_SOURCE=prisma` produces a useful applicant experience across catalog, detail, compare, and profile test.
- Prisma repositories stop returning placeholder-heavy payloads for mandatory public fields.
- Integration tests cover Prisma parity, not just basic repository reachability.
- Documentation states clearly what is now real in Prisma mode and what remains intentionally deferred.
