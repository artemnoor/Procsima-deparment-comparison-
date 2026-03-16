# Branch diagnostics (`work`)

Date: 2026-03-16

## What is happening in this branch

`work` contains three commits on top of the foundation baseline:

1. `e3cae68` — foundation baseline for NPS choice platform.
2. `bb0b420` — implementation of applicant comparison flow.
3. `001c26d` — formatting pass for comparison-related code.

Functional focus in this branch is an applicant-facing flow:

- directions catalog (`/directions`)
- direction details (`/directions/[slug]`)
- direction comparison (`/compare`)
- event emission around those actions

## Problems and risks found

### 1) Local quality gate currently fails at `typecheck`

Running `corepack pnpm check` failed during `tsc --noEmit` with multiple errors like:

- `Module '"@prisma/client"' has no exported member 'PrismaClient'`
- cascading type errors in Prisma-backed repositories

This blocks a fully green local gate in the current environment.

### 2) Prisma client generation is blocked by binary download errors

`corepack pnpm db:generate` failed with HTTP `403 Forbidden` from `binaries.prisma.sh` while downloading query engine artifacts.

Likely effect:

- Prisma Client is not generated
- TypeScript cannot resolve Prisma exports
- `check`/`typecheck` cannot pass locally unless engine download works (or environment mirrors/caches binaries)

### 3) Documentation mismatch in branch naming

`README.md` documents `main`/`develop` branch model, but current active branch is `work`.

This may cause confusion around merge targets and branch policy expectations.

### 4) Broken path style in README source reference

README references `public-direction-data.ts` via an absolute Windows path in Markdown link:

- `/C:/Users/artem/admission/nps-choice-platform/src/app/public-direction-data.ts`

This path is non-portable and broken for repository viewers on other systems.

## Suggested next steps

1. Fix Prisma engine accessibility for the execution environment (proxy/mirror/allowlist) and regenerate client.
2. Re-run `corepack pnpm check` after successful `db:generate`.
3. Align branch strategy docs with actual branch usage (`work` vs `develop` flow).
4. Replace the Windows absolute README link with a repository-relative path.
