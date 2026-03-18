import { afterAll, beforeEach, describe, expect, it } from "vitest";

import {
  PrismaDirectionContentRepository,
  createAdminDirection,
  getAdminDirections,
  updateAdminDirection,
} from "@/modules/admin";

import {
  integrationPrisma,
  resetIntegrationDatabase,
  seedIntegrationData,
} from "../helpers/prisma";

describe("PrismaDirectionContentRepository", () => {
  beforeEach(async () => {
    await resetIntegrationDatabase();
    await seedIntegrationData();
  });

  afterAll(async () => {
    await resetIntegrationDatabase();
    await integrationPrisma.$disconnect();
  });

  it("lets admin load, create, and fully update direction content", async () => {
    const repository = new PrismaDirectionContentRepository(integrationPrisma);

    const existing = await getAdminDirections(repository);

    expect(existing).toHaveLength(2);
    expect(existing[0].passingScores.length).toBeGreaterThan(0);
    expect(existing[0].subjects.length).toBeGreaterThan(0);

    const created = await createAdminDirection(repository, {
      code: "11.02.17",
      slug: "program-11-02-17",
      title: "Разработка мультимедийных приложений",
      shortDescription:
        "Подготовка специалистов по созданию интерактивных продуктов.",
      qualification: "Техник",
      department: "Кафедра мультимедиа",
      studyDuration: "3 года 10 месяцев",
      budgetSeats: 25,
      paidSeats: 15,
      tuitionPerYearRub: 149000,
      programFocus: "multimedia",
      whatYouLearn:
        "Design systems, animation pipelines, and interactive interfaces.",
      programDescriptionUrl:
        "https://example-college.ru/programs/11-02-17/description",
      curriculumUrl: "https://example-college.ru/programs/11-02-17/curriculum",
      learningContent: {
        summary: "Students create interactive digital experiences.",
      },
      careerPaths: ["UI Engineer", "Motion Designer"],
      targetFit: "Applicants who want to ship interactive visual products.",
      keyDifferences: ["Product + media blend"],
      programmingScore: 3,
      mathScore: 2,
      engineeringScore: 2,
      analyticsScore: 2,
      aiScore: 1,
      learningDifficulty: 3,
      passingScores: [{ year: 2026, budget: "4.15", paid: "3.74" }],
      subjects: [
        {
          title: "Интерактивная графика",
          subjectBlock: "Мультимедиа",
          department: "Кафедра мультимедиа",
          hours: 144,
          referenceUrl:
            "https://example-college.ru/subjects/interactive-graphics",
          sortOrder: 1,
        },
      ],
    });

    expect(created).toMatchObject({
      id: "direction-11-02-17",
      slug: "program-11-02-17",
      title: "Разработка мультимедийных приложений",
    });

    const updated = await updateAdminDirection(
      repository,
      "direction-09-02-07",
      {
        code: "09.02.07",
        slug: "program-09-02-07",
        title: "Информационные системы и программирование",
        shortDescription: "Обновлённое описание для приёмной кампании.",
        qualification: "Техник по компьютерным системам",
        department: "Кафедра программирования и информационных систем",
        studyDuration: "3 года 10 месяцев",
        budgetSeats: 70,
        paidSeats: 35,
        tuitionPerYearRub: 161000,
        programFocus: "software-development",
        whatYouLearn: "Backend, mobile, testing, and product delivery.",
        programDescriptionUrl:
          "https://example-college.ru/programs/09-02-07/description-v2",
        curriculumUrl:
          "https://example-college.ru/programs/09-02-07/curriculum-v2",
        learningContent: {
          summary: "Updated summary for applicants.",
          tracks: ["backend", "mobile"],
        },
        careerPaths: ["Software Engineer", "QA Engineer", "Backend Developer"],
        targetFit: "Applicants who want strong product engineering practice.",
        keyDifferences: [
          "More product delivery focus",
          "Expanded mobile block",
        ],
        programmingScore: 5,
        mathScore: 4,
        engineeringScore: 3,
        analyticsScore: 4,
        aiScore: 2,
        learningDifficulty: 4,
        passingScores: [
          { year: 2025, budget: "4.74", paid: "4.11" },
          { year: 2026, budget: "4.81", paid: "4.22" },
        ],
        subjects: [
          {
            title: "Проектная разработка ПО",
            subjectBlock: "Программирование",
            department: "Кафедра программирования и информационных систем",
            hours: 220,
            referenceUrl: "https://example-college.ru/subjects/project-dev",
            sortOrder: 1,
          },
          {
            title: "Автоматизация тестирования",
            subjectBlock: "Тестирование",
            department: "Кафедра программирования и информационных систем",
            hours: 108,
            referenceUrl: "https://example-college.ru/subjects/test-automation",
            sortOrder: 2,
          },
        ],
      },
    );

    expect(updated).toMatchObject({
      id: "direction-09-02-07",
      budgetSeats: 70,
      paidSeats: 35,
      tuitionPerYearRub: 161000,
      shortDescription: "Обновлённое описание для приёмной кампании.",
    });
    expect(updated.passingScores).toEqual([
      { year: 2025, budget: "4.74", paid: "4.11" },
      { year: 2026, budget: "4.81", paid: "4.22" },
    ]);
    expect(updated.subjects).toHaveLength(2);

    const persisted = await integrationPrisma.direction.findUniqueOrThrow({
      where: { id: "direction-09-02-07" },
      include: {
        passingScores: { orderBy: { year: "asc" } },
        subjects: { orderBy: { sortOrder: "asc" } },
      },
    });

    expect(persisted.shortDescription).toBe(
      "Обновлённое описание для приёмной кампании.",
    );
    expect(persisted.passingScores).toHaveLength(2);
    expect(persisted.subjects[1]?.title).toBe("Автоматизация тестирования");
  });
});
