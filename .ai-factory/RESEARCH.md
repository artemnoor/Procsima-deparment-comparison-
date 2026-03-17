# Research

Updated: 2026-03-18 12:10
Status: active

## Active Summary (input for $aif-plan)

<!-- aif:active-summary:start -->

Topic: Prisma parity for public applicant flows
Goal: Define the exact contract and persistence shape needed so `NPS_PUBLIC_DIRECTION_SOURCE=prisma` can support catalog, detail, compare, and profile-test flows without major feature loss relative to the current mock source.
Constraints:

- The runtime source seam in `src/app/public-direction-data.ts` must remain stable.
- Public routes and components should not need source-specific branching.
- Recommendation logic must stay deterministic and explainable; editorial promotion must remain separate.
- The current Prisma schema is thinner than the mock source and cannot yet satisfy the full applicant-facing contract.
  Decisions:
- Mandatory Prisma parity fields for public flows are:
  - catalog context: code, qualification, department, study duration, seat counts, tuition
  - detail context: passing scores, subjects, URLs, structured learning content
  - recommendation inputs: program focus, axis scores, target fit, key differences, subject blocks
- Recommended persistence strategy for release-speed parity:
  - keep `Direction` as the aggregate root
  - add scalar applicant-facing columns directly to `Direction`
  - store `passingScores` and `subjects` as relational child tables
  - store structured learning content as a JSON payload on `Direction` for the first parity iteration
- `subjectBlocks` should be derived from persisted subjects rather than stored separately unless that becomes a performance problem.
- Prisma fallback learning content should become an exception path, not the default path.
  Open questions:
- Whether `learningContent` should stay JSON through `0.1.0` or be normalized before release.
- Whether passing scores should continue to allow decimals (`4.74`) rather than integer-like entrance scores.
- Whether Prisma seeds should fully mirror the 4-record mock dataset or expand directly to a larger real dataset.
  Success signals:
- `NPS_PUBLIC_DIRECTION_SOURCE=prisma` renders useful catalog/detail/compare/profile-test pages with materially real data.
- Prisma repository integration tests assert rich payloads rather than placeholder-heavy ones.
- The schema proposal is concrete enough to start Phase 2 migrations without another discovery pass.
Next step: Implement schema expansion and richer Prisma repository mappings following `codex/feature-prisma-parity`.
<!-- aif:active-summary:end -->

## Sessions

<!-- aif:sessions:start -->

### 2026-03-18 12:10 — Prisma parity contract for public flows

What changed:

- Audited the current gap between mock-backed and Prisma-backed public repositories.
- Defined which fields are mandatory for parity in catalog, detail, compare, and recommendation.
- Chose a first-pass persistence strategy that favors delivery speed: scalar fields on `Direction`, child tables for subjects and passing scores, and JSON for structured learning content.
  Key notes:
- `mock` currently remains the richest applicant source because it contains full context, subjects, passing scores, and structured learning content.
- `prisma` currently supports only a thin subset of the public contract and relies on fallback learning content.
- Recommendation quality in Prisma mode is currently weaker because subject-block signals are missing.
- The best short path to parity is not route rewrites, but schema and repository enrichment.
  Links (paths):
- `prisma/schema.prisma`
- `prisma/seed.ts`
- `src/app/public-direction-data.ts`
- `src/modules/catalog/infra/prisma-direction-repository.ts`
- `src/modules/direction-pages/infra/prisma-direction-details-repository.ts`
- `src/modules/comparison/infra/prisma-direction-comparison-repository.ts`
- `src/modules/recommendation/infra/prisma-recommendation-candidate-repository.ts`
- `docs/prisma-parity-contract.md`

### 2026-03-14 15:30 — nps-choice-platform MVP discovery

What changed:

- Reviewed the existing product concept and narrowed the first release to a realistic applicant-facing MVP.
- Defined the minimum required fields for NPS comparison and clarified the role of the prof-test as a routing mechanism into comparison.
- Scoped MVP analytics, separated recommendation from promotion, and reduced the role of student life in v1.
  Key notes:
- The concept currently combines two products: a guidance product for applicants and an analytics/control product for admissions staff.
- A true MVP should not include the full internal dashboard, advanced personalization, or hidden promotion inside recommendations.
- Recommendation in v1 should be transparent and rule-based, not presented as a high-confidence algorithmic truth.
- The product's real foundation is structured comparable content about NPS directions; recommendation quality depends on that data model.
- Suggested MVP modules:
  - NPS catalog
  - NPS detail page
  - Comparison module
  - Lightweight guided flow / prof-test
  - Basic analytics events
- Deferred until after MVP:
  - Full prof-test sophistication
  - Internal admissions dashboard
  - Promotion mechanics
  - Rich student life content
  - Advanced personalization and analytics
    Links (paths):
- `nps-choice-platform/README.md`
- `nps-choice-platform/docs/product-concept.md`
- `.ai-factory/DESCRIPTION.md`
<!-- aif:sessions:end -->
