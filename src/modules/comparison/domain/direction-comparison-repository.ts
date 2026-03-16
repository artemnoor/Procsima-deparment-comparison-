import type { DirectionDetail } from "@/shared/kernel/direction";

export interface DirectionComparisonRepository {
  findDirectionsByIds(directionIds: string[]): Promise<DirectionDetail[]>;
}
