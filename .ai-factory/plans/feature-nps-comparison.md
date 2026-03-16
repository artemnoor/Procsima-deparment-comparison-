# Implementation Plan: Catalog And NPS Comparison

Branch: feature/nps-comparison
Created: 2026-03-16

## Settings
- Testing: yes
- Logging: verbose
- Docs: yes

## Roadmap Linkage
Milestone: "Catalog And NPS Comparison"
Rationale: This branch delivers the first real applicant-facing flow after foundation: catalog, direction detail, and comparison for 2-4 NPS directions.

## Research Context
Source:
- `.ai-factory/ROADMAP.md`
- current `nps-choice-platform` foundation baseline
- `.ai-factory/hosts.txt`
- user clarification from 2026-03-16

Goal:
- Deliver the first usable applicant flow for browsing directions, opening a direction page, selecting directions for comparison, and viewing a structured comparison.

Constraints:
- The project already has foundation-level modules for `catalog`, `direction-pages`, and `comparison`, but public routes are still placeholders.
- The current Prisma schema and seed are temporary and minimal.
- `hosts.txt` now provides a concrete example of the future richer data shape: program code, qualification, department, duration, seat counts, passing scores by year, tuition cost, program links, and subject/hour breakdown.
- The real data source and final DB integration will still happen later.
- This feature must first work on mock data shaped like `hosts.txt`, then allow later replacement with real persistence/integration without rebuilding the public flow.
- MVP scope for this branch is 2-4 directions and a clear applicant-facing comparison flow, not a complete academic data system.
- Critical applicant flow must have smoke or e2e coverage.

Decisions for this branch:
- Treat `hosts.txt` as the canonical example input for the richer future data shape.
- Build a mock-data adapter layer that maps `hosts.txt`-shaped records into comparison-ready domain and presentation contracts.
- Use mock data first in this branch, while keeping current Prisma-backed paths available only as legacy foundation context or fallback during transition.
- Introduce comparison-ready presentation structures that can later be filled either from mocks or from real DB-backed repositories.
- Keep domain and UI contracts extensible so future fields such as subjects, departments, and hours can be added without rewriting route ownership or module boundaries.
- Separate "source model" from "UI/domain read model" so real DB integration later becomes an adapter replacement task rather than a UI rewrite.
- Emit comparison-related analytics events from real public interactions where appropriate, but do not expand the analytics milestone scope beyond what this flow needs.

Deferred until later DB specification:
- real DB ingestion and synchronization
- production persistence schema for the richer academic model
- final curriculum normalization rules
- full subject taxonomy and block taxonomy normalization
- final storage model for departments / chairs / subject hours
- any production-grade CMS or editorial workflow for direction content

## Outcome Definition

This feature is complete only when all of the following are true:
- The public directions route shows a real catalog sourced from the current data layer.
- The current data layer for this branch may be mock-backed, but it must follow the richer `hosts.txt` example shape instead of the old minimal seed shape alone.
- A direction detail page exists and shows structured applicant-facing information for a single direction.
- A user can choose 2-4 directions for comparison through the public flow.
- The comparison page renders a real comparison view using shared criteria instead of placeholder text.
- Empty, invalid, and error states are intentionally handled for catalog, detail, and comparison flows.
- At least one end-to-end or smoke scenario covers the main applicant path.
- Unit and integration coverage exists for the feature-specific domain/application logic.
- The implementation leaves room for later real DB enrichment by replacing mock adapters instead of rewriting UI and domain contracts.

## Scope Boundaries

Included:
- applicant-facing directions catalog
- direction detail page
- compare selection flow
- compare page with shared criteria
- empty state, invalid state, and basic error state handling
- limited mock data enrichment for 2-4 directions based on `hosts.txt`
- adapter layer from `hosts.txt`-shaped mock data into public read models
- test coverage for critical flow

Excluded:
- recommendation flow
- final real-data integration into production DB
- final curriculum database model
- internal dashboard changes outside what existing analytics/event hooks already support
- editorial promotion logic

## Assumptions To Preserve

- The future DB shape will be richer than the current schema.
- `hosts.txt` is an example of that richer shape, not the final persistence contract.
- Future curriculum-related data should extend the current module contracts, not invalidate them.
- UI pages should depend on stable read models, not directly on the raw future DB structure.
- Comparison criteria should be modeled as presentation/domain contracts that can later be populated from richer source data.
- Applicant-facing copy and labels may still evolve after the fuller domain data arrives.

## Commit Plan
- **Commit 1** (after tasks 1-3): `feat: add mock source contracts and normalization`
- **Commit 2** (after tasks 4-7): `feat: switch applicant flow to mock-backed repositories`
- **Commit 3** (after tasks 8-11): `feat: implement catalog detail and comparison applicant flow`
- **Commit 4** (after tasks 12-16): `test: cover applicant comparison flow and finalize docs`

## Tasks

### Phase 1: Mock-source contract and comparison-ready read model alignment

- [x] Task 1: Define source contracts for `hosts.txt`-shaped mock data and comparison-ready read models for catalog/detail/comparison.
  Files:
  - `src/shared/kernel/direction.ts`
  - `src/shared/kernel/*` or `src/modules/content/domain/*` for raw source contracts if needed
  - `src/modules/catalog/domain/*`
  - `src/modules/direction-pages/domain/*`
  - `src/modules/comparison/domain/*`
  Logging requirements:
  - Log when mock-source fields are mapped into read models.
  - Log contract validation failures for catalog/detail/comparison inputs.
  - Log any fallback behavior where some richer fields from `hosts.txt` are intentionally not yet surfaced in UI.
  Deliverables:
  - raw source contract for `hosts.txt`-shaped records
  - stable direction summary/detail/comparison-facing types
  - explicit separation between source model, read model, and future persistence model
  Notes:
  - Do not introduce the final persistence schema yet.
  - It is acceptable to model subjects/departments/hours in read-only mock form if needed for display or comparison.

- [x] Task 2: Add a raw mock dataset derived from `hosts.txt` and normalize it into an internal source model.
  Files:
  - new mock data files under `src/modules/content/`, `src/modules/catalog/infra/`, or `src/modules/direction-pages/infra/`
  - optional fixture or JSON/TS source file derived from `.ai-factory/hosts.txt`
  - parser/normalizer files under `src/modules/content/*` or `src/shared/kernel/*`
  - `tests/unit/fixtures/directions.ts`
  - keep `prisma/seed.ts` unchanged unless a minimal bridge is truly needed
  Logging requirements:
  - Log raw mock dataset load and normalized record count.
  - Log validation or normalization failures for malformed source records.
  - Log which `hosts.txt` fields are currently normalized and which are intentionally deferred.
  Deliverables:
  - 2-4 mock directions with enough contrast for catalog/detail/comparison
  - subject/hour/department-rich raw source aligned with the example structure
  - normalized internal source model
  - fixture data aligned with normalization behavior
  Depends on:
  - Task 1

- [x] Task 3: Confirm and document which normalized fields from the `hosts.txt` example are visible in MVP catalog/detail/comparison and which are deferred.
  Files:
  - `src/modules/comparison/domain/comparison.ts`
  - `docs/product-concept.md`
  - `README.md`
  Logging requirements:
  - Log which comparison criteria are active in MVP.
  - Log which `hosts.txt` fields are deferred from the first UI iteration.
  Deliverables:
  - explicit MVP comparison dimensions
  - docs note that mock data comes first and real DB integration comes later
  Depends on:
  - Task 1
  - Task 2

- [x] Task 4: Introduce a mock-backed repository/provider boundary for applicant-facing catalog, detail, and comparison flows.
  Files:
  - `src/modules/catalog/index.ts`
  - `src/modules/direction-pages/index.ts`
  - `src/modules/comparison/index.ts`
  - `src/app/*`
  - `src/modules/catalog/infra/*`
  - `src/modules/direction-pages/infra/*`
  Logging requirements:
  - Log which source provider is active for applicant-facing reads.
  - Log when the public flow resolves data from mock-backed repositories instead of Prisma-backed repositories.
  - Log provider fallback behavior only if explicitly supported.
  Deliverables:
  - explicit provider/repository seam for mock-backed reads
  - applicant-facing flow no longer depends on direct Prisma usage as its only read path
  - clear replacement point for future real DB integration
  Depends on:
  - Task 2
  - Task 3

### Phase 2: Catalog and direction detail flow

- [x] Task 5: Replace the placeholder public directions route with a real catalog page backed by the catalog module and mock-backed provider boundary.
  Files:
  - `app/(public)/directions/page.tsx`
  - `src/modules/catalog/index.ts`
  - `src/modules/catalog/application/list-directions.ts`
  - `src/modules/catalog/infra/prisma-direction-repository.ts`
  - mock-backed repository/provider files introduced in Task 4
  - supporting UI files under `src/shared/ui/` or module-local UI if needed
  Logging requirements:
  - Log catalog page load and repository/adapter fetch results.
  - Log empty catalog condition explicitly.
  - Log recoverable rendering or data-shaping errors for the catalog route.
  Deliverables:
  - real applicant-facing catalog page
  - direction cards for 2-4 directions
  - empty-state rendering for no directions
  Depends on:
  - Task 4

- [x] Task 6: Add a real public direction detail route and page backed by the direction-pages module and mock-backed provider boundary.
  Files:
  - `app/(public)/directions/[slug]/page.tsx`
  - `src/modules/direction-pages/index.ts`
  - `src/modules/direction-pages/application/get-direction-details.ts`
  - `src/modules/direction-pages/infra/prisma-direction-details-repository.ts`
  - mock-backed repository/provider files introduced in Task 4
  Logging requirements:
  - Log requested slug, found/not-found result, and shaped response.
  - Log not-found cases at INFO or WARN with the slug.
  - Log route-level errors without exposing sensitive internals.
  Deliverables:
  - dynamic direction detail page
  - applicant-facing blocks with structured program information
  - page blocks that can already show richer mock-backed data such as department, qualification, key subjects, hours summary, cost, and passing score trends where appropriate
  - compare CTA or deep-link entry point from the detail page into comparison flow
  - clear not-found state
  Depends on:
  - Task 4

- [x] Task 7: Add reusable applicant-facing UI building blocks for direction cards, detail sections, and comparison entry points.
  Files:
  - `src/shared/ui/*`
  - or feature-specific UI under `src/modules/catalog/*` and `src/modules/direction-pages/*`
  - `app/globals.css`
  Logging requirements:
  - Log only significant UI state transitions that affect user flow, not every render.
  - Log selection CTA interactions that enter comparison flow.
  Deliverables:
  - card/list/detail UI primitives with consistent public contour styling
  - visible compare entry points from catalog and/or detail page
  Depends on:
  - Task 5
  - Task 6

### Phase 3: Comparison selection and compare page

- [x] Task 8: Design the comparison selection mechanism and state ownership for the public contour.
  Files:
  - `app/(public)/compare/page.tsx`
  - `app/(public)/directions/page.tsx`
  - `app/(public)/directions/[slug]/page.tsx`
  - optional route/search-param helpers under `src/app/` or module-local files
  Logging requirements:
  - Log add/remove selection actions and current selection size.
  - Log invalid selection attempts such as duplicates or over-limit additions.
  - Log compare-flow entry method (from catalog or detail route) if available.
  Deliverables:
  - chosen mechanism for persisting compare selection in MVP
  - explicit 2-4 direction limit behavior
  Notes:
  - Prefer a simple URL/search-param or similarly transparent MVP mechanism over hidden state.

- [x] Task 9: Implement comparison application flow that resolves selected directions and produces a comparison result for the page.
  Files:
  - `src/modules/comparison/application/compare-directions.ts`
  - `src/modules/comparison/index.ts`
  - any new repository/query adapter needed for selected direction lookup
  - `app/api/*` only if a dedicated transport adapter is required
  Logging requirements:
  - Log selected direction IDs, fetched direction count, and validation result.
  - Log invalid compare requests such as too few, too many, or unknown IDs.
  - Log final comparison criteria and result shape.
  Deliverables:
  - comparison application flow using real selected directions from the active mock-backed read source
  - validation for 2-4 selections
  - comparison result ready for UI rendering
  Depends on:
  - Task 1
  - Task 4
  - Task 8

- [x] Task 10: Replace the placeholder compare page with a real comparison experience and purposeful empty/error states.
  Files:
  - `app/(public)/compare/page.tsx`
  - `src/modules/comparison/domain/comparison.ts`
  - supporting UI files
  Logging requirements:
  - Log compare page load, selection parsing result, and rendered state category.
  - Log empty state, invalid selection state, and recoverable page errors distinctly.
  Deliverables:
  - real compare page
  - empty state for no selection
  - invalid state for under/over selection or missing data
  - structured differences view for selected directions
  Depends on:
  - Task 9

- [x] Task 11: Wire analytics event emission into real catalog/detail/compare interactions needed by this flow.
  Files:
  - `src/modules/events/*`
  - public routes in `app/(public)/directions/*`
  - `app/(public)/compare/page.tsx`
  - relevant module application code
  Logging requirements:
  - Log event creation intent, event type, and publish result.
  - Log malformed event payloads or publish failures.
  Deliverables:
  - event emission for key applicant actions such as opening a direction and starting comparison
  Notes:
  - Keep scope to events that directly support this feature flow.
  Depends on:
  - Task 5
  - Task 6
  - Task 10

### Phase 4: Testing, docs, and readiness

- [x] Task 12: Add or update unit tests for mock normalization, catalog/detail/comparison logic, and temporary data contract behavior.
  Files:
  - `tests/unit/content/*`
  - `tests/unit/catalog/*`
  - `tests/unit/comparison/*`
  - `tests/unit/direction-pages/*`
  - `tests/unit/fixtures/*`
  Logging requirements:
  - Log test-focused validation failures in a readable way.
  - Log uncovered edge cases in the plan if any must be deferred.
  Deliverables:
  - unit coverage for raw `hosts.txt`-shaped source normalization and mapping
  - unit coverage for comparison validation and result shaping
  - tests guarding temporary contract extensibility assumptions
  Depends on:
  - Task 2
  - Task 9
  - Task 10

- [x] Task 13: Add or update integration tests for mock-backed data retrieval and compare-flow data resolution.
  Files:
  - `tests/integration/catalog/*`
  - `tests/integration/direction-pages/*`
  - `tests/integration/comparison/*`
  - `tests/integration/helpers/*`
  Logging requirements:
  - Log setup assumptions for the active mock-backed provider path and boundary failures.
  Deliverables:
  - passing integration coverage for catalog and direction detail retrieval through the active mock-backed source path
  - passing integration coverage for comparison input resolution if implemented at repository/application boundary
  Depends on:
  - Task 5
  - Task 6
  - Task 9

- [x] Task 14: Extend e2e or smoke coverage to the main applicant journey for catalog -> direction -> compare using mock-backed data.
  Files:
  - `tests/e2e/*`
  - `playwright.config.ts` only if adjustments are needed
  Logging requirements:
  - Log scenario transitions, failed selectors, and browser/runtime errors.
  - Capture failure artifacts using the existing Playwright setup.
  Deliverables:
  - smoke/e2e scenario covering the critical applicant-facing path
  Depends on:
  - Task 5
  - Task 6
  - Task 10

- [x] Task 15: Update docs and finalize readiness for merge into `develop`.
  Files:
  - `README.md`
  - `docs/product-concept.md`
  - optional `.ai-factory/DEVELOPMENT-PLAYBOOK.md` at workspace root only if workflow wording must be aligned
  Logging requirements:
  - Log which commands, routes, and scope notes changed in docs.
  - Log that richer real DB integration is deferred and mock-backed data is intentional for this branch.
  Deliverables:
  - updated feature documentation
  - explicit note about current mock-backed content flow versus future real-data integration
  - merge-ready checklist closure
  Depends on:
  - Task 12
  - Task 13
  - Task 14

- [x] Task 16: Define the follow-up integration seam for replacing mock source data with real DB-backed repositories later.
  Files:
  - `src/modules/catalog/infra/*`
  - `src/modules/direction-pages/infra/*`
  - `src/modules/comparison/*`
  - `README.md`
  Logging requirements:
  - Log which adapter or repository boundary will be swapped when real data arrives.
  - Log any temporary assumptions that must be revisited during real integration.
  Deliverables:
  - explicit mock-to-real replacement seam
  - implementation notes for the later real-data milestone or follow-up task
  Depends on:
  - Task 4
  - Task 5
  - Task 6
  - Task 9
  - Task 15

## Execution Order Summary

Follow this order:
1. Stabilize temporary comparison-ready contracts.
2. Add raw mock dataset and normalize it into an internal source model.
3. Lock MVP comparison criteria.
4. Introduce the mock-backed provider and repository seam for applicant-facing reads.
5. Implement real catalog page.
6. Implement real direction detail page.
7. Add reusable public UI blocks and compare entry points.
8. Decide selection state ownership.
9. Implement comparison resolution flow.
10. Implement real compare page and states.
11. Wire key events.
12. Add unit and integration coverage.
13. Add e2e or smoke coverage.
14. Update docs and prepare merge.
15. Lock the mock-to-real integration seam for the later DB task.

## Exit Criteria for Merge Into `develop`

You may merge this branch into `develop` only when all checks below are true:
- catalog, direction detail, and compare pages are no longer placeholders
- comparison works for 2-4 mock directions shaped from the `hosts.txt` example
- empty, invalid, and not-found states are intentional and tested
- event emission is wired for key interactions in this flow
- unit, integration, and e2e/smoke checks covering this feature are green
- docs reflect the current scope and explicitly note that real DB integration is deferred
- the implementation extends current module boundaries cleanly without hard-coding the future full academic persistence schema
- the adapter boundary for replacing mocks with real data is explicit

## Suggested Next Commands

After reviewing this plan, use:

```text
/aif-improve
/aif-implement
```
