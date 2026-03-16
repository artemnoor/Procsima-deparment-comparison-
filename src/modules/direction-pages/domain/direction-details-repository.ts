import type { DirectionDetail } from "@/shared/kernel/direction";

export interface DirectionDetailsRepository {
  findDirectionBySlug(slug: string): Promise<DirectionDetail | null>;
}
