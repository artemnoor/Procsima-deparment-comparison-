# Plan: Learning Content

Branch: `feature/learning-content`  
Created: `2026-03-16`

## Settings

- Testing: `yes`
- Logging: `verbose`
- Docs: `yes`
- Assumptions: preferences were not provided interactively, so the plan defaults to tests enabled, verbose logs, mandatory docs checkpoint, and roadmap linkage enabled.

## Roadmap Linkage

- Milestone: `Learning Content`
- Rationale: this branch implements the next unchecked milestone by turning the current minimal `whatYouLearn` prose into a structured learning-content model that can power both direction pages and comparison.

## Research Context

- Topic: `nps-choice-platform MVP discovery`
- Goal: define a realistic applicant-first MVP with structured comparable direction content.
- Relevant decisions:
  - MVP must include structured "what you will learn" content.
  - Required comparison fields already include what the student learns.
  - Recommendation quality later depends on clean structured direction content.
  - Promotion and admin concerns remain deferred and must stay separated from public decision logic.

## Implementation Notes

- Base code is taken from the latest local integrated applicant flow (`feature/nps-comparison`) because local `main` is still at the foundation commit.
- Keep public contour behavior in public pages only; put learning-content shaping in module code.
- Preserve the mock-to-real seam by extending source contracts and adapters, not by hardcoding new view models in pages.

## Tasks

### Phase 1: Define learning-content contracts

- [x] **Task 1: Lock module ownership and public API boundaries for learning-content.**  
       Deliverable: decide and document whether applicant-facing learning-content shaping lives in `src/modules/learning-content` while `src/modules/content` stays responsible for source normalization, or explicitly justify keeping all logic in `content`; update exports so downstream code uses a clear public API and does not bypass module boundaries.  
       Files: `src/modules/learning-content/index.ts`, `src/modules/content/index.ts`, optionally new files under `src/modules/learning-content/`.  
       Logging: no new runtime logs required in the boundary module itself; if adapters are introduced, keep `debug` logs around shaping decisions and `warn` logs for invalid ownership assumptions during development.

- [x] **Task 2: Expand the canonical direction content contract for structured learning-content fields.**  
       Deliverable: extend the shared/domain contracts so the system can express learning outcomes, technology highlights, practical skills, subject groups, and deferred learning-content fields without hiding them in free text.  
       Files: `src/shared/kernel/direction.ts`, `src/modules/content/domain/direction-content.ts`, `src/modules/content/domain/direction-source.ts`, `src/modules/content/index.ts`.  
       Logging: add or preserve `debug` logs for normalized/surfaced learning-content fields and `error` logs for invalid source records; log which fields are treated as MVP-visible vs deferred.

- [x] **Task 3: Extend the mock direction source with structured learning-content data and explicit deferred markers.**  
       Deliverable: enrich mock source records or attached profiles so each direction exposes concrete technologies, tools, practical skills, outcome statements, and grouped study focus blocks suitable for applicant-facing rendering.  
       Files: `src/modules/content/infra/mock-direction-source.ts`, optionally `tests/unit/content/direction-source.test.ts`.  
       Logging: keep `info` logs for dataset loading, add `debug` logs for learning-content enrichment counts per direction, and keep `error` logs when a record is missing required learning-content fields.

### Phase 2: Shape read models for detail and comparison flows

- [x] **Task 4: Map structured learning-content into direction detail and comparison-ready read models.**  
       Deliverable: update mappers and application flows so detail pages and comparison use the same normalized learning-content dimensions instead of duplicating page-level shaping; route this shaping through the chosen module boundary from Task 1 so `content` remains source-facing and applicant-facing orchestration uses a clear public API.  
       Files: `src/modules/content/application/map-direction-source-to-read-model.ts`, `src/modules/learning-content/`, `src/modules/direction-pages/application/get-direction-details.ts`, `src/modules/comparison/application/get-comparison-page-data.ts`, `src/modules/comparison/domain/comparison.ts`, `src/modules/comparison/index.ts`.  
       Logging: add `debug` logs when learning-content fields are included in detail/comparison payloads and `warn` logs if a direction is missing an MVP-visible field but still rendered.

- [x] **Task 5: Keep repository adapters aligned with the expanded contracts.**  
       Deliverable: ensure mock and Prisma-backed repositories continue to return the enriched models without leaking persistence details into pages; keep ordering and selection semantics intact, and define safe fallback behavior for Prisma-backed reads until real structured learning-content columns/data exist. This branch should not introduce a persistence migration unless the existing schema is already prepared for it.  
       Files: `src/modules/direction-pages/infra/mock-direction-details-repository.ts`, `src/modules/direction-pages/infra/prisma-direction-details-repository.ts`, `src/modules/comparison/infra/mock-direction-comparison-repository.ts`, `src/modules/comparison/infra/prisma-direction-comparison-repository.ts`, `src/app/public-direction-data.ts`.  
       Logging: retain existing `info` request-resolution logs, add `debug` logs identifying whether enriched learning-content came from mock or Prisma-backed adapters, and add `warn` logs when Prisma falls back to partial/default learning-content because structured data is not persisted yet.

### Phase 3: Update applicant-facing UI

- [x] **Task 6: Add reusable UI blocks for learning outcomes, technology highlights, and study-focus groups.**  
       Deliverable: extract presentational components or shared rendering helpers so detail and comparison pages can render structured learning-content consistently without embedding formatting logic in the route files.  
       Files: `src/shared/ui/`, likely new files plus updates to `src/shared/ui/direction-card.tsx` or adjacent reusable components.  
       Logging: UI components should stay log-free; any diagnostics belong in upstream application/page code only.

- [x] **Task 7: Enrich the direction detail page with structured learning-content sections.**  
       Deliverable: replace the current minimal prose block with sections for learning outcomes, technologies/tools, practical skills, subject/study focus groups, and clear fallback states for incomplete data.  
       Files: `app/(public)/directions/[slug]/page.tsx`, possibly `app/globals.css`, and any new shared UI files from Task 5.  
       Logging: keep existing `info` page-render logs, add `debug` logs summarizing which learning-content sections were rendered for the requested direction, and `warn` logs if fallback/deferred placeholders are shown.

- [x] **Task 8: Surface the same learning-content dimensions in the comparison flow.**  
       Deliverable: extend comparison UI so applicants can compare structured learning-content dimensions side by side, while keeping the page readable and within the existing 2-4 selection constraints.  
       Files: `app/(public)/compare/page.tsx`, `src/modules/comparison/application/get-comparison-page-data.ts`, shared UI added in Task 5, optionally `app/globals.css`.  
       Logging: keep existing `info` render logs, add `debug` logs for compared learning-content dimensions, and `warn` logs if a requested dimension is missing for any selected direction.

### Phase 4: Verify behavior and update docs

- [x] **Task 9: Add and update automated coverage for the enriched learning-content flow.**  
       Deliverable: cover contract validation, mapping, repository shaping, and applicant-facing flow changes with unit/integration tests; extend smoke/e2e only if the rendered flow meaningfully changes. Include fixture updates and explicit fallback coverage for partial Prisma-backed data and missing MVP-visible learning-content fields.  
       Files: `tests/unit/content/*.test.ts`, `tests/unit/comparison/*.test.ts`, `tests/integration/direction-pages/*.test.ts`, `tests/integration/comparison/*.test.ts`, `tests/unit/fixtures/directions.ts`, `tests/e2e/nps-comparison-smoke.spec.ts` or a new focused smoke test.  
       Logging: tests should assert behavior, not logs, but fixtures should include representative structured learning-content values, deferred fields, and missing-field fallback cases.

- [x] **Task 10: Document the learning-content model, MVP-visible fields, and current mock-vs-real boundary.**  
       Deliverable: update product/docs so future feature work and real-data integration know which fields are applicant-facing now, which are deferred, and where the adapter seam lives.  
       Files: `README.md`, `docs/product-concept.md`, optionally `.ai-factory/plans/feature-learning-content.md` if implementation changes scope.  
       Logging: no runtime logging changes; document expected logging behavior for source normalization and page rendering where useful.

## Dependencies

- Task 2 depends on Task 1.
- Task 3 depends on Task 2.
- Task 4 depends on Tasks 1-3.
- Task 5 depends on Task 4.
- Task 6 depends on Task 4.
- Task 7 depends on Tasks 4 and 6.
- Task 8 depends on Tasks 4 and 6.
- Task 9 depends on Tasks 4-8.
- Task 10 depends on the final implemented model from Tasks 1-9.

## Commit Plan

1. `feat(content): define structured learning content contracts`
   Scope: Tasks 1-3
2. `feat(learning-content): shape detail and comparison read models`
   Scope: Tasks 4-5
3. `feat(ui): surface structured learning content in applicant flows`
   Scope: Tasks 6-8
4. `test(directions): cover learning content mappings and flows`
   Scope: Task 9
5. `docs(content): document learning content scope`
   Scope: Task 10

## Completion Criteria

- Direction detail pages show structured learning-content sections rather than only a single prose paragraph.
- Comparison uses the same canonical learning-content dimensions as detail pages.
- Mock data and repository adapters preserve the mock-to-real seam.
- Tests cover normalization, mapping, repository shaping, and the changed applicant flow.
- Docs clearly separate MVP-visible fields from deferred learning-content fields.
