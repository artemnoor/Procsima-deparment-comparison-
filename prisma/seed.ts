import fs from "node:fs";
import path from "node:path";

import { PrismaClient, RoleKey } from "@prisma/client";

const envFile = path.resolve(process.cwd(), ".env");

if (fs.existsSync(envFile)) {
  const envContent = fs.readFileSync(envFile, "utf8");

  for (const line of envContent.split(/\r?\n/)) {
    const trimmedLine = line.trim();

    if (!trimmedLine || trimmedLine.startsWith("#")) {
      continue;
    }

    const separatorIndex = trimmedLine.indexOf("=");

    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmedLine.slice(0, separatorIndex).trim();
    const rawValue = trimmedLine.slice(separatorIndex + 1).trim();
    const value = rawValue.replace(/^"(.*)"$/, "$1");

    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

const prisma = new PrismaClient();

export async function main() {
  const directions = [
    {
      slug: "software-engineering",
      title: "Software Engineering",
      shortDescription:
        "Program focused on software development and system design.",
      programFocus: "software",
      whatYouLearn:
        "Programming fundamentals, software architecture, and engineering practices.",
      careerPaths: [
        "Backend Developer",
        "Frontend Developer",
        "Software Engineer",
      ],
      targetFit:
        "Applicants who want to build software systems and enjoy structured problem solving.",
      keyDifferences: ["Strong software focus", "Higher programming load"],
      programmingScore: 5,
      mathScore: 3,
      engineeringScore: 4,
      analyticsScore: 2,
      aiScore: 2,
      learningDifficulty: 4,
    },
    {
      slug: "data-analytics",
      title: "Data Analytics",
      shortDescription:
        "Program focused on analytics, statistics, and data decision-making.",
      programFocus: "analytics",
      whatYouLearn:
        "Statistics, data processing, dashboards, and analytical reasoning.",
      careerPaths: ["Data Analyst", "BI Analyst", "Product Analyst"],
      targetFit:
        "Applicants who want to work with data, metrics, and business insights.",
      keyDifferences: [
        "Stronger analytics focus",
        "More statistics and reporting",
      ],
      programmingScore: 3,
      mathScore: 4,
      engineeringScore: 1,
      analyticsScore: 5,
      aiScore: 3,
      learningDifficulty: 3,
    },
  ];

  for (const direction of directions) {
    await prisma.direction.upsert({
      where: { slug: direction.slug },
      update: direction,
      create: direction,
    });
  }

  await prisma.user.upsert({
    where: { id: "dev-admin-user" },
    update: {
      role: RoleKey.admissions_admin,
      name: "Foundation Admin",
    },
    create: {
      id: "dev-admin-user",
      email: "admin@example.local",
      name: "Foundation Admin",
      role: RoleKey.admissions_admin,
    },
  });
}

void main()
  .catch((error) => {
    console.error("Seed failed", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
