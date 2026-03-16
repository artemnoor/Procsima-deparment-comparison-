# Implementation Plan: Profile Test And Recommendations

Branch: feature/profile-test
Created: 2026-03-16

## Settings

- Testing: yes
- Logging: verbose
- Docs: yes

## Roadmap Linkage

Milestone: "Prof-Test And Recommendations"
Rationale: This branch adds the guided applicant flow for answering a lightweight profile test, receiving explainable recommendations, and moving directly into comparison.

## Research Context

Source:

- `.ai-factory/ROADMAP.md`
- `.ai-factory/FEATURE-DEVELOPMENT-PRINCIPLE.md`
- `docs/product-concept.md`
- current `nps-choice-platform` applicant flow on `main`

Goal:

- Deliver the first usable prof-test flow that helps uncertain applicants answer a short questionnaire, understand why certain directions fit them, and continue into the existing compare flow.

Constraints:

- The current public applicant flow already supports catalog, direction detail, and comparison on mock-backed direction data.
- Recommendation logic must stay explainable and must not mix with editorial promotion.
- Business logic must be developed with TDD.
- The critical applicant journey must have smoke or e2e coverage.
- The roadmap currently recommends `Learning Content` as the next milestone, but this branch intentionally advances `Prof-Test And Recommendations` earlier by explicit user request.

Decisions for this branch:

- Implement the prof-test as a dedicated public route under the applicant contour.
- Use a lightweight question model with multiple answer types so the flow can grow later without rewriting route ownership.
- Score recommendations against the same direction read model already used by comparison, so the recommendation flow reuses existing module boundaries.
- Return 2-3 recommended directions with human-readable explanation and a one-click transition into `/compare`.
- Keep recommendation inputs and outputs module-owned and deterministic.
- Emit recommendation-related analytics events only for this applicant flow.

Deferred until later milestones:

- adaptive or personalized long-form questionnaires
- promotion-aware ranking
- richer learning-content copy inside recommendation results
- persistent user sessions or saved test history
- dashboard reporting for recommendation analytics

## Outcome Definition

This feature is complete only when all of the following are true:

- A public `/profile-test` flow exists and renders a real questionnaire instead of placeholder text.
- The questionnaire supports at least more than one answer type.
- Submitted answers are validated and transformed into a recommendation profile through module-owned business logic.
- The user receives 2-3 recommended directions with an explanation of the match.
- The user can move from recommendations directly into the existing compare flow.
- Empty, incomplete, and invalid questionnaire states are handled intentionally.
- Recommendation event emission is wired for the generated result path.
- Unit, integration, and smoke or e2e coverage exist for the critical flow.

## Scope Boundaries

Included:

- applicant-facing profile test page
- question definitions and answer parsing
- explainable recommendation scoring
- recommendation results UI
- CTA from results into comparison
- recommendation-related analytics events
- unit, integration, and smoke coverage

Excluded:

- editorial promotion
- admin/dashboard changes
- learning-content milestone work beyond what current direction detail already exposes
- account-based persistence of questionnaire results
- advanced adaptive testing

## Commit Plan

- **Commit 1** (after tasks 1-4): `feat(recommendation): add profile-test domain and scoring`
- **Commit 2** (after tasks 5-8): `feat(recommendation): implement applicant profile-test flow`
- **Commit 3** (after tasks 9-12): `test(recommendation): cover profile-test journey and docs`

## Tasks

### Phase 1: Branch contracts and TDD-ready recommendation domain

- [x] Task 1: Define recommendation module contracts for question definitions, parsed answers, recommendation profile, and recommendation result.
      Files:
  - `src/modules/recommendation/domain/*`
  - `src/modules/recommendation/index.ts`
    Logging requirements:
  - Log validation failures for malformed answers.
  - Log which question types are active in the MVP flow.
    Deliverables:
  - explicit domain types for questions, answers, and results
  - deterministic recommendation output contract

- [x] Task 2: Add first failing unit tests for answer parsing, scoring, and recommendation ordering before implementation.
      Files:
  - `tests/unit/recommendation/*`
    Logging requirements:
  - Log edge cases that are intentionally rejected or deferred.
    Deliverables:
  - failing tests for business logic
    Depends on:
  - Task 1

- [x] Task 3: Introduce a recommendation repository boundary that reads candidate directions through existing public data seams.
      Files:
  - `src/modules/recommendation/domain/*`
  - `src/modules/recommendation/infra/*`
  - `src/app/public-direction-data.ts`
    Logging requirements:
  - Log which source provider is active for recommendation candidates.
  - Log candidate counts resolved for ranking.
    Deliverables:
  - repository seam for mock-backed recommendation candidates
    Depends on:
  - Task 1

- [x] Task 4: Implement explainable recommendation scoring that converts profile-test answers into ranked directions and result explanations.
      Files:
  - `src/modules/recommendation/application/*`
  - `src/modules/recommendation/domain/*`
    Logging requirements:
  - Log scoring inputs, top matches, and explanation anchors without logging sensitive data.
    Deliverables:
  - recommendation generation flow
  - stable explanation strategy for each recommended direction
    Depends on:
  - Task 2
  - Task 3

### Phase 2: Applicant flow and UI

- [x] Task 5: Implement the public `/profile-test` page with a real questionnaire and intentional empty/incomplete/invalid states.
      Files:
  - `app/(public)/profile-test/page.tsx`
  - `src/shared/ui/*` or `src/modules/recommendation/*`
  - `app/globals.css`
    Logging requirements:
  - Log page load, questionnaire state, and invalid submission reasons.
    Deliverables:
  - applicant-facing questionnaire UI
  - at least two answer types in the rendered flow
    Depends on:
  - Task 1
  - Task 4

- [x] Task 6: Render recommendation results with explicit explanation, recommendation confidence signal, and route actions.
      Files:
  - `app/(public)/profile-test/page.tsx`
  - `src/modules/recommendation/application/*`
  - supporting UI files
    Logging requirements:
  - Log generated recommendation ids and rendered result state.
    Deliverables:
  - recommendation result cards
  - explanation blocks
  - recommendation-to-compare CTA
    Depends on:
  - Task 4
  - Task 5

- [x] Task 7: Wire recommendation results into the existing comparison flow using the current compare selection conventions.
      Files:
  - `src/modules/comparison/application/comparison-selection.ts`
  - `src/modules/recommendation/application/*`
  - `app/(public)/profile-test/page.tsx`
    Logging requirements:
  - Log the compare handoff ids and source marker.
    Deliverables:
  - compare link using `source=recommendation-flow`
    Depends on:
  - Task 6

- [x] Task 8: Emit recommendation analytics events for successful result generation and compare handoff intent.
      Files:
  - `src/shared/kernel/events.ts`
  - `app/(public)/profile-test/page.tsx`
  - `src/modules/events/*`
    Logging requirements:
  - Log recommendation event creation intent and publish result.
    Deliverables:
  - recommendation-generated event path
    Depends on:
  - Task 6
  - Task 7

### Phase 3: Verification, tests, and docs

- [x] Task 9: Add or update unit tests for parsing, scoring, ranking, and explanation generation.
      Files:
  - `tests/unit/recommendation/*`
    Deliverables:
  - passing unit coverage for core business logic
    Depends on:
  - Task 4

- [x] Task 10: Add integration tests for repository-backed recommendation candidate resolution and application flow.
      Files:
  - `tests/integration/recommendation/*`
    Deliverables:
  - passing integration coverage for recommendation flow
    Depends on:
  - Task 4

- [x] Task 11: Extend smoke or e2e coverage for `profile-test -> recommendations -> compare`.
      Files:
  - `tests/e2e/*`
    Deliverables:
  - smoke/e2e scenario covering the critical path
    Depends on:
  - Task 7

- [x] Task 12: Update docs to reflect the prof-test flow, recommendation logic constraints, and current scope.
      Files:
  - `README.md`
  - `docs/product-concept.md`
    Deliverables:
  - feature documentation aligned with implementation
    Depends on:
  - Task 9
  - Task 10
  - Task 11

## Exit Criteria for Merge

- `/profile-test` is implemented and usable
- recommendation logic is deterministic and explainable
- recommendation output routes into comparison through existing public flow conventions
- invalid and incomplete states are covered intentionally
- unit, integration, and smoke/e2e checks for this feature are green
- docs reflect current scope and explicitly avoid promotion-driven logic
