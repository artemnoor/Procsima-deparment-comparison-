export const adminModule = {
  name: "admin",
} as const;

export {
  getAdmissionsDashboard,
  normalizeAdmissionsDashboardFilters,
} from "./application/get-admissions-dashboard";
export {
  createAdminDirection,
  getAdminDirections,
  updateAdminDirection,
} from "./application/manage-direction-content";
export {
  getDirectionPromotions,
  saveDirectionPromotion,
  updateDirectionPromotion,
} from "./application/manage-direction-promotions";
export type {
  AdmissionsDashboardDirectionMetric,
  AdmissionsDashboardFilterSnapshot,
  AdmissionsDashboardFilters,
  AdmissionsDashboardRawFilters,
  AdmissionsDashboardRepository,
  AdmissionsDashboardSnapshot,
  AdmissionsDashboardSummary,
} from "./domain/admissions-dashboard";
export {
  DirectionContentNotFoundError,
  DirectionContentValidationError,
} from "./domain/direction-content";
export type {
  AdminDirectionContentRepository,
  AdminDirectionPassingScore,
  AdminDirectionRawInput,
  AdminDirectionRecord,
  AdminDirectionSubject,
} from "./domain/direction-content";
export {
  DirectionPromotionNotFoundError,
  DirectionPromotionValidationError,
} from "./domain/direction-promotion";
export type {
  DirectionPromotionDirectionOption,
  DirectionPromotionListFilters,
  DirectionPromotionRepository,
  DirectionPromotionSummary,
} from "./domain/direction-promotion";
export { PrismaAdmissionsDashboardRepository } from "./infra/prisma-admissions-dashboard-repository";
export { PrismaDirectionContentRepository } from "./infra/prisma-direction-content-repository";
export { PrismaDirectionPromotionRepository } from "./infra/prisma-direction-promotion-repository";
export { AdminDirectionsPanel } from "./ui/admin-directions-panel";
export { DirectionPromotionsPanel } from "./ui/direction-promotions-panel";
