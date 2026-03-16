import {
  buildRecommendationProfile,
  generateProfileTestRecommendations,
  parseProfileTestSubmission,
  profileTestQuestions,
  type RecommendationCandidate,
} from "@/modules/recommendation";

const recommendationCandidates: RecommendationCandidate[] = [
  {
    id: "direction-09-02-07",
    slug: "program-09-02-07",
    title: "Information Systems and Programming",
    shortDescription: "Software development and databases.",
    programFocus: "software-development",
    learningDifficulty: 4,
    axisScores: {
      programming: 5,
      math: 4,
      engineering: 2,
      analytics: 4,
      ai: 2,
    },
    subjectBlocks: ["Программирование", "Мобильная разработка", "Базы данных"],
    targetFit: "Applicants who want to build software systems.",
    keyDifferences: ["Strongest programming emphasis in the dataset"],
    whatYouLearn: "Algorithms, applications, testing, and database work.",
  },
  {
    id: "direction-09-02-06",
    slug: "program-09-02-06",
    title: "Network and System Administration",
    shortDescription: "Networks, servers, and infrastructure resilience.",
    programFocus: "network-administration",
    learningDifficulty: 4,
    axisScores: {
      programming: 2,
      math: 3,
      engineering: 4,
      analytics: 2,
      ai: 1,
    },
    subjectBlocks: ["Сети", "Системное администрирование"],
    targetFit: "Applicants who want to administer servers and networks.",
    keyDifferences: ["Infrastructure-first profile"],
    whatYouLearn: "Routing, switching, and virtualization.",
  },
  {
    id: "direction-10-02-05",
    slug: "program-10-02-05",
    title: "Information Security",
    shortDescription: "Protection of automated systems and data.",
    programFocus: "information-security",
    learningDifficulty: 5,
    axisScores: {
      programming: 2,
      math: 4,
      engineering: 3,
      analytics: 3,
      ai: 1,
    },
    subjectBlocks: ["Информационная безопасность", "Кибербезопасность"],
    targetFit: "Applicants who want to protect systems and investigate risks.",
    keyDifferences: ["Security-first curriculum profile"],
    whatYouLearn: "Protection, cryptography, and security controls.",
  },
];

describe("profile test recommendation flow", () => {
  it("parses valid answers and rejects unknown options", () => {
    const parsedSubmission = parseProfileTestSubmission(profileTestQuestions, {
      motivation: "build-products",
      activities: ["write-code", "work-with-data"],
      outcome: "launch-products",
    });

    expect(parsedSubmission.state).toBe("complete");
    expect(parsedSubmission.answers).toHaveLength(3);
    expect(parsedSubmission.answers[1]?.selectedOptionIds).toEqual([
      "write-code",
      "work-with-data",
    ]);

    const invalidSubmission = parseProfileTestSubmission(profileTestQuestions, {
      motivation: "build-products",
      activities: ["write-code", "unknown-option"],
      outcome: "launch-products",
    });

    expect(invalidSubmission.state).toBe("invalid");
    expect(invalidSubmission.issues).toContainEqual({
      questionId: "activities",
      reason: "unknown-option",
    });
  });

  it("builds a recommendation profile with dominant axes and explanation anchors", () => {
    const parsedSubmission = parseProfileTestSubmission(profileTestQuestions, {
      motivation: "build-products",
      activities: ["write-code", "work-with-data"],
      outcome: "launch-products",
    });
    const recommendationProfile = buildRecommendationProfile(parsedSubmission);

    expect(recommendationProfile.axisWeights.programming).toBeGreaterThan(
      recommendationProfile.axisWeights.engineering,
    );
    expect(recommendationProfile.preferredProgramFocuses).toContain(
      "software-development",
    );
    expect(recommendationProfile.explanationAnchors).toContain(
      "You want a path that leads directly into software product work.",
    );
    expect(recommendationProfile.dominantAxes[0]).toBe("programming");
  });

  it("ranks software recommendations first for product-oriented answers", () => {
    const parsedSubmission = parseProfileTestSubmission(profileTestQuestions, {
      motivation: "build-products",
      activities: ["write-code", "work-with-data"],
      outcome: "launch-products",
    });
    const result = generateProfileTestRecommendations(
      parsedSubmission,
      recommendationCandidates,
    );

    expect(result.matches).toHaveLength(3);
    expect(result.recommendedDirectionIds).toEqual([
      "direction-09-02-07",
      "direction-10-02-05",
      "direction-09-02-06",
    ]);
    expect(result.matches[0]?.confidence).toBe("high");
    expect(result.matches[0]?.explanation.join(" ")).toContain("software");
    expect(result.summary).toContain("software");
  });
});
