import { PrismaClient, RoleKey } from "@prisma/client";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    "DATABASE_URL is required for integration tests. Start the test database and export DATABASE_URL before running `pnpm test:integration`.",
  );
}

export const integrationPrisma = new PrismaClient({
  datasourceUrl: databaseUrl,
});

export async function resetIntegrationDatabase(): Promise<void> {
  await integrationPrisma.event.deleteMany();
  await integrationPrisma.user.deleteMany();
  await integrationPrisma.direction.deleteMany();
}

export async function seedIntegrationData(): Promise<void> {
  await integrationPrisma.direction.createMany({
    data: [
      {
        id: "direction-software",
        slug: "software-engineering",
        title: "Software Engineering",
        shortDescription: "Program focused on software development.",
        programFocus: "software",
        whatYouLearn: "Programming, system design, and engineering practice.",
        careerPaths: ["Software Engineer", "Backend Developer"],
        targetFit: "Applicants who want to build software systems.",
        keyDifferences: ["Strong software focus"],
        programmingScore: 5,
        mathScore: 3,
        engineeringScore: 4,
        analyticsScore: 2,
        aiScore: 2,
        learningDifficulty: 4,
      },
      {
        id: "direction-analytics",
        slug: "data-analytics",
        title: "Data Analytics",
        shortDescription: "Program focused on analytics and statistics.",
        programFocus: "analytics",
        whatYouLearn: "Statistics, dashboards, and analytical reasoning.",
        careerPaths: ["Data Analyst", "BI Analyst"],
        targetFit:
          "Applicants who want to work with data and business insights.",
        keyDifferences: ["Stronger analytics focus"],
        programmingScore: 3,
        mathScore: 4,
        engineeringScore: 1,
        analyticsScore: 5,
        aiScore: 3,
        learningDifficulty: 3,
      },
    ],
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
