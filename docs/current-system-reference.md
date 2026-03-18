# Current System Reference

## Purpose of this document

This file describes the current implemented state of the application in the same order in which a user
would usually move through the visible tabs and pages.

It answers four practical questions:

1. What does the user see on each page?
2. Where does the page get its data from?
3. What comes from the database and what comes from the mock dataset?
4. What is already real, and what is still scaffold or placeholder?

## Global shell

The project contains one Next.js application with two contours:

- public contour for applicants;
- internal contour for admissions staff.

Global shell files:

- `app/layout.tsx`
- `app/(public)/layout.tsx`
- `app/admin/layout.tsx`
- `src/shared/ui/shell.tsx`

### Public navigation

The public shell currently exposes these entries:

- `Home`
- `Directions`
- `Profile test`
- `Compare`
- `Admin contour`
- `Health`
- `Readiness`

### Internal navigation

The internal shell currently exposes these entries:

- `Admin home`
- `Dashboard`
- `Public catalog`
- `Health`

## Home

### Route

- `/`

### Main file

- `app/(public)/page.tsx`

### What the user sees

This is still a foundation landing page, not a final public homepage.

The page shows:

- a card with heading `Foundation home`
- text explaining that this is the public shell
- three status cards:
  - `Public contour`
  - `Internal contour`
  - `Foundation status`

### Data source

- no database reads
- no mock dataset reads
- no runtime event write

### Current state

- static scaffold
- useful as a foundation marker, not as a finished product screen

## Directions

### Route

- `/directions`

### Main files

- `app/(public)/directions/page.tsx`
- `src/shared/ui/direction-card.tsx`
- `src/shared/ui/compare-selection-panel.tsx`
- `src/app/public-direction-data.ts`
- `src/modules/catalog/*`

### What the user sees

This is the main applicant catalog page.

The page shows:

- heading `Directions catalog`
- short description of the applicant flow
- optional compare-selection panel if any directions are already selected
- grid of direction cards

Each direction card currently shows:

- code badge if available
- department badge if available
- title
- short description
- qualification
- duration
- seats
- difficulty
- actions:
  - `Open direction page`
  - `Add to compare` or `Remove from compare`

If the user has already selected directions, the compare-selection panel shows:

- count of selected directions
- selected titles as chips
- `Clear selection`
- `Open comparison` when at least 2 directions are selected

### Query params

- `ids` stores selected direction ids
- `source` stores where comparison was entered from

### Events

When the page is opened it emits:

- `page_opened` with route `/directions`

### Data source

The page uses `createDirectionCatalogRepository()` from `src/app/public-direction-data.ts`.

Default source:

- `mock`

Optional source:

- `prisma` if `NPS_PUBLIC_DIRECTION_SOURCE=prisma`

### What comes from mock mode

Mock mode currently provides richer context:

- code
- qualification
- department
- study duration
- budget seats
- paid seats
- tuition
- richer applicant-facing context for cards

### What comes from Prisma mode

Prisma mode currently provides a thinner catalog model from the `Direction` table:

- id
- slug
- title
- short description
- program focus
- learning difficulty

Many card context fields become `null` in Prisma mode:

- code
- qualification
- department
- study duration
- budget seats
- paid seats
- tuition

### Current state

- implemented
- real public flow
- best experience currently comes from mock mode

## Direction Detail

### Route

- `/directions/[slug]`

### Main files

- `app/(public)/directions/[slug]/page.tsx`
- `src/modules/direction-pages/application/get-direction-details.ts`
- `src/shared/ui/learning-content-block.tsx`
- `src/shared/ui/compare-selection-panel.tsx`

### What the user sees when the direction exists

The page renders:

- hero block with code or program label
- title
- short description
- action area:
  - `Add to compare` or `Remove from compare`
  - `Back to catalog`

Then it renders these sections:

1. `Program snapshot`
   Shows:
   - qualification
   - department
   - duration
   - difficulty
   - budget / paid seats
   - tuition per year

2. `What you will learn`
   Through `LearningContentBlock`, shows:
   - summary
   - learning outcomes
   - technology highlights
   - practical skills
   - study focus

3. `Target fit`

4. `Key differences`

5. `Career paths`

6. `Subject highlights`
   Shows:
   - subject block
   - department
   - subject title
   - academic hours

7. `Passing score trend`
   Shows:
   - year
   - budget passing score
   - paid passing score

8. Optional links
   - `Program description`
   - `Curriculum`

If compare selection is already present in query params, the compare-selection panel is rendered above
the hero block.

### What the user sees when the direction does not exist

- `Direction not found`
- explanation that the direction is unavailable in the active source
- `Back to catalog`

### Events

When the page is opened for an existing direction, it emits:

- `direction_opened`

### Data source

The page uses:

- `createDirectionDetailsRepository()`
- `createDirectionComparisonRepository()` to resolve titles for the compare-selection panel

### What comes from mock mode

Mock mode returns the richest detail payload:

- structured learning content
- subject list
- passing score history
- tuition and seats
- qualification and department
- program description URL
- curriculum URL
- axis scores
- career paths
- target fit
- key differences

### What comes from Prisma mode

Prisma mode works, but is intentionally partial:

- `whatYouLearn`, career paths, target fit, key differences, and axis scores come from `Direction`
- learning content is fallback-based
- `subjects` are empty
- `passingScores` are empty
- URLs are `null`
- qualification, department, duration, seats, and tuition are `null`

### Current state

- implemented
- works best in mock mode

## Profile test

### Route

- `/profile-test`

### Main files

- `app/(public)/profile-test/page.tsx`
- `src/modules/recommendation/domain/profile-test.ts`
- `src/modules/recommendation/application/parse-profile-test-submission.ts`
- `src/modules/recommendation/application/build-recommendation-profile.ts`
- `src/modules/recommendation/application/generate-profile-test-recommendations.ts`

### What the user sees before submission

The page starts with:

- hero block describing the current questionnaire state
- explanation that the result is deterministic and explainable
- actions:
  - `Browse directions first`
  - `Reset questionnaire`

Then it renders the questionnaire itself.

Current questions:

1. `What kind of result sounds most exciting to you?`
2. `Which activities sound the most interesting?`
3. `What kind of study outcome do you want first?`

The second question is multi-select and asks for one or two answers.

At the bottom there is an action bar with:

- `Show recommendations`
- `Open compare without the test`

### What the user sees in incomplete or invalid states

If the submission is incomplete or invalid, the page shows:

- adjusted hero text
- `Submission feedback`
- a list of issues grouped by question id

### What the user sees after successful submission

When submission is `complete`, the page renders:

1. `Recommendation summary`
   - summary sentence
   - dominant-axis chips

2. Recommendation cards
   Each card shows:
   - title
   - confidence
   - score
   - explanation bullets
   - `Open direction page`
   - `Compare recommended set`

3. `Next step`
   - explanation of compare handoff
   - `Compare all recommended directions`

### Events

The page emits:

- `page_opened`
- `recommendation_generated` when the submission is complete

### Recommendation logic

The current recommendation flow is:

- deterministic
- explainable
- based on axis boosts, preferred program focuses, preferred subject blocks, and explanation anchors
- explicitly not influenced by editorial promotion

### Data source

Uses `createRecommendationCandidateRepository()`.

Default source:

- `mock`

Optional source:

- `prisma`

### What comes from mock mode

Mock mode provides the richest candidate set because each direction profile already includes:

- program focus
- subject blocks
- richer axis profile
- richer learning context

### What comes from Prisma mode

Prisma mode works, but uses thinner candidates derived from the `Direction` table only.

### Current state

- implemented
- smoke-tested
- one of the completed product flows

## Compare

### Route

- `/compare`

### Main files

- `app/(public)/compare/page.tsx`
- `src/modules/comparison/application/get-comparison-page-data.ts`
- `src/modules/comparison/application/compare-directions.ts`

### Supported states

- `empty`
- `under-minimum`
- `over-limit`
- `missing-directions`
- `ready`

### What the user sees in non-ready states

The page shows an explanatory card and a link back to `/directions`.

Examples:

- `Pick directions before opening comparison`
- `Comparison needs at least two directions`
- `Comparison is limited to four directions`
- `Some selected directions were not found`

### What the user sees in ready state

The page renders:

1. Hero section
   - heading `Compare selected directions`
   - lead text about side-by-side comparison
   - `Add more directions`

2. Cards for each selected direction
   Each card shows:
   - code badge if available
   - department badge if available
   - title
   - short description
   - qualification
   - duration
   - tuition
   - difficulty
   - first three subjects
   - compact learning-content block

3. `Shared criteria`
   - chips for current comparison dimensions

4. `Learning content comparison`
   - technologies
   - practical skills

5. `How the selected directions differ`
   - axis matrix for programming, math, engineering, analytics, and ai

### Events

The page emits:

- `page_opened`
- `compare_started` in ready state
- `comparison_run` in ready state

### Data source

Uses `createDirectionComparisonRepository()`.

### What comes from mock mode

Mock mode supports the richest comparison:

- subjects
- structured learning content
- richer comparison context
- axis-based difference view

### What comes from Prisma mode

Prisma mode supports basic comparison, but still lacks rich curriculum parity.

### Current state

- implemented
- one of the main completed public flows

## Admin contour

### Route

- `/admin`

### Main file

- `app/admin/page.tsx`

### What the user sees

The page shows:

- heading `Admin contour`
- text explaining that this shell is reserved for protected admissions tooling

### Data source

- no database reads
- no analytics reads

### Current state

- static shell page

## Dashboard

### Route

- `/admin/dashboard`

### Main file

- `app/admin/dashboard/page.tsx`

### What the user sees when access is allowed

It renders:

- heading `Admissions dashboard`
- explanation that the internal dashboard contour is protected by the foundation auth skeleton and already uses the first analytics backend slice
- current dev user id
- current role
- active date window
- summary metric cards:
  - total tracked events
  - page opens
  - direction opens
  - compare starts
  - comparison runs
  - recommendations generated
- top directions by interaction volume
- link to `/api/admin/dashboard`

### What happens when access is denied

The user is redirected to `/admin/forbidden`.

### Access denied page

Route:

- `/admin/forbidden`

Main file:

- `app/admin/forbidden/page.tsx`

What the user sees:

- `Access denied`
- explanation that current auth context does not satisfy the role requirement
- hint about `ADMIN_DEV_ROLE=admissions_admin`
- link to `/api/admin/dev-auth`

### Data source

Current dashboard page uses:

- local dev auth context
- role enforcement
- Prisma-backed analytics aggregation over persisted `Event` rows
- simple server-rendered summary cards and direction rankings

It still does not use:

- charts
- advanced admissions operational widgets
- promotion controls

### Current state

- protected
- first real backend slice implemented

## Health

### Routes

- `/api/health`
- `/api/ready`

### `/api/health`

Returns:

- `status: ok`
- `service: nps-choice-platform`
- `scope: liveness`

No database connectivity check is performed here.

### `/api/ready`

Returns readiness state and performs a Prisma connectivity check.

Current response includes:

- overall status
- service name
- `env` check
- `db` check
- `contours: ["public", "internal"]`

If the database is unavailable, the route returns HTTP `503`.

## API: Directions

### Route

- `/api/directions`

### What it returns

JSON payload:

- `items`
- `total`

### Data source

Uses the same repository factory as the public `Directions` page.

### Events

Emits:

- `page_opened` with route `/directions` and source `api`

## API: Admin auth and dashboard

### `/api/admin/dev-auth`

Purpose:

- inspect current local dev-auth resolution

Returns:

- whether dev auth is enabled
- current resolved auth context
- usage notes for:
  - `x-dev-user-id`
  - `x-dev-role`

### `/api/admin/dashboard`

Purpose now:

- return the first protected admissions dashboard analytics payload

Returns on success:

- `status: ok`
- `scope: internal`
- `userId`
- `role`
- `dashboard`
  - `filters`
  - `summary`
  - `topDirections`

Returns on failure:

- `status: forbidden`
- `scope: internal`
- `reason`

Current backend output includes:

- active date range and rolling-window metadata
- total event counts by event type
- top directions ranked by interaction volume
- direction-level breakdown for:
  - direction opens
  - compare starts
  - comparison runs
  - recommendation generated

## What is in the database

### Prisma models

The database currently has three Prisma models:

- `Direction`
- `User`
- `Event`

### Direction table

Current real database fields:

- id
- slug
- title
- shortDescription
- programFocus
- whatYouLearn
- careerPaths
- targetFit
- keyDifferences
- programmingScore
- mathScore
- engineeringScore
- analyticsScore
- aiScore
- learningDifficulty
- timestamps

This is enough for:

- basic catalog
- basic detail
- basic comparison
- recommendation scoring

This is not enough yet for full parity with the mock academic dataset.

Missing in Prisma today:

- qualification
- department
- study duration
- budget seats
- paid seats
- tuition
- passing score history
- subject list
- structured learning-content object
- program description URL
- curriculum URL

### User table

Current fields:

- id
- email
- name
- role
- timestamps

Current practical use:

- local admin identity
- internal route protection
- relation target for events

### Event table

Current fields:

- id
- type
- userId
- directionId
- payload
- createdAt

Current event types:

- `page_opened`
- `direction_opened`
- `compare_started`
- `comparison_run`
- `recommendation_generated`

This means analytics collection exists at the event-write level, but analytics consumption is still not
built into the dashboard.

## What is in the seeded database

### Prisma seed

File:

- `prisma/seed.ts`

Current seeded directions:

- `software-engineering`
- `data-analytics`

Current seeded user:

- `dev-admin-user`
- role `admissions_admin`

### Practical meaning

The real DB is currently seeded enough for:

- Prisma repository tests
- auth tests
- readiness checks
- basic local development

But it is not yet seeded with the full rich public dataset used in mock mode.

## What is in the mock dataset

### Source

- `src/modules/content/infra/mock-direction-source.ts`

### Number of mock directions

- 4

### Current mock directions

- `09.02.01` - `Компьютерные системы и комплексы`
- `09.02.07` - `Информационные системы и программирование`
- `09.02.06` - `Сетевое и системное администрирование`
- `10.02.05` - `Обеспечение информационной безопасности автоматизированных систем`

### What the mock dataset contains

The mock dataset is much richer than Prisma right now. It includes:

- code
- title
- qualification
- department
- study duration
- budget seats
- paid seats
- tuition
- passing score history
- subject list with academic hours
- program description URL
- curriculum URL
- structured learning-content
- richer direction profile and axis metadata

### Id and slug generation

Current format:

- id: `direction-<code-with-dashes>`
- slug: `program-<code-with-dashes>`

Examples:

- `09.02.07` -> `direction-09-02-07`
- `09.02.07` -> `program-09-02-07`

## How data source switching works

### Public source switch

File:

- `src/app/public-direction-data.ts`

Env var:

- `NPS_PUBLIC_DIRECTION_SOURCE`

Behavior:

- default is `mock`
- if set to `prisma`, public repositories switch to Prisma

This affects:

- catalog
- details
- compare
- recommendation candidates

### Event write switch

File:

- `src/app/event-publisher.ts`

Env var:

- `NPS_DISABLE_EVENT_WRITE`

Behavior:

- `false` or unset:
  - use `PrismaEventPublisher`
  - write events to DB
- `true`:
  - use `NoopEventPublisher`
  - skip event writes

This is useful for local dev and e2e runs when flows should render without depending on a writable
analytics event path.

## What is implemented and what is not

### Implemented

- public shell
- directions catalog
- direction detail page
- compare flow
- profile-test flow
- recommendation generation
- event write model
- health and readiness APIs
- local admin auth skeleton

### Partially implemented

- Prisma-backed public mode
- admin contour
- dashboard route

### Still placeholder or unfinished

- real admissions analytics dashboard
- editorial promotion controls
- production-ready auth
- full Prisma parity with public mock dataset
- final polished homepage

## Test coverage by area

### Home and shell

Covered by:

- foundation smoke test

### Directions and compare

Covered by:

- unit tests for catalog and comparison logic
- integration tests for mock and Prisma repositories
- e2e comparison smoke tests

### Profile test

Covered by:

- unit tests for recommendation logic
- integration test for mock recommendation flow
- e2e profile-test smoke test

### Admin and auth

Covered by:

- unit tests for auth enforcement
- integration test for Prisma user repository
- e2e foundation smoke for dashboard access

### Events and analytics collection

Covered by:

- unit tests for domain-event creation
- integration test for Prisma event publisher

## Bottom line

If someone opens the application today and clicks through the visible tabs, the real state is:

- `Home` is still a foundation scaffold;
- `Directions`, `Direction detail`, `Profile test`, and `Compare` are the real implemented product flow;
- `Admin contour` exists structurally;
- `Dashboard` is still a protected placeholder;
- the richest public data currently comes from the mock academic dataset;
- the real database already supports the thinner operational baseline and event collection, but not full
  parity with the public mock experience yet.
