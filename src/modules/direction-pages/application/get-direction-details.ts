import type { DirectionDetail } from "@/shared/kernel/direction";

import type { DirectionDetailsRepository } from "../domain/direction-details-repository";

export async function getDirectionDetails(
  repository: DirectionDetailsRepository,
  slug: string,
): Promise<DirectionDetail | null> {
  return repository.findDirectionBySlug(slug);
}
