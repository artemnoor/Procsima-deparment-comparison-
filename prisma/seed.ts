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

type LearningContentSeed = {
  summary: string | null;
  outcomes: Array<{ title: string; description: string }>;
  technologies: Array<{
    name: string;
    category: "language" | "framework" | "tool" | "platform" | "method";
    context: string | null;
  }>;
  practicalSkills: Array<{
    name: string;
    level: "foundation" | "intermediate" | "advanced";
    context: string | null;
  }>;
  studyFocuses: Array<{
    title: string;
    summary: string;
    subjectBlocks: string[];
    technologies: string[];
    practicalSkills: string[];
  }>;
  mvpVisibleFields: string[];
  deferredFields: Array<{ field: string; reason: string }>;
};

type PassingScoreSeed = {
  year: number;
  budget: string | null;
  paid: string | null;
};

type SubjectSeed = {
  title: string;
  subjectBlock: string | null;
  department: string | null;
  hours: number;
  referenceUrl: string | null;
  sortOrder: number;
};

type DirectionSeed = {
  id: string;
  code: string;
  slug: string;
  title: string;
  shortDescription: string;
  qualification: string | null;
  department: string | null;
  studyDuration: string | null;
  budgetSeats: number | null;
  paidSeats: number | null;
  tuitionPerYearRub: number | null;
  programFocus: string | null;
  whatYouLearn: string | null;
  programDescriptionUrl: string | null;
  curriculumUrl: string | null;
  learningContent: LearningContentSeed;
  careerPaths: string[];
  targetFit: string | null;
  keyDifferences: string[];
  programmingScore: number | null;
  mathScore: number | null;
  engineeringScore: number | null;
  analyticsScore: number | null;
  aiScore: number | null;
  learningDifficulty: number | null;
  passingScores: PassingScoreSeed[];
  subjects: SubjectSeed[];
};

const visibleLearningFields = [
  "summary",
  "outcomes",
  "technologies",
  "practicalSkills",
  "studyFocuses",
];

const directions: DirectionSeed[] = [
  {
    id: "direction-09-02-01",
    code: "09.02.01",
    slug: "program-09-02-01",
    title: "Компьютерные системы и комплексы",
    shortDescription:
      "Программа готовит специалистов по проектированию, настройке, диагностике и обслуживанию компьютерных систем, периферийного оборудования и сетевой инфраструктуры.",
    qualification: "Специалист по компьютерным системам",
    department: "Кафедра компьютерных систем и сетей",
    studyDuration: "3 года 10 месяцев",
    budgetSeats: 50,
    paidSeats: 25,
    tuitionPerYearRub: 142000,
    programFocus: "hardware-and-networks",
    whatYouLearn:
      "Architecture of computer systems, operating environments, maintenance, and network infrastructure.",
    programDescriptionUrl:
      "https://example-college.ru/programs/09-02-01/description",
    curriculumUrl: "https://example-college.ru/programs/09-02-01/curriculum",
    learningContent: {
      summary:
        "Students learn how computer hardware, operating environments, and network infrastructure work together in real support and maintenance workflows.",
      outcomes: [
        {
          title: "Maintain computer hardware",
          description:
            "Diagnose workstation failures, replace components, and keep equipment ready for production use.",
        },
        {
          title: "Configure operating environments",
          description:
            "Set up operating systems, drivers, and basic service tooling for labs and office environments.",
        },
      ],
      technologies: [
        {
          name: "Windows",
          category: "platform",
          context: "desktop support",
        },
        {
          name: "Linux",
          category: "platform",
          context: "system setup",
        },
        {
          name: "Cisco Packet Tracer",
          category: "tool",
          context: "network labs",
        },
      ],
      practicalSkills: [
        {
          name: "PC assembly and diagnostics",
          level: "advanced",
          context: "service and maintenance labs",
        },
        {
          name: "Basic network configuration",
          level: "intermediate",
          context: "switch and endpoint connectivity",
        },
      ],
      studyFocuses: [
        {
          title: "Hardware and device support",
          summary:
            "Hands-on work with system units, peripherals, and diagnostics.",
          subjectBlocks: ["Аппаратное обеспечение"],
          technologies: ["Windows"],
          practicalSkills: ["PC assembly and diagnostics"],
        },
        {
          title: "Network infrastructure",
          summary: "Foundations of office and classroom network setup.",
          subjectBlocks: ["Сети", "Системное администрирование"],
          technologies: ["Linux", "Cisco Packet Tracer"],
          practicalSkills: ["Basic network configuration"],
        },
      ],
      mvpVisibleFields: visibleLearningFields,
      deferredFields: [
        {
          field: "industryCertifications",
          reason:
            "Certification mapping is deferred until real program metadata is available.",
        },
      ],
    },
    careerPaths: [
      "Systems Technician",
      "Network Support Engineer",
      "Infrastructure Specialist",
    ],
    targetFit:
      "Applicants who want to work with computer hardware, diagnostics, and network infrastructure.",
    keyDifferences: [
      "Higher hardware and maintenance focus",
      "Stronger emphasis on infrastructure support",
    ],
    programmingScore: 2,
    mathScore: 3,
    engineeringScore: 5,
    analyticsScore: 2,
    aiScore: 1,
    learningDifficulty: 4,
    passingScores: [
      { year: 2023, budget: "4.41", paid: "3.78" },
      { year: 2024, budget: "4.53", paid: "3.84" },
      { year: 2025, budget: "4.58", paid: "3.91" },
    ],
    subjects: [
      {
        title: "Архитектура компьютерных систем",
        subjectBlock: "Аппаратное обеспечение",
        department: "Кафедра компьютерных систем и сетей",
        hours: 188,
        referenceUrl:
          "https://example-college.ru/subjects/computer-architecture",
        sortOrder: 1,
      },
      {
        title: "Операционные системы и среды",
        subjectBlock: "Системное администрирование",
        department: "Кафедра системного программирования",
        hours: 164,
        referenceUrl: "https://example-college.ru/subjects/os-and-environments",
        sortOrder: 2,
      },
      {
        title: "Компьютерные сети",
        subjectBlock: "Сети",
        department: "Кафедра сетевых технологий",
        hours: 172,
        referenceUrl: "https://example-college.ru/subjects/computer-networks",
        sortOrder: 3,
      },
    ],
  },
  {
    id: "direction-09-02-07",
    code: "09.02.07",
    slug: "program-09-02-07",
    title: "Информационные системы и программирование",
    shortDescription:
      "Программа направлена на подготовку специалистов по разработке, сопровождению и тестированию программного обеспечения, а также по работе с базами данных и информационными системами.",
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
        "Students build software products from algorithms to tested applications, with concrete exposure to programming, databases, and delivery practices.",
      outcomes: [
        {
          title: "Write application code",
          description:
            "Implement algorithms, data structures, and user-facing application features in programming labs.",
        },
        {
          title: "Work with data storage",
          description:
            "Design and query relational databases for information systems and app backends.",
        },
        {
          title: "Test and improve software",
          description:
            "Validate modules, debug defects, and iterate on product quality.",
        },
      ],
      technologies: [
        {
          name: "Python",
          category: "language",
          context: "intro programming and automation",
        },
        {
          name: "SQL",
          category: "language",
          context: "database labs",
        },
        {
          name: "Git",
          category: "tool",
          context: "version control basics",
        },
        {
          name: "Android Studio",
          category: "tool",
          context: "mobile development practice",
        },
      ],
      practicalSkills: [
        {
          name: "Backend logic implementation",
          level: "advanced",
          context: "application development projects",
        },
        {
          name: "Database querying and modeling",
          level: "intermediate",
          context: "information systems modules",
        },
        {
          name: "Test case design",
          level: "intermediate",
          context: "QA and validation practice",
        },
      ],
      studyFocuses: [
        {
          title: "Core programming",
          summary:
            "Algorithmic thinking and software implementation with practice-heavy coding.",
          subjectBlocks: ["Программирование"],
          technologies: ["Python", "Git"],
          practicalSkills: ["Backend logic implementation"],
        },
        {
          title: "Apps and data",
          summary:
            "Building mobile and information systems with persistent storage.",
          subjectBlocks: ["Мобильная разработка", "Базы данных"],
          technologies: ["Android Studio", "SQL"],
          practicalSkills: [
            "Database querying and modeling",
            "Test case design",
          ],
        },
      ],
      mvpVisibleFields: visibleLearningFields,
      deferredFields: [
        {
          field: "frameworkProgression",
          reason:
            "Framework-by-semester detail is deferred until curriculum exports are available.",
        },
      ],
    },
    careerPaths: [
      "Software Developer",
      "Mobile Developer",
      "QA Engineer",
      "Database Specialist",
    ],
    targetFit:
      "Applicants who want to build software systems and work with applications, data, and testing.",
    keyDifferences: [
      "Strongest programming emphasis in the current dataset",
      "Balanced software, databases, and testing profile",
    ],
    programmingScore: 5,
    mathScore: 4,
    engineeringScore: 2,
    analyticsScore: 4,
    aiScore: 2,
    learningDifficulty: 4,
    passingScores: [
      { year: 2023, budget: "4.62", paid: "3.95" },
      { year: 2024, budget: "4.69", paid: "4.03" },
      { year: 2025, budget: "4.74", paid: "4.11" },
    ],
    subjects: [
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
        title: "Разработка мобильных приложений",
        subjectBlock: "Мобильная разработка",
        department: "Кафедра программирования и информационных систем",
        hours: 196,
        referenceUrl: "https://example-college.ru/subjects/mobile-development",
        sortOrder: 2,
      },
      {
        title: "Базы данных",
        subjectBlock: "Базы данных",
        department: "Кафедра информационных систем",
        hours: 180,
        referenceUrl: "https://example-college.ru/subjects/databases",
        sortOrder: 3,
      },
      {
        title: "Тестирование программных модулей",
        subjectBlock: "Тестирование",
        department: "Кафедра программной инженерии",
        hours: 148,
        referenceUrl: "https://example-college.ru/subjects/software-testing",
        sortOrder: 4,
      },
    ],
  },
  {
    id: "direction-09-02-06",
    code: "09.02.06",
    slug: "program-09-02-06",
    title: "Сетевое и системное администрирование",
    shortDescription:
      "Программа посвящена настройке сетевого оборудования, администрированию серверов, обеспечению отказоустойчивости и защите корпоративной инфраструктуры.",
    qualification: "Техник по компьютерным системам",
    department: "Кафедра сетевых технологий и администрирования",
    studyDuration: "3 года 10 месяцев",
    budgetSeats: 45,
    paidSeats: 20,
    tuitionPerYearRub: 149000,
    programFocus: "network-administration",
    whatYouLearn:
      "Administration of network operating systems, routing, switching, virtualization, and infrastructure resilience.",
    programDescriptionUrl:
      "https://example-college.ru/programs/09-02-06/description",
    curriculumUrl: "https://example-college.ru/programs/09-02-06/curriculum",
    learningContent: {
      summary:
        "Students administer servers, configure enterprise networks, and learn how resilient infrastructure is deployed and supported.",
      outcomes: [
        {
          title: "Administer server environments",
          description:
            "Configure operating systems, services, and infrastructure roles for continuous operation.",
        },
        {
          title: "Build routed networks",
          description:
            "Set up routing, switching, and network segmentation for business scenarios.",
        },
      ],
      technologies: [
        {
          name: "Linux",
          category: "platform",
          context: "server administration",
        },
        {
          name: "VMware",
          category: "platform",
          context: "virtualization labs",
        },
        {
          name: "Cisco IOS",
          category: "platform",
          context: "routing and switching",
        },
      ],
      practicalSkills: [
        {
          name: "Server configuration",
          level: "advanced",
          context: "infrastructure administration",
        },
        {
          name: "Network routing and switching",
          level: "advanced",
          context: "enterprise network labs",
        },
      ],
      studyFocuses: [
        {
          title: "Systems administration",
          summary: "Operating systems, services, and resilient server setups.",
          subjectBlocks: ["Системное администрирование"],
          technologies: ["Linux"],
          practicalSkills: ["Server configuration"],
        },
        {
          title: "Network operations",
          summary:
            "Enterprise-grade networking, switching, and virtualization.",
          subjectBlocks: ["Сети", "Облачные технологии"],
          technologies: ["Cisco IOS", "VMware"],
          practicalSkills: ["Network routing and switching"],
        },
      ],
      mvpVisibleFields: visibleLearningFields,
      deferredFields: [
        {
          field: "vendorLabMatrix",
          reason:
            "Detailed vendor/lab mapping is deferred until real infrastructure metadata is available.",
        },
      ],
    },
    careerPaths: [
      "System Administrator",
      "Network Administrator",
      "Cloud Infrastructure Specialist",
    ],
    targetFit:
      "Applicants who want to administer servers, networks, and enterprise infrastructure.",
    keyDifferences: [
      "Stronger system administration profile",
      "Emphasis on routing, switching, and cloud infrastructure",
    ],
    programmingScore: 2,
    mathScore: 3,
    engineeringScore: 4,
    analyticsScore: 2,
    aiScore: 1,
    learningDifficulty: 4,
    passingScores: [
      { year: 2023, budget: "4.33", paid: "3.67" },
      { year: 2024, budget: "4.39", paid: "3.73" },
      { year: 2025, budget: "4.47", paid: "3.82" },
    ],
    subjects: [
      {
        title: "Администрирование сетевых операционных систем",
        subjectBlock: "Системное администрирование",
        department: "Кафедра сетевых технологий и администрирования",
        hours: 212,
        referenceUrl: "https://example-college.ru/subjects/network-os-admin",
        sortOrder: 1,
      },
      {
        title: "Маршрутизация и коммутация",
        subjectBlock: "Сети",
        department: "Кафедра сетевых технологий и администрирования",
        hours: 224,
        referenceUrl: "https://example-college.ru/subjects/routing-switching",
        sortOrder: 2,
      },
      {
        title: "Виртуализация и облачные технологии",
        subjectBlock: "Облачные технологии",
        department: "Кафедра сетевых технологий и администрирования",
        hours: 168,
        referenceUrl:
          "https://example-college.ru/subjects/cloud-virtualization",
        sortOrder: 3,
      },
    ],
  },
  {
    id: "direction-10-02-05",
    code: "10.02.05",
    slug: "program-10-02-05",
    title: "Обеспечение информационной безопасности автоматизированных систем",
    shortDescription:
      "Программа готовит специалистов по защите информации, обнаружению уязвимостей, настройке средств защиты и контролю безопасности автоматизированных систем.",
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
        "Students learn how to protect automated systems, analyze threats, and apply practical security controls across networks and data stores.",
      outcomes: [
        {
          title: "Understand security controls",
          description:
            "Apply cryptography, access control, and system hardening in protected environments.",
        },
        {
          title: "Detect and analyze threats",
          description:
            "Study attack vectors, incident signals, and defensive responses for networked systems.",
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
        {
          name: "SQL",
          category: "language",
          context: "database security",
        },
      ],
      practicalSkills: [
        {
          name: "Security incident analysis",
          level: "intermediate",
          context: "threat investigation labs",
        },
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
        {
          title: "Cyber defense practice",
          summary: "Threat response, attack analysis, and database protection.",
          subjectBlocks: ["Кибербезопасность", "Базы данных"],
          technologies: ["SIEM basics", "SQL"],
          practicalSkills: ["Security incident analysis"],
        },
      ],
      mvpVisibleFields: visibleLearningFields,
      deferredFields: [
        {
          field: "complianceStandards",
          reason:
            "Formal compliance mapping is deferred until official program metadata is integrated.",
        },
      ],
    },
    careerPaths: [
      "Information Security Specialist",
      "Security Analyst",
      "Infrastructure Protection Engineer",
    ],
    targetFit:
      "Applicants who want to protect systems, investigate vulnerabilities, and work in cybersecurity.",
    keyDifferences: [
      "Security-first curriculum profile",
      "Highest emphasis on protection and risk mitigation",
    ],
    programmingScore: 2,
    mathScore: 4,
    engineeringScore: 3,
    analyticsScore: 3,
    aiScore: 1,
    learningDifficulty: 5,
    passingScores: [
      { year: 2023, budget: "4.57", paid: "3.96" },
      { year: 2024, budget: "4.63", paid: "4.04" },
      { year: 2025, budget: "4.71", paid: "4.13" },
    ],
    subjects: [
      {
        title: "Криптографические методы защиты информации",
        subjectBlock: "Информационная безопасность",
        department: "Кафедра информационной безопасности",
        hours: 190,
        referenceUrl: "https://example-college.ru/subjects/cryptography",
        sortOrder: 1,
      },
      {
        title: "Защита информации в автоматизированных системах",
        subjectBlock: "Информационная безопасность",
        department: "Кафедра информационной безопасности",
        hours: 228,
        referenceUrl: "https://example-college.ru/subjects/system-protection",
        sortOrder: 2,
      },
      {
        title: "Безопасность баз данных",
        subjectBlock: "Базы данных",
        department: "Кафедра информационных систем",
        hours: 144,
        referenceUrl: "https://example-college.ru/subjects/db-security",
        sortOrder: 3,
      },
    ],
  },
];

const prisma = new PrismaClient();

async function upsertDirection(direction: DirectionSeed) {
  const persistedDirection = await prisma.direction.upsert({
    where: { slug: direction.slug },
    update: {
      id: direction.id,
      code: direction.code,
      slug: direction.slug,
      title: direction.title,
      shortDescription: direction.shortDescription,
      qualification: direction.qualification,
      department: direction.department,
      studyDuration: direction.studyDuration,
      budgetSeats: direction.budgetSeats,
      paidSeats: direction.paidSeats,
      tuitionPerYearRub: direction.tuitionPerYearRub,
      programFocus: direction.programFocus,
      whatYouLearn: direction.whatYouLearn,
      programDescriptionUrl: direction.programDescriptionUrl,
      curriculumUrl: direction.curriculumUrl,
      learningContent: direction.learningContent,
      careerPaths: direction.careerPaths,
      targetFit: direction.targetFit,
      keyDifferences: direction.keyDifferences,
      programmingScore: direction.programmingScore,
      mathScore: direction.mathScore,
      engineeringScore: direction.engineeringScore,
      analyticsScore: direction.analyticsScore,
      aiScore: direction.aiScore,
      learningDifficulty: direction.learningDifficulty,
    },
    create: {
      id: direction.id,
      code: direction.code,
      slug: direction.slug,
      title: direction.title,
      shortDescription: direction.shortDescription,
      qualification: direction.qualification,
      department: direction.department,
      studyDuration: direction.studyDuration,
      budgetSeats: direction.budgetSeats,
      paidSeats: direction.paidSeats,
      tuitionPerYearRub: direction.tuitionPerYearRub,
      programFocus: direction.programFocus,
      whatYouLearn: direction.whatYouLearn,
      programDescriptionUrl: direction.programDescriptionUrl,
      curriculumUrl: direction.curriculumUrl,
      learningContent: direction.learningContent,
      careerPaths: direction.careerPaths,
      targetFit: direction.targetFit,
      keyDifferences: direction.keyDifferences,
      programmingScore: direction.programmingScore,
      mathScore: direction.mathScore,
      engineeringScore: direction.engineeringScore,
      analyticsScore: direction.analyticsScore,
      aiScore: direction.aiScore,
      learningDifficulty: direction.learningDifficulty,
    },
  });

  await prisma.directionPassingScore.deleteMany({
    where: { directionId: persistedDirection.id },
  });

  if (direction.passingScores.length > 0) {
    await prisma.directionPassingScore.createMany({
      data: direction.passingScores.map((score) => ({
        directionId: persistedDirection.id,
        year: score.year,
        budget: score.budget,
        paid: score.paid,
      })),
    });
  }

  await prisma.directionSubject.deleteMany({
    where: { directionId: persistedDirection.id },
  });

  if (direction.subjects.length > 0) {
    await prisma.directionSubject.createMany({
      data: direction.subjects.map((subject) => ({
        directionId: persistedDirection.id,
        title: subject.title,
        subjectBlock: subject.subjectBlock,
        department: subject.department,
        hours: subject.hours,
        referenceUrl: subject.referenceUrl,
        sortOrder: subject.sortOrder,
      })),
    });
  }
}

export async function main() {
  for (const direction of directions) {
    await upsertDirection(direction);
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

  console.info("Seeded applicant-facing Prisma directions.", {
    directionCount: directions.length,
    passingScoreCount: directions.reduce(
      (total, direction) => total + direction.passingScores.length,
      0,
    ),
    subjectCount: directions.reduce(
      (total, direction) => total + direction.subjects.length,
      0,
    ),
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
