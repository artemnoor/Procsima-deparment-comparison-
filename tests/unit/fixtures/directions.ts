import type { DirectionDetail } from "@/shared/kernel/direction";

export function buildDirectionDetail(
  overrides: Partial<DirectionDetail> = {},
): DirectionDetail {
  return {
    id: "direction-1",
    slug: "software-engineering",
    title: "Software Engineering",
    shortDescription: "Build software systems.",
    programFocus: "software",
    learningDifficulty: 4,
    context: {
      code: "09.02.07",
      qualification: "Technician",
      department: "Programming Department",
      educationLevel: "СПО",
      studyForm: "Очная",
      studyDuration: "3 years 10 months",
      budgetSeats: 60,
      paidSeats: 30,
      tuitionPerYearRub: 156000,
    },
    heroDescription: "Build software systems with a practical product focus.",
    whatYouLearn: "Programming and architecture.",
    learningContent: {
      summary: "Programming and architecture.",
      outcomes: [
        {
          title: "Build software",
          description: "Implement and maintain application features.",
        },
      ],
      technologies: [
        {
          name: "TypeScript",
          category: "language",
          context: "application development",
        },
      ],
      practicalSkills: [
        {
          name: "Application development",
          level: "advanced",
          context: "project work",
        },
      ],
      studyFocuses: [
        {
          title: "Software engineering",
          summary: "Programming and architecture fundamentals.",
          subjectBlocks: ["Programming"],
          technologies: ["TypeScript"],
          practicalSkills: ["Application development"],
        },
      ],
      mvpVisibleFields: [
        "summary",
        "outcomes",
        "technologies",
        "practicalSkills",
        "studyFocuses",
      ],
      deferredFields: [],
    },
    careerPaths: ["Software Engineer"],
    careerRoles: [
      {
        title: "Software Engineer",
        slug: "software-engineer",
        description: null,
        comment: null,
      },
    ],
    targetFit: "Applicants interested in software development.",
    keyDifferences: ["Higher programming focus"],
    axisScores: {
      programming: 5,
      math: 3,
      engineering: 4,
      analytics: 2,
      ai: 2,
    },
    passingScores: [],
    admissionStats: [],
    subjects: [],
    programDescriptionUrl: null,
    curriculumUrl: null,
    documents: [],
    sections: [],
    ...overrides,
  };
}
