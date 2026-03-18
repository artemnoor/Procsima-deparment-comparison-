# Project Rules

> Short, actionable rules and conventions for this repository. Loaded automatically by AI Factory.

## Rules

- Gitflow is mandatory for this project.
- `main` accepts only stable releases and hotfix merges.
- `develop` is the integration branch for feature work and release preparation.
- New product work starts from `develop` in a dedicated `feature/*` branch.
- One branch must correspond to one logical feature flow.
- `release/*` branches are created from `develop` and may contain only stabilization, verification,
  documentation, versioning, and release-prep changes.
- `hotfix/*` branches are created from `main` and must be merged back into both `main` and `develop`.
- For product work, prefer branch-scoped plans in `.ai-factory/plans/<branch-name>.md`; do not use
  `.ai-factory/PLAN.md` as the normal workflow.
- After a feature is merged, move its plan out of `.ai-factory/plans/` into
  `docs/process/archive/ai-plans/`.
- TDD is mandatory for business logic.
- Every bugfix must start with a reproducible failing test.
- Merges into `develop` are allowed only when `pnpm check` is green.
- Releases into `main` are allowed only when CI is green and `pnpm check:develop` is green.
- Critical user flows must keep smoke or e2e coverage.
- If scope changes during implementation, update the branch plan before continuing code changes.

## AI Factory Command Usage

- If the next milestone or scope is unclear, start with `/aif-explore <topic>` and update
  `.ai-factory/RESEARCH.md` when the result should persist.
- For new feature work, first create `feature/*` from `develop`, then run
  `/aif-plan full --parallel <feature description>`.
- Before writing code on a planned feature, run `/aif-improve` to refine the active branch-scoped plan.
- Execute planned feature work through `/aif-implement`; do not skip straight from idea to manual coding
  without an agreed branch plan.
- Before merge into `develop`, run `/aif-verify`, then `/aif-review`, then `/aif-commit`.
- Use `/aif-fix` for defects and regressions; begin from a failing test, let the fix produce a patch, and
  keep the fix scope narrower than normal feature work.
- Use `/aif-verify --strict` during release stabilization and before merges that affect release readiness.
- Use `/aif-docs` when implementation changes public behavior, operator workflow, project setup, or
  user-visible constraints.
- Run `/aif-evolve` periodically after enough fix patches accumulate, not as a substitute for planning,
  verification, or review.
