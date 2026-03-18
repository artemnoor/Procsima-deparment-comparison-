# Plan: Admissions Dashboard Backend

**Branch:** `codex/feature-admissions-dashboard-backend`
**Created:** 2026-03-18 03:35
**Type:** feature

## Settings

- **Testing:** yes
- **Logging:** verbose
- **Docs:** yes

## Roadmap Linkage

- **Milestone:** `Admissions Dashboard`
- **Rationale:** the roadmap still lacks the first internal analytics dashboard, and the current admin API is only a protected placeholder without dashboard data.

## Research Context

- Current public analytics collection is already implemented and Prisma-backed.
- Existing internal dashboard UI is still a placeholder at `app/admin/dashboard/page.tsx`.
- Existing protected admin API at `app/api/admin/dashboard/route.ts` only returns auth metadata and no analytics read model.
- The event model currently includes:
  - `page_opened`
  - `direction_opened`
  - `compare_started`
  - `comparison_run`
  - `recommendation_generated`
- The next delivery step should convert persisted events into an internal read model rather than add more public-route logic.

## Goal

Deliver the first backend slice for the admissions dashboard so the internal contour can read meaningful analytics aggregates from persisted events through a protected admin-facing API.

## Scope

In scope:

- dashboard analytics read model over persisted events
- protected admin application service and route contract
- period-aware summary metrics
- direction-level breakdowns for the main applicant actions
- integration coverage for the new backend slice

Out of scope for this branch:

- major dashboard UI redesign
- editorial promotion controls
- new public analytics event types unless the backend is blocked without them
- role model redesign beyond what the current auth skeleton already supports

## Tasks

### Phase 1: Define the dashboard contract

1. [ ] Define the first admissions dashboard response contract in `src/modules/admin` or a dedicated dashboard module.
       Files:
   - `src/modules/admin/**`
   - `src/shared/kernel/**` if a shared DTO type is justified
     Deliverable:
   - a typed response shape for summary cards, event totals, and direction breakdowns
     Logging:
   - add DEBUG logs for filter parsing and INFO logs for successful dashboard payload generation

2. [ ] Decide and document which metrics are part of v1 dashboard backend.
       Files:
   - `.ai-factory/plans/codex-feature-admissions-dashboard-backend.md`
   - optional code comments near the DTO/service if needed
     Deliverable:
   - explicit v1 metric list:
     - total events in range
     - page opens
     - direction opens
     - compare starts
     - comparison runs
     - recommendation generated count
     - top directions by interaction volume
       Logging:
   - no runtime logging needed beyond service-level metric selection logs

### Phase 2: Build the analytics read model

3. [ ] Implement a Prisma-backed dashboard repository/query layer that aggregates event data.
       Files:
   - `src/modules/admin/infra/**` or `src/modules/analytics/infra/**`
   - `src/app/db.ts` only if wiring requires it
     Deliverable:
   - read-model queries over `Event` with support for grouped counts and top directions
     Logging:
   - DEBUG logs for incoming filters, raw aggregate counts, and direction ranking payloads
     Dependencies:
   - blocked by Task 1

4. [ ] Add application-level orchestration for dashboard filters and defaults.
       Files:
   - `src/modules/admin/application/**` or `src/modules/analytics/application/**`
     Deliverable:
   - service/use case that:
     - applies default date windows
     - validates query params
     - requests aggregates from the repository
     - returns a stable DTO for transport
       Logging:
   - INFO logs for dashboard request handling
   - WARN logs for invalid or clamped filters
     Dependencies:
   - blocked by Task 3

### Phase 3: Expose the protected admin API

5. [ ] Replace the placeholder admin dashboard API response with real analytics data.
       Files:
   - `app/api/admin/dashboard/route.ts`
   - module wiring files under `src/app/**` if needed
     Deliverable:
   - protected GET route returning the dashboard DTO instead of auth-only placeholder JSON
     Logging:
   - keep auth failures explicit
   - add INFO log for successful dashboard API responses and DEBUG log for applied filters
     Dependencies:
   - blocked by Task 4

6. [ ] Update the admin dashboard page just enough to consume and display the new backend contract.
       Files:
   - `app/admin/dashboard/page.tsx`
     Deliverable:
   - replace the pure placeholder body with a simple server-rendered summary view backed by the protected API/service contract
     Logging:
   - no extra client logging unless needed; prefer server-side logs in the underlying service
     Dependencies:
   - blocked by Task 5

### Phase 4: Verify and document

7. [ ] Add integration coverage for dashboard backend aggregation and auth-protected access.
       Files:
   - `tests/integration/**`
   - `tests/e2e/**` only if a small admin smoke assertion is warranted
     Deliverable:
   - tests for:
     - aggregate counts from seeded events
     - direction ranking
     - protected route behavior for admin auth
       Logging:
   - test fixtures should create explicit event scenarios with readable event payloads
     Dependencies:
   - blocked by Task 5

8. [ ] Update docs for the new admin analytics backend behavior.
       Files:
   - `README.md`
   - `docs/current-system-reference.md`
     Deliverable:
   - docs reflecting that the dashboard is no longer only a placeholder and describing what the first backend slice exposes
     Logging:
   - none
     Dependencies:
   - blocked by Task 6

## Commit Plan

1. `feat(admin): add dashboard analytics contract and read model`
   Covers Tasks 1-4

2. `feat(admin): expose protected dashboard analytics`
   Covers Tasks 5-6

3. `test(admin): verify dashboard analytics backend`
   Covers Task 7

4. `docs(admin): document dashboard analytics backend`
   Covers Task 8

## Risks & Notes

- The current event schema stores payload as JSON, so some desired breakdowns may require careful filtering or lightweight normalization in code.
- Direction rankings depend on `directionId` coverage in events; some event types may not contribute evenly.
- If the current event model is too thin for one dashboard card, prefer documenting the limitation over inventing synthetic data.
- Keep recommendation analytics and future editorial promotion clearly separated in both DTO naming and query logic.

## Next Step

Start implementation from this branch with the backend contract and repository layer first. Do not begin with dashboard UI polish.
