import {
  mapDirectionSourceToDetail,
  mapDirectionSourceToSummary,
} from "@/modules/learning-content";
import { loadMockDirectionSourceRecords } from "@/modules/content/infra/mock-direction-source";

describe("mapDirectionSourceToReadModel", () => {
  it("maps normalized source data into a direction summary", () => {
    const sourceRecord = loadMockDirectionSourceRecords()[1];

    const summary = mapDirectionSourceToSummary(sourceRecord);

    expect(summary.id).toBe(sourceRecord.id);
    expect(summary.slug).toBe(sourceRecord.slug);
    expect(summary.programFocus).toBe("software-development");
    expect(summary.context).toEqual({
      code: "09.02.07",
      qualification: sourceRecord.qualification,
      department: sourceRecord.department,
      studyDuration: sourceRecord.studyDuration,
      budgetSeats: 60,
      paidSeats: 30,
      tuitionPerYearRub: 156000,
    });
  });

  it("maps normalized source data into a rich direction detail", () => {
    const sourceRecord = loadMockDirectionSourceRecords()[3];

    const detail = mapDirectionSourceToDetail(sourceRecord);

    expect(detail.id).toBe(sourceRecord.id);
    expect(detail.careerPaths).toEqual([
      "Information Security Specialist",
      "Security Analyst",
      "Infrastructure Protection Engineer",
    ]);
    expect(detail.subjects).toHaveLength(4);
    expect(detail.passingScores[0]).toEqual({
      year: 2023,
      budget: 4.57,
      paid: 3.96,
    });
    expect(detail.learningContent.technologies).toHaveLength(4);
    expect(detail.learningContent.deferredFields[0]?.field).toBe(
      "complianceStandards",
    );
    expect(detail.curriculumUrl).toBe(
      "https://example-college.ru/programs/10-02-05/curriculum",
    );
  });
});
