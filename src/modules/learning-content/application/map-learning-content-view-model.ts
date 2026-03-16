import type {
  DirectionDetail,
  DirectionLearningContent,
  DirectionSummary,
} from "@/shared/kernel/direction";
import { logWithLevel } from "@/shared/utils/logging";
import type { NormalizedDirectionSourceRecord } from "@/modules/content";

function createEmptyLearningContent(
  context: string,
  deferredReason: string,
): DirectionLearningContent {
  return {
    summary: null,
    outcomes: [],
    technologies: [],
    practicalSkills: [],
    studyFocuses: [],
    mvpVisibleFields: [
      "summary",
      "outcomes",
      "technologies",
      "practicalSkills",
      "studyFocuses",
    ],
    deferredFields: [{ field: context, reason: deferredReason }],
  };
}

export function mapDirectionSourceToSummary(
  sourceRecord: NormalizedDirectionSourceRecord,
): DirectionSummary {
  return {
    id: sourceRecord.id,
    slug: sourceRecord.slug,
    title: sourceRecord.title,
    shortDescription: sourceRecord.shortDescription,
    programFocus: sourceRecord.profile.programFocus,
    learningDifficulty: sourceRecord.profile.learningDifficulty,
    context: {
      code: sourceRecord.code,
      qualification: sourceRecord.qualification,
      department: sourceRecord.department,
      studyDuration: sourceRecord.studyDuration,
      budgetSeats: sourceRecord.budgetSeats,
      paidSeats: sourceRecord.paidSeats,
      tuitionPerYearRub: sourceRecord.tuitionPerYearRub,
    },
  };
}

export function mapDirectionSourceToDetail(
  sourceRecord: NormalizedDirectionSourceRecord,
): DirectionDetail {
  logWithLevel(
    "learning-content-view-model",
    "debug",
    "Mapping normalized direction source into detail view model.",
    {
      directionId: sourceRecord.id,
      technologies: sourceRecord.profile.learningContent.technologies.length,
      practicalSkills:
        sourceRecord.profile.learningContent.practicalSkills.length,
      studyFocuses: sourceRecord.profile.learningContent.studyFocuses.length,
    },
  );

  return {
    ...mapDirectionSourceToSummary(sourceRecord),
    whatYouLearn: sourceRecord.profile.whatYouLearn,
    learningContent: sourceRecord.profile.learningContent,
    careerPaths: sourceRecord.profile.careerPaths,
    targetFit: sourceRecord.profile.targetFit,
    keyDifferences: sourceRecord.profile.keyDifferences,
    axisScores: sourceRecord.profile.axisScores,
    passingScores: sourceRecord.passingScores,
    subjects: sourceRecord.subjects,
    programDescriptionUrl: sourceRecord.programDescriptionUrl,
    curriculumUrl: sourceRecord.curriculumUrl,
  };
}

export function createPrismaFallbackLearningContent(
  directionId: string,
): DirectionLearningContent {
  logWithLevel(
    "learning-content-view-model",
    "warn",
    "Using fallback learning-content payload for direction.",
    {
      directionId,
      reason: "structured-learning-content-not-persisted",
    },
  );

  return createEmptyLearningContent(
    "structuredLearningContent",
    "Structured learning-content fields are not persisted in Prisma yet.",
  );
}

export function findMissingMvpLearningContentFields(
  learningContent: DirectionLearningContent,
): string[] {
  return learningContent.mvpVisibleFields.filter((field) => {
    switch (field) {
      case "summary":
        return !learningContent.summary;
      case "outcomes":
        return learningContent.outcomes.length === 0;
      case "technologies":
        return learningContent.technologies.length === 0;
      case "practicalSkills":
        return learningContent.practicalSkills.length === 0;
      case "studyFocuses":
        return learningContent.studyFocuses.length === 0;
      default:
        return false;
    }
  });
}
