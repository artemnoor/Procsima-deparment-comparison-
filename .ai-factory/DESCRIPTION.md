# Project: NPS Choice Platform

## Overview

`nps-choice-platform` is a single product repository for an applicant-first platform that helps users
compare NPS directions, understand learning outcomes, pass a lightweight profile test, and later
supports an internal admissions contour for analytics and editorial tools.

This `.ai-factory` directory is the project-level source of truth for AI context. It describes this
repository only and does not model the outer workspace as a separate system.

## Product Goal

- help applicants compare study directions with structured, explainable content;
- route uncertain applicants through a deterministic profile test into comparison;
- keep public applicant flows and internal admissions tooling clearly separated;
- preserve a clean seam between the current mock-backed MVP and future Prisma-backed data.

## Tech Stack

- **Framework:** Next.js 15
- **Language:** TypeScript
- **Runtime:** Node.js 20+
- **Package manager:** pnpm
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Validation:** Zod
- **Unit tests:** Vitest
- **E2E tests:** Playwright
- **Linting/Formatting:** ESLint and Prettier

## Delivery Model

- **Branch model:** Gitflow with `main`, `develop`, `feature/*`, `release/*`, and `hotfix/*`
- **Integration policy:** feature work merges into `develop`; release and hotfix flows must be synced
  back into both long-lived branches
- **Planning policy:** product work should use branch-scoped plans in `.ai-factory/plans/<branch>.md`
  rather than a root-level fast plan

## Current Baseline

Implemented and verified baseline:

- foundation app shell with public and internal contours;
- public catalog, direction detail, and comparison flow;
- structured learning-content model used by detail and comparison pages;
- profile-test recommendation flow with explainable scoring and compare handoff;
- Prisma schema, migrations, seed, and mock-to-real repository seam;
- analytics event emission path and internal auth skeleton;
- unit, integration, and e2e coverage plus CI baseline.

## Data and Runtime Notes

- public direction reads are `mock` by default;
- `NPS_PUBLIC_DIRECTION_SOURCE=prisma` switches applicant-facing reads to Prisma-backed repositories;
- `NPS_DISABLE_EVENT_WRITE=true` is used in local/test scenarios when public flows should run without
  writable event persistence;
- structured learning-content contracts should stay stable while the richer academic schema is still
  being introduced.

## Architecture

See `.ai-factory/ARCHITECTURE.md` for the modular-monolith structure, module boundaries, and allowed
dependency directions.
