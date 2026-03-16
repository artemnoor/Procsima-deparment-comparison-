import type {
  DirectionAxisScores,
  DirectionLearningContent,
  DirectionSubject,
  PassingScore,
  RawDirectionSourceRecord,
} from "@/shared/kernel/direction";
import { rawDirectionSourceSchema } from "@/shared/kernel/direction";

const logLevels = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
} as const;

type LogLevelName = keyof typeof logLevels;

function shouldLog(level: LogLevelName): boolean {
  const configuredLevel = (process.env.LOG_LEVEL?.toLowerCase() ??
    "info") as LogLevelName;
  const activeLevel = logLevels[configuredLevel] ?? logLevels.info;

  return logLevels[level] >= activeLevel;
}

function logDirectionSource(
  level: LogLevelName,
  message: string,
  context: object,
) {
  if (!shouldLog(level)) {
    return;
  }

  console[level](`[direction-source] ${message}`, context);
}

export type DirectionSourceProfile = {
  programFocus: string | null;
  learningDifficulty: number | null;
  whatYouLearn: string | null;
  learningContent: DirectionLearningContent;
  careerPaths: string[];
  targetFit: string | null;
  keyDifferences: string[];
  axisScores: DirectionAxisScores;
};

export type NormalizedDirectionSourceRecord = {
  id: string;
  slug: string;
  code: string;
  title: string;
  qualification: string | null;
  department: string | null;
  studyDuration: string | null;
  shortDescription: string;
  budgetSeats: number | null;
  paidSeats: number | null;
  tuitionPerYearRub: number | null;
  passingScores: PassingScore[];
  programDescriptionUrl: string | null;
  curriculumUrl: string | null;
  subjects: DirectionSubject[];
  subjectBlocks: string[];
  subjectHoursTotal: number;
  profile: DirectionSourceProfile;
};

type NormalizedDirectionSourceBase = Omit<
  NormalizedDirectionSourceRecord,
  "profile"
>;

function createDirectionId(code: string): string {
  return `direction-${code.replaceAll(".", "-")}`;
}

function createDirectionSlug(code: string): string {
  return `program-${code.replaceAll(".", "-")}`;
}

function mapPassingScores(
  rawScores: RawDirectionSourceRecord["проходной_балл_аттестата_по_прошлым_годам"],
): PassingScore[] {
  return rawScores.map((score) => ({
    year: score["год"],
    budget: score["бюджет"],
    paid: score["платное"],
  }));
}

function mapSubjects(
  rawSubjects: RawDirectionSourceRecord["предметы"],
): DirectionSubject[] {
  return rawSubjects.map((subject) => ({
    title: subject["предмет"],
    subjectBlock: subject["блок_предмета"],
    department: subject["кафедра_преподающая_предмет"],
    hours: subject["количество_часов_у_предмета"],
    referenceUrl: subject["ссылка_на_информацию_о_предмете"],
  }));
}

export function normalizeRawDirectionSourceRecord(
  input: RawDirectionSourceRecord,
): NormalizedDirectionSourceBase {
  const parsedRecord = rawDirectionSourceSchema.safeParse(input);

  if (!parsedRecord.success) {
    logDirectionSource("error", "Raw direction source validation failed.", {
      issues: parsedRecord.error.issues,
    });

    throw parsedRecord.error;
  }

  const rawRecord = parsedRecord.data;
  const subjects = mapSubjects(rawRecord["предметы"]);
  const subjectBlocks = [
    ...new Set(
      subjects
        .map((subject) => subject.subjectBlock)
        .filter((subjectBlock): subjectBlock is string =>
          Boolean(subjectBlock),
        ),
    ),
  ];
  const normalizedRecord: NormalizedDirectionSourceBase = {
    id: createDirectionId(rawRecord["код"]),
    slug: createDirectionSlug(rawRecord["код"]),
    code: rawRecord["код"],
    title: rawRecord["наименование_специальности"],
    qualification: rawRecord["квалификация"],
    department: rawRecord["кафедра"],
    studyDuration: rawRecord["нормативный_срок_обучения"],
    shortDescription: rawRecord["краткое_описание"],
    budgetSeats: rawRecord["количество_бюджетных_мест"],
    paidSeats: rawRecord["количество_платных_мест"],
    tuitionPerYearRub: rawRecord["стоимость_обучения_в_год_руб"],
    passingScores: mapPassingScores(
      rawRecord["проходной_балл_аттестата_по_прошлым_годам"],
    ),
    programDescriptionUrl:
      rawRecord["описание_основной_профессиональной_образовательной_программы"],
    curriculumUrl: rawRecord["ссылка_на_учебный_план"],
    subjects,
    subjectBlocks,
    subjectHoursTotal: subjects.reduce(
      (totalHours, subject) => totalHours + subject.hours,
      0,
    ),
  };

  logDirectionSource("debug", "Normalized raw direction source record.", {
    code: normalizedRecord.code,
    slug: normalizedRecord.slug,
    subjects: normalizedRecord.subjects.length,
    subjectBlocks: normalizedRecord.subjectBlocks,
    surfacedMvpFields: normalizedRecord.subjectBlocks.length,
  });

  return normalizedRecord;
}

export function attachDirectionProfile(
  normalizedRecord: NormalizedDirectionSourceBase,
  profile: DirectionSourceProfile,
): NormalizedDirectionSourceRecord {
  logDirectionSource("debug", "Attaching direction source profile.", {
    code: normalizedRecord.code,
    mvpVisibleFields: profile.learningContent.mvpVisibleFields,
    deferredFields: profile.learningContent.deferredFields.map(
      (field) => field.field,
    ),
  });

  return {
    ...normalizedRecord,
    profile,
  };
}
