export const adminModule = {
  name: "admin",
} as const;

export {
  getAdmissionsDashboard,
  normalizeAdmissionsDashboardFilters,
} from "./application/get-admissions-dashboard";
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
export { PrismaDirectionPromotionRepository } from "./infra/prisma-direction-promotion-repository";
export { DirectionPromotionsPanel } from "./ui/direction-promotions-panel";
