import type {
  DirectionDetail,
  DirectionSummary,
} from "@/shared/kernel/direction";

import type { NormalizedDirectionSourceRecord } from "../domain/direction-source";

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
  return {
    ...mapDirectionSourceToSummary(sourceRecord),
    whatYouLearn: sourceRecord.profile.whatYouLearn,
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
