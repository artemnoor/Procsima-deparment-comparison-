import fs from "node:fs";
import path from "node:path";

import {
  PrismaClient,
  ProgramDocumentType,
  ProgramStatus,
  PromotionStatus,
  RoleKey,
} from "@prisma/client";

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
  heroDescription?: string | null;
  qualification: string | null;
  department: string | null;
  educationLevel?: string | null;
  studyForm?: string | null;
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

type DirectionPromotionSeed = {
  directionId: string;
  status: PromotionStatus;
  priority: number;
  note: string;
  startsAt: string | null;
  endsAt: string | null;
};

const visibleLearningFields = [
  "summary",
  "outcomes",
  "technologies",
  "practicalSkills",
  "studyFocuses",
];

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/ё/g, "e")
    .replace(/[^a-zа-я0-9]+/gi, "-")
    .replace(/^-+|-+$/g, "");
}

function createHeroDescription(direction: DirectionSeed): string {
  return (
    direction.heroDescription ??
    [direction.shortDescription, direction.whatYouLearn]
      .filter(
        (part): part is string => typeof part === "string" && part.length > 0,
      )
      .join(" ")
  );
}

function createDirectionDocuments(direction: DirectionSeed) {
  const documents: Array<{
    type: ProgramDocumentType;
    title: string;
    url: string;
    description: string | null;
    versionLabel: string | null;
    publishedAt: Date | null;
    isPrimary: boolean;
  }> = [];

  if (direction.programDescriptionUrl) {
    documents.push({
      type: ProgramDocumentType.brochure,
      title: "Описание образовательной программы",
      url: direction.programDescriptionUrl,
      description: "Краткое описание программы для абитуриентов.",
      versionLabel: "current",
      publishedAt: null,
      isPrimary: true,
    });
  }

  if (direction.curriculumUrl) {
    documents.push({
      type: ProgramDocumentType.curriculum,
      title: "Учебный план",
      url: direction.curriculumUrl,
      description: "Актуальный учебный план направления.",
      versionLabel: "current",
      publishedAt: null,
      isPrimary: documents.length === 0,
    });
  }

  return documents;
}

function createDirectionSections(direction: DirectionSeed) {
  return [
    {
      sectionKey: "who_is_it",
      title: "Кто это?",
      body: direction.targetFit,
      sortOrder: 10,
      isPublished: true,
      items: [],
    },
    {
      sectionKey: "what_you_learn_intro",
      title: "Чему учат?",
      body: direction.whatYouLearn,
      sortOrder: 20,
      isPublished: true,
      items: direction.learningContent.studyFocuses.map((focus, index) => ({
        title: focus.title,
        description: focus.summary,
        icon: null,
        sortOrder: index + 1,
      })),
    },
    {
      sectionKey: "skills_intro",
      title: "Какие навыки получает выпускник?",
      body: "Ключевые практические навыки и результаты обучения.",
      sortOrder: 30,
      isPublished: true,
      items: direction.learningContent.practicalSkills.map((skill, index) => ({
        title: skill.name,
        description: skill.context,
        icon: null,
        sortOrder: index + 1,
      })),
    },
    {
      sectionKey: "advantages",
      title: "Преимущества программы",
      body: null,
      sortOrder: 40,
      isPublished: true,
      items: direction.keyDifferences.map((difference, index) => ({
        title: difference,
        description: null,
        icon: null,
        sortOrder: index + 1,
      })),
    },
    {
      sectionKey: "career_intro",
      title: "Где можно работать?",
      body: "Карьерные треки и роли, к которым ведёт программа.",
      sortOrder: 50,
      isPublished: true,
      items: direction.careerPaths.map((careerPath, index) => ({
        title: careerPath,
        description: null,
        icon: null,
        sortOrder: index + 1,
      })),
    },
  ];
}

function createAdmissionStats(direction: DirectionSeed) {
  return direction.passingScores.map((score, index, array) => ({
    year: score.year,
    budgetPlaces: direction.budgetSeats,
    paidPlaces: direction.paidSeats,
    tuitionPerYearRub: direction.tuitionPerYearRub,
    passingScoreBudget: score.budget,
    passingScorePaid: score.paid,
    comment:
      index === array.length - 1
        ? "Текущий ориентир для открытого applicant-facing сравнения."
        : null,
  }));
}

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

const directionPromotions: DirectionPromotionSeed[] = [
  {
    directionId: "direction-09-02-07",
    status: PromotionStatus.active,
    priority: 10,
    note: "Featured by admissions team as the strongest product-development entry point.",
    startsAt: null,
    endsAt: null,
  },
  {
    directionId: "direction-10-02-05",
    status: PromotionStatus.draft,
    priority: 30,
    note: "Prepared for cybersecurity campaign review but not yet active.",
    startsAt: null,
    endsAt: null,
  },
];

const prisma = new PrismaClient();

async function upsertDirection(direction: DirectionSeed) {
  const primaryDepartment = direction.department
    ? await prisma.department.upsert({
        where: { name: direction.department },
        update: {
          shortName: direction.department,
          slug: slugify(direction.department),
          isPublished: true,
        },
        create: {
          name: direction.department,
          shortName: direction.department,
          slug: slugify(direction.department),
          isPublished: true,
        },
      })
    : null;

  const persistedDirection = await prisma.direction.upsert({
    where: { slug: direction.slug },
    update: {
      id: direction.id,
      code: direction.code,
      slug: direction.slug,
      title: direction.title,
      shortDescription: direction.shortDescription,
      heroDescription: createHeroDescription(direction),
      qualification: direction.qualification,
      department: direction.department,
      departmentId: primaryDepartment?.id ?? null,
      educationLevel: direction.educationLevel ?? "СПО",
      studyForm: direction.studyForm ?? "Очная",
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
      isPublished: true,
      sortOrder: directions.findIndex((entry) => entry.id === direction.id) + 1,
      status: ProgramStatus.published,
      seoTitle: `${direction.title} — НПС`,
      seoDescription: direction.shortDescription,
      seoKeywords: [
        direction.code,
        direction.title,
        direction.programFocus ?? "",
      ].filter((value) => value.length > 0),
    },
    create: {
      id: direction.id,
      code: direction.code,
      slug: direction.slug,
      title: direction.title,
      shortDescription: direction.shortDescription,
      heroDescription: createHeroDescription(direction),
      qualification: direction.qualification,
      department: direction.department,
      departmentId: primaryDepartment?.id ?? null,
      educationLevel: direction.educationLevel ?? "СПО",
      studyForm: direction.studyForm ?? "Очная",
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
      isPublished: true,
      sortOrder: directions.findIndex((entry) => entry.id === direction.id) + 1,
      status: ProgramStatus.published,
      seoTitle: `${direction.title} — НПС`,
      seoDescription: direction.shortDescription,
      seoKeywords: [
        direction.code,
        direction.title,
        direction.programFocus ?? "",
      ].filter((value) => value.length > 0),
    },
  });

  await prisma.directionAdmissionStat.deleteMany({
    where: { directionId: persistedDirection.id },
  });

  const admissionStats = createAdmissionStats(direction);

  if (admissionStats.length > 0) {
    await prisma.directionAdmissionStat.createMany({
      data: admissionStats.map((stat) => ({
        directionId: persistedDirection.id,
        year: stat.year,
        budgetPlaces: stat.budgetPlaces,
        paidPlaces: stat.paidPlaces,
        tuitionPerYearRub: stat.tuitionPerYearRub,
        passingScoreBudget: stat.passingScoreBudget,
        passingScorePaid: stat.passingScorePaid,
        comment: stat.comment,
      })),
    });
  }

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
    for (const subject of direction.subjects) {
      const subjectReference = await prisma.subject.upsert({
        where: { name: subject.title },
        update: {
          slug: slugify(subject.title),
          defaultInfoUrl: subject.referenceUrl,
        },
        create: {
          name: subject.title,
          slug: slugify(subject.title),
          defaultInfoUrl: subject.referenceUrl,
        },
      });

      const subjectBlock = subject.subjectBlock
        ? await prisma.subjectBlock.upsert({
            where: { name: subject.subjectBlock },
            update: {
              slug: slugify(subject.subjectBlock),
            },
            create: {
              name: subject.subjectBlock,
              slug: slugify(subject.subjectBlock),
              sortOrder: subject.sortOrder,
            },
          })
        : null;

      const teachingDepartment = subject.department
        ? await prisma.department.upsert({
            where: { name: subject.department },
            update: {
              shortName: subject.department,
              slug: slugify(subject.department),
              isPublished: true,
            },
            create: {
              name: subject.department,
              shortName: subject.department,
              slug: slugify(subject.department),
              isPublished: true,
            },
          })
        : null;

      await prisma.directionSubject.create({
        data: {
          directionId: persistedDirection.id,
          subjectId: subjectReference.id,
          blockId: subjectBlock?.id ?? null,
          departmentId: teachingDepartment?.id ?? null,
          title: subject.title,
          subjectBlock: subject.subjectBlock,
          department: subject.department,
          hours: subject.hours,
          referenceUrl: subject.referenceUrl,
          sortOrder: subject.sortOrder,
        },
      });
    }
  }

  await prisma.directionDocument.deleteMany({
    where: { directionId: persistedDirection.id },
  });

  const documents = createDirectionDocuments(direction);

  if (documents.length > 0) {
    await prisma.directionDocument.createMany({
      data: documents.map((document) => ({
        directionId: persistedDirection.id,
        type: document.type,
        title: document.title,
        url: document.url,
        description: document.description,
        versionLabel: document.versionLabel,
        publishedAt: document.publishedAt,
        isPrimary: document.isPrimary,
      })),
    });
  }

  await prisma.directionSectionItem.deleteMany({
    where: {
      section: {
        directionId: persistedDirection.id,
      },
    },
  });
  await prisma.directionSection.deleteMany({
    where: { directionId: persistedDirection.id },
  });

  for (const section of createDirectionSections(direction)) {
    const createdSection = await prisma.directionSection.create({
      data: {
        directionId: persistedDirection.id,
        sectionKey: section.sectionKey,
        title: section.title,
        body: section.body,
        sortOrder: section.sortOrder,
        isPublished: section.isPublished,
      },
    });

    if (section.items.length > 0) {
      await prisma.directionSectionItem.createMany({
        data: section.items.map((item) => ({
          sectionId: createdSection.id,
          title: item.title,
          description: item.description,
          icon: item.icon,
          sortOrder: item.sortOrder,
        })),
      });
    }
  }

  await prisma.directionCareerRole.deleteMany({
    where: { directionId: persistedDirection.id },
  });

  for (const [index, careerPath] of direction.careerPaths.entries()) {
    const role = await prisma.careerRole.upsert({
      where: { title: careerPath },
      update: {
        slug: slugify(careerPath),
        isPublished: true,
      },
      create: {
        title: careerPath,
        slug: slugify(careerPath),
        isPublished: true,
      },
    });

    await prisma.directionCareerRole.create({
      data: {
        directionId: persistedDirection.id,
        careerRoleId: role.id,
        sortOrder: index + 1,
      },
    });
  }
}

export async function main() {
  for (const direction of directions) {
    await upsertDirection(direction);
  }

  for (const promotion of directionPromotions) {
    await prisma.directionPromotion.upsert({
      where: {
        directionId: promotion.directionId,
      },
      update: {
        status: promotion.status,
        priority: promotion.priority,
        note: promotion.note,
        startsAt: promotion.startsAt ? new Date(promotion.startsAt) : null,
        endsAt: promotion.endsAt ? new Date(promotion.endsAt) : null,
      },
      create: {
        directionId: promotion.directionId,
        status: promotion.status,
        priority: promotion.priority,
        note: promotion.note,
        startsAt: promotion.startsAt ? new Date(promotion.startsAt) : null,
        endsAt: promotion.endsAt ? new Date(promotion.endsAt) : null,
      },
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

  console.info("Seeded applicant-facing Prisma directions.", {
    directionCount: directions.length,
    promotionCount: directionPromotions.length,
    admissionStatCount: directions.reduce(
      (total, direction) => total + direction.passingScores.length,
      0,
    ),
    passingScoreCount: directions.reduce(
      (total, direction) => total + direction.passingScores.length,
      0,
    ),
    subjectCount: directions.reduce(
      (total, direction) => total + direction.subjects.length,
      0,
    ),
    documentCount: directions.reduce(
      (total, direction) => total + createDirectionDocuments(direction).length,
      0,
    ),
    sectionCount: directions.reduce(
      (total, direction) => total + createDirectionSections(direction).length,
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
