import { prisma } from "@/app/db";
import {
  MockDirectionCatalogRepository,
  PrismaDirectionCatalogRepository,
  type DirectionCatalogRepository,
} from "@/modules/catalog";
import {
  MockDirectionComparisonRepository,
  PrismaDirectionComparisonRepository,
  type DirectionComparisonRepository,
} from "@/modules/comparison";
import {
  MockRecommendationCandidateRepository,
  PrismaRecommendationCandidateRepository,
  type RecommendationCandidateRepository,
} from "@/modules/recommendation";
import {
  MockDirectionDetailsRepository,
  PrismaDirectionDetailsRepository,
  type DirectionDetailsRepository,
} from "@/modules/direction-pages";
import { logWithLevel } from "@/shared/utils/logging";

export type PublicDirectionDataSource = "mock" | "prisma";

export function getPublicDirectionDataSource(): PublicDirectionDataSource {
  const requestedSource = process.env.NPS_PUBLIC_DIRECTION_SOURCE;

  if (requestedSource === "prisma") {
    return "prisma";
  }

  return "mock";
}

export function createDirectionCatalogRepository(): DirectionCatalogRepository {
  const source = getPublicDirectionDataSource();

  logWithLevel(
    "public-direction-data",
    "info",
    "Creating direction catalog repository for public contour.",
    {
      source,
    },
  );

  if (source === "prisma") {
    return new PrismaDirectionCatalogRepository(prisma);
  }

  // This factory is the intentional swap point for the later
  // richer academic data integration.
  return new MockDirectionCatalogRepository();
}

export function createDirectionDetailsRepository(): DirectionDetailsRepository {
  const source = getPublicDirectionDataSource();

  logWithLevel(
    "public-direction-data",
    "info",
    "Creating direction details repository for public contour.",
    {
      source,
    },
  );

  if (source === "prisma") {
    return new PrismaDirectionDetailsRepository(prisma);
  }

  // Keep detail-page source selection centralized here so the public UI
  // does not need to change when real data replaces the mock source.
  return new MockDirectionDetailsRepository();
}

export function createDirectionComparisonRepository(): DirectionComparisonRepository {
  const source = getPublicDirectionDataSource();

  logWithLevel(
    "public-direction-data",
    "info",
    "Creating direction comparison repository for public contour.",
    {
      source,
    },
  );

  if (source === "prisma") {
    return new PrismaDirectionComparisonRepository(prisma);
  }

  // Comparison flow should switch sources at the repository boundary,
  // not inside route or component code.
  return new MockDirectionComparisonRepository();
}

export function createRecommendationCandidateRepository(): RecommendationCandidateRepository {
  const source = getPublicDirectionDataSource();

  logWithLevel(
    "public-direction-data",
    "info",
    "Creating recommendation candidate repository for public contour.",
    {
      source,
    },
  );

  if (source === "prisma") {
    return new PrismaRecommendationCandidateRepository(prisma);
  }

  return new MockRecommendationCandidateRepository();
}
