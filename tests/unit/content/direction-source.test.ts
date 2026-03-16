import {
  attachDirectionProfile,
  normalizeRawDirectionSourceRecord,
} from "@/modules/content/domain/direction-source";
import { getRawMockDirectionSourceRecords } from "@/modules/content/infra/mock-direction-source";

describe("normalizeRawDirectionSourceRecord", () => {
  it("normalizes a raw mock direction into an internal source record", () => {
    const [rawRecord] = getRawMockDirectionSourceRecords();

    const result = normalizeRawDirectionSourceRecord(rawRecord);

    expect(result.id).toBe("direction-09-02-01");
    expect(result.slug).toBe("program-09-02-01");
    expect(result.code).toBe("09.02.01");
    expect(result.passingScores).toHaveLength(3);
    expect(result.subjects).toHaveLength(4);
    expect(result.subjectBlocks).toEqual([
      "Аппаратное обеспечение",
      "Системное администрирование",
      "Сети",
    ]);
    expect(result.subjectHoursTotal).toBe(740);
  });

  it("attaches a comparison-ready profile without changing normalized source fields", () => {
    const [rawRecord] = getRawMockDirectionSourceRecords();
    const normalizedRecord = normalizeRawDirectionSourceRecord(rawRecord);

    const result = attachDirectionProfile(normalizedRecord, {
      programFocus: "hardware-and-networks",
      learningDifficulty: 4,
      whatYouLearn: "Hardware and network maintenance.",
      learningContent: {
        summary: "Hardware and network maintenance.",
        outcomes: [
          {
            title: "Maintain infrastructure",
            description: "Keep hardware and endpoints operational.",
          },
        ],
        technologies: [
          {
            name: "Linux",
            category: "platform",
            context: "system setup",
          },
        ],
        practicalSkills: [
          {
            name: "Diagnostics",
            level: "intermediate",
            context: "support labs",
          },
        ],
        studyFocuses: [
          {
            title: "Support",
            summary: "Core support operations.",
            subjectBlocks: ["Networks"],
            technologies: ["Linux"],
            practicalSkills: ["Diagnostics"],
          },
        ],
        mvpVisibleFields: [
          "summary",
          "outcomes",
          "technologies",
          "practicalSkills",
          "studyFocuses",
        ],
        deferredFields: [
          {
            field: "semesterPlan",
            reason: "Deferred for later.",
          },
        ],
      },
      careerPaths: ["Systems Technician"],
      targetFit: "Applicants interested in infrastructure.",
      keyDifferences: ["Hardware-first profile"],
      axisScores: {
        programming: 2,
        math: 3,
        engineering: 5,
        analytics: 2,
        ai: 1,
      },
    });

    expect(result.profile.programFocus).toBe("hardware-and-networks");
    expect(result.profile.axisScores.engineering).toBe(5);
    expect(result.profile.learningContent.technologies[0]?.name).toBe("Linux");
    expect(result.subjectHoursTotal).toBe(normalizedRecord.subjectHoursTotal);
  });
});
