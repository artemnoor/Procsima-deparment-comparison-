# Prisma Parity Contract

## Purpose

This document defines what `NPS_PUBLIC_DIRECTION_SOURCE=prisma` must provide so the current public
applicant flows remain useful without depending on the richer mock dataset.

It is the implementation contract for:

- catalog
- direction detail
- compare
- profile-test recommendation candidates

## Current problem

The public route layer already has a clean source seam in [public-direction-data.ts](/D:/nps/Procsima-deparment-comparison-/src/app/public-direction-data.ts), but the two sources do not return equivalent data.

Today:

- `mock` returns a rich applicant-facing model
- `prisma` returns a thin operational baseline

That means the public product only really works at full value in `mock` mode.

## Target parity by flow

### Catalog

The catalog contract is `DirectionSummary` from [direction.ts](/D:/nps/Procsima-deparment-comparison-/src/shared/kernel/direction.ts).

Mandatory fields for Prisma parity:

- `id`
- `slug`
- `title`
- `shortDescription`
- `programFocus`
- `learningDifficulty`
- `context.code`
- `context.qualification`
- `context.department`
- `context.studyDuration`
- `context.budgetSeats`
- `context.paidSeats`
- `context.tuitionPerYearRub`

If these fields are missing, the catalog visually degrades and becomes weaker than the intended applicant experience.

### Direction detail

The detail contract is `DirectionDetail` from [direction.ts](/D:/nps/Procsima-deparment-comparison-/src/shared/kernel/direction.ts).

Mandatory fields for Prisma parity:

- all `DirectionSummary` fields
- `whatYouLearn`
- `learningContent.summary`
- `learningContent.outcomes`
- `learningContent.technologies`
- `learningContent.practicalSkills`
- `learningContent.studyFocuses`
- `careerPaths`
- `targetFit`
- `keyDifferences`
- `axisScores`
- `passingScores`
- `subjects`
- `programDescriptionUrl`
- `curriculumUrl`

Temporary fallback is acceptable only if a small explicit subset is still deferred. It is not acceptable for the entire `learningContent` payload to be fallback-only by default.

### Compare

The compare flow consumes `DirectionDetail[]` through the comparison repository.

Mandatory parity requirements:

- direction order from the requested ids must be preserved
- each compared direction must carry the same usable context as detail mode
- `subjects` must be present so compare cards stop collapsing into thin summaries
- learning-content data must be populated enough for `LearningContentBlock`
- axis scores must remain source-consistent

### Recommendation candidates

The recommendation contract is `RecommendationCandidate`.

Mandatory fields for Prisma parity:

- `id`
- `slug`
- `title`
- `shortDescription`
- `programFocus`
- `learningDifficulty`
- `axisScores`
- `subjectBlocks`
- `targetFit`
- `keyDifferences`
- `whatYouLearn`

`subjectBlocks` are especially important because the current recommendation scoring uses them directly in [generate-profile-test-recommendations.ts](/D:/nps/Procsima-deparment-comparison-/src/modules/recommendation/application/generate-profile-test-recommendations.ts).

## Schema recommendation

## Design goals

- preserve the current modular-monolith boundaries
- avoid source-specific logic in routes and components
- optimize for release-speed parity, not perfect final normalization
- keep later normalization possible

## Recommended first-pass Prisma shape

### Extend `Direction`

Keep `Direction` as the aggregate root and add applicant-facing scalar fields directly:

- `code String?`
- `qualification String?`
- `department String?`
- `studyDuration String?`
- `budgetSeats Int?`
- `paidSeats Int?`
- `tuitionPerYearRub Int?`
- `programDescriptionUrl String?`
- `curriculumUrl String?`
- `learningContent Json?`

Keep the existing fields:

- `title`
- `shortDescription`
- `programFocus`
- `whatYouLearn`
- `careerPaths`
- `targetFit`
- `keyDifferences`
- axis score fields
- `learningDifficulty`

### Add `DirectionPassingScore`

Recommended relational model:

```prisma
model DirectionPassingScore {
  id          String    @id @default(cuid())
  directionId String
  year        Int
  budget      Decimal?
  paid        Decimal?
  direction   Direction @relation(fields: [directionId], references: [id], onDelete: Cascade)

  @@index([directionId])
  @@unique([directionId, year])
}
```

Why relational:

- the data is naturally repeatable per year
- it is small and queryable
- uniqueness by `direction + year` is meaningful

### Add `DirectionSubject`

Recommended relational model:

```prisma
model DirectionSubject {
  id           String    @id @default(cuid())
  directionId   String
  title         String
  subjectBlock  String?
  department    String?
  hours         Int
  referenceUrl  String?
  sortOrder     Int?
  direction     Direction @relation(fields: [directionId], references: [id], onDelete: Cascade)

  @@index([directionId])
}
```

Why relational:

- subjects are repeatable rows
- recommendation can derive `subjectBlocks` from them
- compare/detail pages can render them directly

### Keep structured learning content as JSON for the first parity iteration

Recommended JSON payload shape:

```ts
type PersistedLearningContent = {
  summary: string | null;
  outcomes: Array<{ title: string; description: string }>;
  technologies: Array<{
    name: string;
    category: "language" | "framework" | "tool" | "platform" | "method";
    context: string | null;
  }>;
  practicalSkills: Array<{
    name: string;
    level: "foundation" | "intermediate" | "advanced";
    context: string | null;
  }>;
  studyFocuses: Array<{
    title: string;
    summary: string;
    subjectBlocks: string[];
    technologies: string[];
    practicalSkills: string[];
  }>;
  deferredFields?: Array<{ field: string; reason: string }>;
};
```

Why JSON first:

- matches the current domain contract closely
- avoids introducing 4-6 extra tables immediately
- is enough for release-speed parity
- can later be normalized if analytics or editorial tooling needs fine-grained querying

### Do not store `subjectBlocks` separately yet

Recommendation:

- derive `subjectBlocks` from `DirectionSubject.subjectBlock`
- only add a dedicated field if recommendation or analytics later proves this is too expensive or too lossy

## Mapping rules

### Catalog mapping

`PrismaDirectionCatalogRepository` should map directly from `Direction` scalar columns into `DirectionSummary.context`.

No `null` placeholders should remain for fields that now exist in schema.

### Detail mapping

`PrismaDirectionDetailsRepository` should:

- read the `Direction`
- read related `DirectionPassingScore[]`
- read related `DirectionSubject[]`
- decode `learningContent` JSON
- construct `DirectionDetail`

Fallback learning content should only be used when:

- `learningContent` is truly absent for a specific row
- the row is partially migrated

### Comparison mapping

`PrismaDirectionComparisonRepository` should reuse the same detail-mapping rules, not maintain a second thinner mapping shape.

### Recommendation mapping

`PrismaRecommendationCandidateRepository` should:

- derive `subjectBlocks` from related subjects
- keep axis scores from `Direction`
- keep `programFocus`, `targetFit`, `keyDifferences`, `whatYouLearn`

## Seed requirements

For parity work, `prisma/seed.ts` should stop seeding only thin English demo directions.

Minimum seed requirements:

- enough records to support compare between multiple directions
- enough subject diversity to exercise recommendation subject-block bonuses
- at least one record with richer learning content in Prisma
- data close enough to the current mock applicant narrative that parity testing is meaningful

The shortest safe path is:

- either port the current 4 mock directions into Prisma seed
- or build an equivalent richer seed with the same data shape and variety

## Test requirements

Prisma parity is not complete until tests move from “repository returns something” to “repository returns useful applicant data”.

Mandatory integration expectations:

- catalog Prisma tests assert populated context fields
- detail Prisma tests assert populated subjects, passing scores, and real learning content
- comparison Prisma tests assert multiple directions with usable compare payloads
- recommendation Prisma tests assert populated `subjectBlocks` and stable ranking inputs

Mandatory runtime verification:

- smoke checks for `/directions`
- smoke checks for `/directions/[slug]`
- smoke checks for `/compare`
- smoke checks for `/profile-test`

all with `NPS_PUBLIC_DIRECTION_SOURCE=prisma`

## Suggested Phase 2 file targets

Primary files to change next:

- [schema.prisma](/D:/nps/Procsima-deparment-comparison-/prisma/schema.prisma)
- [seed.ts](/D:/nps/Procsima-deparment-comparison-/prisma/seed.ts)
- [prisma.ts](/D:/nps/Procsima-deparment-comparison-/tests/integration/helpers/prisma.ts)
- [prisma-direction-repository.ts](/D:/nps/Procsima-deparment-comparison-/src/modules/catalog/infra/prisma-direction-repository.ts)
- [prisma-direction-details-repository.ts](/D:/nps/Procsima-deparment-comparison-/src/modules/direction-pages/infra/prisma-direction-details-repository.ts)
- [prisma-direction-comparison-repository.ts](/D:/nps/Procsima-deparment-comparison-/src/modules/comparison/infra/prisma-direction-comparison-repository.ts)
- [prisma-recommendation-candidate-repository.ts](/D:/nps/Procsima-deparment-comparison-/src/modules/recommendation/infra/prisma-recommendation-candidate-repository.ts)

## Decision summary

If we optimize for the shortest correct path, the next implementation step should be:

1. extend `Direction` with missing scalar context fields
2. add relational tables for passing scores and subjects
3. add `learningContent Json?` on `Direction`
4. seed richer applicant-facing data
5. upgrade Prisma repositories to stop returning placeholder-heavy payloads

This is the best balance between delivery speed, maintainability, and keeping the source seam stable.
