import type { DirectionSummary } from "@/shared/kernel/direction";

export interface DirectionCatalogRepository {
  listDirections(): Promise<DirectionSummary[]>;
}
