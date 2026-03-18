export const adminModule = {
  name: "admin",
} as const;

export {
  getAdmissionsDashboard,
  normalizeAdmissionsDashboardFilters,
} from "./application/get-admissions-dashboard";
export type {
  AdmissionsDashboardDirectionMetric,
  AdmissionsDashboardFilterSnapshot,
  AdmissionsDashboardFilters,
  AdmissionsDashboardRawFilters,
  AdmissionsDashboardRepository,
  AdmissionsDashboardSnapshot,
  AdmissionsDashboardSummary,
} from "./domain/admissions-dashboard";
export { PrismaAdmissionsDashboardRepository } from "./infra/prisma-admissions-dashboard-repository";
