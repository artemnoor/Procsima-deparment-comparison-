import type { DirectionSummary } from "@/shared/kernel/direction";

import type { DirectionCatalogRepository } from "../domain/direction-repository";

export async function listDirections(
  repository: DirectionCatalogRepository,
): Promise<DirectionSummary[]> {
  return repository.listDirections();
}
