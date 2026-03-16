import { directionAxes, type DirectionAxis } from "@/shared/kernel/direction";

export const profileTestQuestionKinds = [
  "single-choice",
  "multi-select",
] as const;

export type ProfileTestQuestionKind = (typeof profileTestQuestionKinds)[number];

export type ProfileTestQuestionOption = {
  id: string;
  label: string;
  description: string;
  axisBoosts: Partial<Record<DirectionAxis, number>>;
  preferredProgramFocuses: string[];
  preferredSubjectBlocks: string[];
  explanationAnchor: string;
};

type BaseProfileTestQuestion = {
  id: string;
  prompt: string;
  description: string;
  required: boolean;
  options: ProfileTestQuestionOption[];
};

export type SingleChoiceProfileTestQuestion = BaseProfileTestQuestion & {
  kind: "single-choice";
};

export type MultiSelectProfileTestQuestion = BaseProfileTestQuestion & {
  kind: "multi-select";
  minSelections: number;
  maxSelections: number;
};

export type ProfileTestQuestion =
  | SingleChoiceProfileTestQuestion
  | MultiSelectProfileTestQuestion;

export type RawProfileTestSubmission = Record<
  string,
  string | string[] | undefined
>;

export type ParsedProfileTestAnswer = {
  questionId: string;
  selectedOptionIds: string[];
};

export type ProfileTestValidationIssue = {
  questionId: string;
  reason:
    | "required"
    | "invalid-type"
    | "unknown-option"
    | "too-many-selections"
    | "too-few-selections";
};

export type ParsedProfileTestSubmissionState =
  | "empty"
  | "incomplete"
  | "invalid"
  | "complete";

export type ParsedProfileTestSubmission = {
  answers: ParsedProfileTestAnswer[];
  issues: ProfileTestValidationIssue[];
  state: ParsedProfileTestSubmissionState;
};

export type RecommendationProfile = {
  axisWeights: Record<DirectionAxis, number>;
  preferredProgramFocuses: string[];
  preferredSubjectBlocks: string[];
  explanationAnchors: string[];
  dominantAxes: DirectionAxis[];
};

export type RecommendationConfidence = "high" | "medium" | "emerging";

export type RecommendationMatch = {
  directionId: string;
  slug: string;
  title: string;
  score: number;
  confidence: RecommendationConfidence;
  explanation: string[];
};

export type RecommendationResult = {
  profile: RecommendationProfile;
  recommendedDirectionIds: string[];
  matches: RecommendationMatch[];
  summary: string;
};

export function createEmptyRecommendationAxisWeights(): Record<
  DirectionAxis,
  number
> {
  return directionAxes.reduce(
    (weights, axis) => {
      weights[axis] = 0;

      return weights;
    },
    {} as Record<DirectionAxis, number>,
  );
}

export const profileTestQuestions: ProfileTestQuestion[] = [
  {
    id: "motivation",
    kind: "single-choice",
    prompt: "What kind of result sounds most exciting to you?",
    description:
      "Pick the direction of work that feels the most motivating right now.",
    required: true,
    options: [
      {
        id: "build-products",
        label: "Build applications and digital services",
        description:
          "You want to design features, interfaces, and data-backed products.",
        axisBoosts: {
          programming: 3,
          analytics: 1,
        },
        preferredProgramFocuses: ["software-development"],
        preferredSubjectBlocks: [
          "Программирование",
          "Мобильная разработка",
          "Базы данных",
        ],
        explanationAnchor:
          "You want a path that leads directly into software product work.",
      },
      {
        id: "run-infrastructure",
        label: "Keep systems and infrastructure running",
        description:
          "You are drawn to networks, servers, devices, and service reliability.",
        axisBoosts: {
          engineering: 3,
          programming: 1,
        },
        preferredProgramFocuses: [
          "network-administration",
          "hardware-and-networks",
        ],
        preferredSubjectBlocks: [
          "Сети",
          "Системное администрирование",
          "Аппаратное обеспечение",
        ],
        explanationAnchor:
          "You are motivated by stable infrastructure and technical operations.",
      },
      {
        id: "protect-systems",
        label: "Protect systems, data, and users",
        description:
          "You are interested in risk reduction, resilience, and cyber defence.",
        axisBoosts: {
          analytics: 2,
          math: 1,
          engineering: 1,
        },
        preferredProgramFocuses: ["information-security"],
        preferredSubjectBlocks: [
          "Информационная безопасность",
          "Кибербезопасность",
          "Базы данных",
        ],
        explanationAnchor:
          "You want to understand threats and keep digital systems safe.",
      },
    ],
  },
  {
    id: "activities",
    kind: "multi-select",
    prompt: "Which activities sound the most interesting?",
    description:
      "Choose one or two options. This question is multi-select on purpose.",
    required: true,
    minSelections: 1,
    maxSelections: 2,
    options: [
      {
        id: "write-code",
        label: "Write code and debug features",
        description:
          "You enjoy building functionality and seeing logic come together.",
        axisBoosts: {
          programming: 2,
          analytics: 1,
        },
        preferredProgramFocuses: ["software-development"],
        preferredSubjectBlocks: ["Программирование", "Тестирование"],
        explanationAnchor:
          "Hands-on coding and debugging are energizing for you.",
      },
      {
        id: "configure-networks",
        label: "Configure networks and services",
        description:
          "You want to connect systems, keep them available, and tune performance.",
        axisBoosts: {
          engineering: 2,
          analytics: 1,
        },
        preferredProgramFocuses: ["network-administration"],
        preferredSubjectBlocks: ["Сети", "Системное администрирование"],
        explanationAnchor:
          "You like working with infrastructure and connectivity.",
      },
      {
        id: "work-with-hardware",
        label: "Work with hardware and diagnostics",
        description:
          "You want to understand devices, architecture, and technical failures.",
        axisBoosts: {
          engineering: 2,
        },
        preferredProgramFocuses: ["hardware-and-networks"],
        preferredSubjectBlocks: ["Аппаратное обеспечение"],
        explanationAnchor:
          "You want to understand how computer systems behave at the device level.",
      },
      {
        id: "investigate-risks",
        label: "Investigate risks and weaknesses",
        description:
          "You are interested in defence, monitoring, and system protection.",
        axisBoosts: {
          analytics: 1,
          math: 1,
        },
        preferredProgramFocuses: ["information-security"],
        preferredSubjectBlocks: [
          "Информационная безопасность",
          "Кибербезопасность",
        ],
        explanationAnchor:
          "You are curious about vulnerabilities, threats, and defence.",
      },
      {
        id: "work-with-data",
        label: "Work with databases and structured logic",
        description:
          "You enjoy patterns, data models, and systems that depend on clean logic.",
        axisBoosts: {
          analytics: 2,
          programming: 1,
        },
        preferredProgramFocuses: [
          "software-development",
          "information-security",
        ],
        preferredSubjectBlocks: ["Базы данных"],
        explanationAnchor:
          "Data-heavy systems and structured reasoning fit your interests.",
      },
    ],
  },
  {
    id: "outcome",
    kind: "single-choice",
    prompt: "What kind of study outcome do you want first?",
    description:
      "Choose the outcome you would most like to see from your studies.",
    required: true,
    options: [
      {
        id: "launch-products",
        label: "Launch applications people use",
        description:
          "You want visible product output and a path into software roles.",
        axisBoosts: {
          programming: 2,
          analytics: 1,
        },
        preferredProgramFocuses: ["software-development"],
        preferredSubjectBlocks: ["Программирование", "Мобильная разработка"],
        explanationAnchor:
          "A visible product outcome matters more to you than infrastructure ownership.",
      },
      {
        id: "operate-systems",
        label: "Run reliable systems and infrastructure",
        description:
          "You want to keep services, networks, and environments stable.",
        axisBoosts: {
          engineering: 2,
          programming: 1,
        },
        preferredProgramFocuses: [
          "network-administration",
          "hardware-and-networks",
        ],
        preferredSubjectBlocks: [
          "Сети",
          "Системное администрирование",
          "Аппаратное обеспечение",
        ],
        explanationAnchor:
          "You want ownership over reliability, infrastructure, and operations.",
      },
      {
        id: "protect-organizations",
        label: "Protect organizations from security risks",
        description:
          "You want to understand attacks, controls, and safe system design.",
        axisBoosts: {
          analytics: 2,
          math: 1,
        },
        preferredProgramFocuses: ["information-security"],
        preferredSubjectBlocks: [
          "Информационная безопасность",
          "Кибербезопасность",
        ],
        explanationAnchor:
          "Security impact and risk management are central to what you want to do.",
      },
    ],
  },
];
