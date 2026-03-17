import { PrismaClient, RoleKey } from "@prisma/client";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    "DATABASE_URL is required for integration tests. Start the test database and export DATABASE_URL before running `pnpm test:integration`.",
  );
}

if (!databaseUrl.includes("nps_choice_platform")) {
  throw new Error(
    `Refusing to run destructive integration-test setup against non-project database URL: ${databaseUrl}`,
  );
}

export const integrationPrisma = new PrismaClient({
  datasourceUrl: databaseUrl,
});

export async function resetIntegrationDatabase(): Promise<void> {
  await integrationPrisma.event.deleteMany();
  await integrationPrisma.user.deleteMany();
  await integrationPrisma.directionPassingScore.deleteMany();
  await integrationPrisma.directionSubject.deleteMany();
  await integrationPrisma.direction.deleteMany();
}

export async function seedIntegrationData(): Promise<void> {
  await integrationPrisma.direction.create({
    data: {
      id: "direction-09-02-07",
      code: "09.02.07",
      slug: "program-09-02-07",
      title: "Информационные системы и программирование",
      shortDescription:
        "Программа направлена на подготовку специалистов по разработке и сопровождению программного обеспечения.",
      qualification: "Техник по компьютерным системам",
      department: "Кафедра программирования и информационных систем",
      studyDuration: "3 года 10 месяцев",
      budgetSeats: 60,
      paidSeats: 30,
      tuitionPerYearRub: 156000,
      programFocus: "software-development",
      whatYouLearn:
        "Algorithms, software development, mobile applications, database work, and testing practices.",
      programDescriptionUrl:
        "https://example-college.ru/programs/09-02-07/description",
      curriculumUrl: "https://example-college.ru/programs/09-02-07/curriculum",
      learningContent: {
        summary:
          "Students build software products from algorithms to tested applications.",
        outcomes: [
          {
            title: "Write application code",
            description:
              "Implement algorithms, data structures, and application features.",
          },
        ],
        technologies: [
          {
            name: "Python",
            category: "language",
            context: "intro programming",
          },
          {
            name: "SQL",
            category: "language",
            context: "database labs",
          },
        ],
        practicalSkills: [
          {
            name: "Backend logic implementation",
            level: "advanced",
            context: "application development projects",
          },
        ],
        studyFocuses: [
          {
            title: "Core programming",
            summary: "Algorithmic thinking and software implementation.",
            subjectBlocks: ["Программирование"],
            technologies: ["Python"],
            practicalSkills: ["Backend logic implementation"],
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
      careerPaths: ["Software Engineer", "Backend Developer"],
      targetFit: "Applicants who want to build software systems.",
      keyDifferences: ["Strong software focus"],
      programmingScore: 5,
      mathScore: 4,
      engineeringScore: 2,
      analyticsScore: 4,
      aiScore: 2,
      learningDifficulty: 4,
      passingScores: {
        create: [
          {
            year: 2024,
            budget: "4.69",
            paid: "4.03",
          },
          {
            year: 2025,
            budget: "4.74",
            paid: "4.11",
          },
        ],
      },
      subjects: {
        create: [
          {
            title: "Основы алгоритмизации и программирования",
            subjectBlock: "Программирование",
            department: "Кафедра программирования и информационных систем",
            hours: 244,
            referenceUrl:
              "https://example-college.ru/subjects/algorithms-programming",
            sortOrder: 1,
          },
          {
            title: "Базы данных",
            subjectBlock: "Базы данных",
            department: "Кафедра информационных систем",
            hours: 180,
            referenceUrl: "https://example-college.ru/subjects/databases",
            sortOrder: 2,
          },
        ],
      },
    },
  });

  await integrationPrisma.direction.create({
    data: {
      id: "direction-10-02-05",
      code: "10.02.05",
      slug: "program-10-02-05",
      title:
        "Обеспечение информационной безопасности автоматизированных систем",
      shortDescription:
        "Программа готовит специалистов по защите информации и контролю безопасности автоматизированных систем.",
      qualification: "Специалист по компьютерным системам",
      department: "Кафедра информационной безопасности",
      studyDuration: "3 года 10 месяцев",
      budgetSeats: 35,
      paidSeats: 20,
      tuitionPerYearRub: 163000,
      programFocus: "information-security",
      whatYouLearn:
        "Protection of automated systems, cryptography, network attack mitigation, and database security.",
      programDescriptionUrl:
        "https://example-college.ru/programs/10-02-05/description",
      curriculumUrl: "https://example-college.ru/programs/10-02-05/curriculum",
      learningContent: {
        summary:
          "Students learn how to protect automated systems and apply practical security controls.",
        outcomes: [
          {
            title: "Understand security controls",
            description:
              "Apply cryptography, access control, and system hardening.",
          },
        ],
        technologies: [
          {
            name: "SIEM basics",
            category: "tool",
            context: "security monitoring",
          },
          {
            name: "Linux",
            category: "platform",
            context: "hardened environments",
          },
        ],
        practicalSkills: [
          {
            name: "System hardening",
            level: "advanced",
            context: "protected infrastructure exercises",
          },
        ],
        studyFocuses: [
          {
            title: "Core information security",
            summary:
              "Controls, cryptography, and secure architecture for automated systems.",
            subjectBlocks: ["Информационная безопасность"],
            technologies: ["Linux"],
            practicalSkills: ["System hardening"],
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
      careerPaths: ["Security Analyst", "Infrastructure Protection Engineer"],
      targetFit:
        "Applicants who want to protect systems and investigate vulnerabilities.",
      keyDifferences: ["Security-first curriculum profile"],
      programmingScore: 2,
      mathScore: 4,
      engineeringScore: 3,
      analyticsScore: 3,
      aiScore: 1,
      learningDifficulty: 5,
      passingScores: {
        create: [
          {
            year: 2024,
            budget: "4.63",
            paid: "4.04",
          },
          {
            year: 2025,
            budget: "4.71",
            paid: "4.13",
          },
        ],
      },
      subjects: {
        create: [
          {
            title: "Криптографические методы защиты информации",
            subjectBlock: "Информационная безопасность",
            department: "Кафедра информационной безопасности",
            hours: 190,
            referenceUrl: "https://example-college.ru/subjects/cryptography",
            sortOrder: 1,
          },
          {
            title: "Безопасность баз данных",
            subjectBlock: "Базы данных",
            department: "Кафедра информационных систем",
            hours: 144,
            referenceUrl: "https://example-college.ru/subjects/db-security",
            sortOrder: 2,
          },
        ],
      },
    },
  });

  await integrationPrisma.user.create({
    data: {
      id: "dev-admin-user",
      email: "admin@example.local",
      name: "Foundation Admin",
      role: RoleKey.admissions_admin,
    },
  });
}
