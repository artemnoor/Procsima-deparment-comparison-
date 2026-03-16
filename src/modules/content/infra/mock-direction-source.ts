import type { RawDirectionSourceRecord } from "@/shared/kernel/direction";

import {
  attachDirectionProfile,
  normalizeRawDirectionSourceRecord,
  type DirectionSourceProfile,
  type NormalizedDirectionSourceRecord,
} from "../domain/direction-source";

function createLearningContent(input: {
  summary: string;
  outcomes: Array<{ title: string; description: string }>;
  technologies: Array<{
    name: string;
    category: DirectionSourceProfile["learningContent"]["technologies"][number]["category"];
    context: string | null;
  }>;
  practicalSkills: Array<{
    name: string;
    level: DirectionSourceProfile["learningContent"]["practicalSkills"][number]["level"];
    context: string | null;
  }>;
  studyFocuses: Array<{
    title: string;
    summary: string;
    subjectBlocks: string[];
    technologies: string[];
    practicalSkills: string[];
  }>;
  deferredFields?: DirectionSourceProfile["learningContent"]["deferredFields"];
}): DirectionSourceProfile["learningContent"] {
  return {
    summary: input.summary,
    outcomes: input.outcomes,
    technologies: input.technologies,
    practicalSkills: input.practicalSkills,
    studyFocuses: input.studyFocuses,
    mvpVisibleFields: [
      "summary",
      "outcomes",
      "technologies",
      "practicalSkills",
      "studyFocuses",
    ],
    deferredFields: input.deferredFields ?? [
      {
        field: "semesterPlan",
        reason: "Deferred until the real curriculum taxonomy is integrated.",
      },
    ],
  };
}

const rawMockDirectionSourceRecords: RawDirectionSourceRecord[] = [
  {
    код: "09.02.01",
    наименование_специальности: "Компьютерные системы и комплексы",
    квалификация: "Специалист по компьютерным системам",
    кафедра: "Кафедра компьютерных систем и сетей",
    нормативный_срок_обучения: "3 года 10 месяцев",
    краткое_описание:
      "Программа готовит специалистов по проектированию, настройке, диагностике и обслуживанию компьютерных систем, периферийного оборудования и сетевой инфраструктуры.",
    количество_бюджетных_мест: 50,
    количество_платных_мест: 25,
    проходной_балл_аттестата_по_прошлым_годам: [
      { год: 2023, бюджет: 4.41, платное: 3.78 },
      { год: 2024, бюджет: 4.53, платное: 3.84 },
      { год: 2025, бюджет: 4.58, платное: 3.91 },
    ],
    стоимость_обучения_в_год_руб: 142000,
    описание_основной_профессиональной_образовательной_программы:
      "https://example-college.ru/programs/09-02-01/description",
    ссылка_на_учебный_план:
      "https://example-college.ru/programs/09-02-01/curriculum",
    предметы: [
      {
        предмет: "Архитектура компьютерных систем",
        блок_предмета: "Аппаратное обеспечение",
        кафедра_преподающая_предмет: "Кафедра компьютерных систем и сетей",
        количество_часов_у_предмета: 188,
        ссылка_на_информацию_о_предмете:
          "https://example-college.ru/subjects/computer-architecture",
      },
      {
        предмет: "Операционные системы и среды",
        блок_предмета: "Системное администрирование",
        кафедра_преподающая_предмет: "Кафедра системного программирования",
        количество_часов_у_предмета: 164,
        ссылка_на_информацию_о_предмете:
          "https://example-college.ru/subjects/os-and-environments",
      },
      {
        предмет: "Техническое обслуживание и ремонт ПК",
        блок_предмета: "Аппаратное обеспечение",
        кафедра_преподающая_предмет: "Кафедра компьютерных систем и сетей",
        количество_часов_у_предмета: 216,
        ссылка_на_информацию_о_предмете:
          "https://example-college.ru/subjects/pc-maintenance",
      },
      {
        предмет: "Компьютерные сети",
        блок_предмета: "Сети",
        кафедра_преподающая_предмет: "Кафедра сетевых технологий",
        количество_часов_у_предмета: 172,
        ссылка_на_информацию_о_предмете:
          "https://example-college.ru/subjects/computer-networks",
      },
    ],
  },
  {
    код: "09.02.07",
    наименование_специальности: "Информационные системы и программирование",
    квалификация: "Техник по компьютерным системам",
    кафедра: "Кафедра программирования и информационных систем",
    нормативный_срок_обучения: "3 года 10 месяцев",
    краткое_описание:
      "Программа направлена на подготовку специалистов по разработке, сопровождению и тестированию программного обеспечения, а также по работе с базами данных и информационными системами.",
    количество_бюджетных_мест: 60,
    количество_платных_мест: 30,
    проходной_балл_аттестата_по_прошлым_годам: [
      { год: 2023, бюджет: 4.62, платное: 3.95 },
      { год: 2024, бюджет: 4.69, платное: 4.03 },
      { год: 2025, бюджет: 4.74, платное: 4.11 },
    ],
    стоимость_обучения_в_год_руб: 156000,
    описание_основной_профессиональной_образовательной_программы:
      "https://example-college.ru/programs/09-02-07/description",
    ссылка_на_учебный_план:
      "https://example-college.ru/programs/09-02-07/curriculum",
    предметы: [
      {
        предмет: "Основы алгоритмизации и программирования",
        блок_предмета: "Программирование",
        кафедра_преподающая_предмет:
          "Кафедра программирования и информационных систем",
        количество_часов_у_предмета: 244,
        ссылка_на_информацию_о_предмете:
          "https://example-college.ru/subjects/algorithms-programming",
      },
      {
        предмет: "Разработка мобильных приложений",
        блок_предмета: "Мобильная разработка",
        кафедра_преподающая_предмет:
          "Кафедра программирования и информационных систем",
        количество_часов_у_предмета: 196,
        ссылка_на_информацию_о_предмете:
          "https://example-college.ru/subjects/mobile-development",
      },
      {
        предмет: "Базы данных",
        блок_предмета: "Базы данных",
        кафедра_преподающая_предмет: "Кафедра информационных систем",
        количество_часов_у_предмета: 180,
        ссылка_на_информацию_о_предмете:
          "https://example-college.ru/subjects/databases",
      },
      {
        предмет: "Тестирование программных модулей",
        блок_предмета: "Тестирование",
        кафедра_преподающая_предмет: "Кафедра программной инженерии",
        количество_часов_у_предмета: 148,
        ссылка_на_информацию_о_предмете:
          "https://example-college.ru/subjects/software-testing",
      },
    ],
  },
  {
    код: "09.02.06",
    наименование_специальности: "Сетевое и системное администрирование",
    квалификация: "Техник по компьютерным системам",
    кафедра: "Кафедра сетевых технологий и администрирования",
    нормативный_срок_обучения: "3 года 10 месяцев",
    краткое_описание:
      "Программа посвящена настройке сетевого оборудования, администрированию серверов, обеспечению отказоустойчивости и защите корпоративной инфраструктуры.",
    количество_бюджетных_мест: 45,
    количество_платных_мест: 20,
    проходной_балл_аттестата_по_прошлым_годам: [
      { год: 2023, бюджет: 4.33, платное: 3.67 },
      { год: 2024, бюджет: 4.39, платное: 3.73 },
      { год: 2025, бюджет: 4.47, платное: 3.82 },
    ],
    стоимость_обучения_в_год_руб: 149000,
    описание_основной_профессиональной_образовательной_программы:
      "https://example-college.ru/programs/09-02-06/description",
    ссылка_на_учебный_план:
      "https://example-college.ru/programs/09-02-06/curriculum",
    предметы: [
      {
        предмет: "Администрирование сетевых операционных систем",
        блок_предмета: "Системное администрирование",
        кафедра_преподающая_предмет:
          "Кафедра сетевых технологий и администрирования",
        количество_часов_у_предмета: 212,
        ссылка_на_информацию_о_предмете:
          "https://example-college.ru/subjects/network-os-admin",
      },
      {
        предмет: "Маршрутизация и коммутация",
        блок_предмета: "Сети",
        кафедра_преподающая_предмет:
          "Кафедра сетевых технологий и администрирования",
        количество_часов_у_предмета: 224,
        ссылка_на_информацию_о_предмете:
          "https://example-college.ru/subjects/routing-switching",
      },
      {
        предмет: "Информационная безопасность сетей",
        блок_предмета: "Информационная безопасность",
        кафедра_преподающая_предмет: "Кафедра защиты информации",
        количество_часов_у_предмета: 156,
        ссылка_на_информацию_о_предмете:
          "https://example-college.ru/subjects/network-security",
      },
      {
        предмет: "Виртуализация и облачные технологии",
        блок_предмета: "Облачные технологии",
        кафедра_преподающая_предмет:
          "Кафедра сетевых технологий и администрирования",
        количество_часов_у_предмета: 168,
        ссылка_на_информацию_о_предмете:
          "https://example-college.ru/subjects/cloud-virtualization",
      },
    ],
  },
  {
    код: "10.02.05",
    наименование_специальности:
      "Обеспечение информационной безопасности автоматизированных систем",
    квалификация: "Специалист по компьютерным системам",
    кафедра: "Кафедра информационной безопасности",
    нормативный_срок_обучения: "3 года 10 месяцев",
    краткое_описание:
      "Программа готовит специалистов по защите информации, обнаружению уязвимостей, настройке средств защиты и контролю безопасности автоматизированных систем.",
    количество_бюджетных_мест: 35,
    количество_платных_мест: 20,
    проходной_балл_аттестата_по_прошлым_годам: [
      { год: 2023, бюджет: 4.57, платное: 3.96 },
      { год: 2024, бюджет: 4.63, платное: 4.04 },
      { год: 2025, бюджет: 4.71, платное: 4.13 },
    ],
    стоимость_обучения_в_год_руб: 163000,
    описание_основной_профессиональной_образовательной_программы:
      "https://example-college.ru/programs/10-02-05/description",
    ссылка_на_учебный_план:
      "https://example-college.ru/programs/10-02-05/curriculum",
    предметы: [
      {
        предмет: "Криптографические методы защиты информации",
        блок_предмета: "Информационная безопасность",
        кафедра_преподающая_предмет: "Кафедра информационной безопасности",
        количество_часов_у_предмета: 190,
        ссылка_на_информацию_о_предмете:
          "https://example-college.ru/subjects/cryptography",
      },
      {
        предмет: "Защита информации в автоматизированных системах",
        блок_предмета: "Информационная безопасность",
        кафедра_преподающая_предмет: "Кафедра информационной безопасности",
        количество_часов_у_предмета: 228,
        ссылка_на_информацию_о_предмете:
          "https://example-college.ru/subjects/system-protection",
      },
      {
        предмет: "Сетевые атаки и методы противодействия",
        блок_предмета: "Кибербезопасность",
        кафедра_преподающая_предмет: "Кафедра защиты информации",
        количество_часов_у_предмета: 172,
        ссылка_на_информацию_о_предмете:
          "https://example-college.ru/subjects/network-attacks",
      },
      {
        предмет: "Безопасность баз данных",
        блок_предмета: "Базы данных",
        кафедра_преподающая_предмет: "Кафедра информационных систем",
        количество_часов_у_предмета: 144,
        ссылка_на_информацию_о_предмете:
          "https://example-college.ru/subjects/db-security",
      },
    ],
  },
];

const mockDirectionProfiles: Record<string, DirectionSourceProfile> = {
  "09.02.01": {
    programFocus: "hardware-and-networks",
    learningDifficulty: 4,
    whatYouLearn:
      "Architecture of computer systems, operating environments, maintenance, and network infrastructure.",
    learningContent: createLearningContent({
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
        {
          title: "Support local networks",
          description:
            "Assemble, test, and troubleshoot LAN infrastructure and end-user connectivity.",
        },
      ],
      technologies: [
        { name: "Windows", category: "platform", context: "desktop support" },
        { name: "Linux", category: "platform", context: "system setup" },
        {
          name: "Cisco Packet Tracer",
          category: "tool",
          context: "network labs",
        },
        {
          name: "Hardware diagnostics",
          category: "method",
          context: "device maintenance",
        },
      ],
      practicalSkills: [
        {
          name: "PC assembly and diagnostics",
          level: "advanced",
          context: "service and maintenance labs",
        },
        {
          name: "Operating system installation",
          level: "intermediate",
          context: "classroom infrastructure setup",
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
          subjectBlocks: ["РђРїРїР°СЂР°С‚РЅРѕРµ РѕР±РµСЃРїРµС‡РµРЅРёРµ"],
          technologies: ["Windows", "Hardware diagnostics"],
          practicalSkills: ["PC assembly and diagnostics"],
        },
        {
          title: "Network infrastructure",
          summary: "Foundations of office and classroom network setup.",
          subjectBlocks: [
            "РЎРµС‚Рё",
            "РЎРёСЃС‚РµРјРЅРѕРµ Р°РґРјРёРЅРёСЃС‚СЂРёСЂРѕРІР°РЅРёРµ",
          ],
          technologies: ["Linux", "Cisco Packet Tracer"],
          practicalSkills: ["Basic network configuration"],
        },
      ],
      deferredFields: [
        {
          field: "industryCertifications",
          reason:
            "Certification mapping is deferred until real program metadata is available.",
        },
      ],
    }),
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
    axisScores: {
      programming: 2,
      math: 3,
      engineering: 5,
      analytics: 2,
      ai: 1,
    },
  },
  "09.02.07": {
    programFocus: "software-development",
    learningDifficulty: 4,
    whatYouLearn:
      "Algorithms, software development, mobile applications, database work, and testing practices.",
    learningContent: createLearningContent({
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
        { name: "SQL", category: "language", context: "database labs" },
        { name: "Git", category: "tool", context: "version control basics" },
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
          subjectBlocks: ["РџСЂРѕРіСЂР°РјРјРёСЂРѕРІР°РЅРёРµ"],
          technologies: ["Python", "Git"],
          practicalSkills: ["Backend logic implementation"],
        },
        {
          title: "Apps and data",
          summary:
            "Building mobile and information systems with persistent storage.",
          subjectBlocks: [
            "РњРѕР±РёР»СЊРЅР°СЏ СЂР°Р·СЂР°Р±РѕС‚РєР°",
            "Р‘Р°Р·С‹ РґР°РЅРЅС‹С…",
          ],
          technologies: ["Android Studio", "SQL"],
          practicalSkills: [
            "Database querying and modeling",
            "Test case design",
          ],
        },
      ],
      deferredFields: [
        {
          field: "frameworkProgression",
          reason:
            "Framework-by-semester detail is deferred until curriculum exports are available.",
        },
      ],
    }),
    careerPaths: [
      "Software Developer",
      "Mobile Developer",
      "QA Engineer",
      "Database Specialist",
    ],
    targetFit:
      "Applicants who want to build software systems and work with applications, data, and testing.",
    keyDifferences: [
      "Strongest programming emphasis in the mock set",
      "Balanced software, databases, and testing profile",
    ],
    axisScores: {
      programming: 5,
      math: 4,
      engineering: 2,
      analytics: 4,
      ai: 2,
    },
  },
  "09.02.06": {
    programFocus: "network-administration",
    learningDifficulty: 4,
    whatYouLearn:
      "Administration of network operating systems, routing, switching, virtualization, and infrastructure resilience.",
    learningContent: createLearningContent({
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
        {
          title: "Operate virtual infrastructure",
          description:
            "Work with virtualization and cloud-oriented infrastructure patterns.",
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
        {
          name: "Monitoring runbooks",
          category: "method",
          context: "infrastructure operations",
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
        {
          name: "Virtual machine operations",
          level: "intermediate",
          context: "cloud and virtualization practice",
        },
      ],
      studyFocuses: [
        {
          title: "Systems administration",
          summary: "Operating systems, services, and resilient server setups.",
          subjectBlocks: [
            "РЎРёСЃС‚РµРјРЅРѕРµ Р°РґРјРёРЅРёСЃС‚СЂРёСЂРѕРІР°РЅРёРµ",
          ],
          technologies: ["Linux", "Monitoring runbooks"],
          practicalSkills: ["Server configuration"],
        },
        {
          title: "Network operations",
          summary:
            "Enterprise-grade networking, switching, and virtualization.",
          subjectBlocks: ["РЎРµС‚Рё", "РћР±Р»Р°С‡РЅС‹Рµ С‚РµС…РЅРѕР»РѕРіРёРё"],
          technologies: ["Cisco IOS", "VMware"],
          practicalSkills: [
            "Network routing and switching",
            "Virtual machine operations",
          ],
        },
      ],
      deferredFields: [
        {
          field: "vendorLabMatrix",
          reason:
            "Detailed vendor/lab mapping is deferred until real infrastructure metadata is available.",
        },
      ],
    }),
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
    axisScores: {
      programming: 2,
      math: 3,
      engineering: 4,
      analytics: 2,
      ai: 1,
    },
  },
  "10.02.05": {
    programFocus: "information-security",
    learningDifficulty: 5,
    whatYouLearn:
      "Protection of automated systems, cryptography, network attack mitigation, and database security.",
    learningContent: createLearningContent({
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
        {
          title: "Protect information assets",
          description:
            "Secure databases and automated systems against common operational risks.",
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
        { name: "SQL", category: "language", context: "database security" },
        {
          name: "Threat modeling",
          category: "method",
          context: "security analysis",
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
        {
          name: "Database protection setup",
          level: "intermediate",
          context: "data security practice",
        },
      ],
      studyFocuses: [
        {
          title: "Core information security",
          summary:
            "Controls, cryptography, and secure architecture for automated systems.",
          subjectBlocks: [
            "РРЅС„РѕСЂРјР°С†РёРѕРЅРЅР°СЏ Р±РµР·РѕРїР°СЃРЅРѕСЃС‚СЊ",
          ],
          technologies: ["Linux", "Threat modeling"],
          practicalSkills: ["System hardening"],
        },
        {
          title: "Cyber defense practice",
          summary: "Threat response, attack analysis, and database protection.",
          subjectBlocks: [
            "РљРёР±РµСЂР±РµР·РѕРїР°СЃРЅРѕСЃС‚СЊ",
            "Р‘Р°Р·С‹ РґР°РЅРЅС‹С…",
          ],
          technologies: ["SIEM basics", "SQL"],
          practicalSkills: [
            "Security incident analysis",
            "Database protection setup",
          ],
        },
      ],
      deferredFields: [
        {
          field: "complianceStandards",
          reason:
            "Formal compliance mapping is deferred until official program metadata is integrated.",
        },
      ],
    }),
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
    axisScores: {
      programming: 2,
      math: 4,
      engineering: 3,
      analytics: 3,
      ai: 1,
    },
  },
};

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

function logMockSource(level: LogLevelName, message: string, context: object) {
  if (!shouldLog(level)) {
    return;
  }

  console[level](`[mock-direction-source] ${message}`, context);
}

export function loadMockDirectionSourceRecords(): NormalizedDirectionSourceRecord[] {
  logMockSource("info", "Loading raw mock direction source dataset.", {
    records: rawMockDirectionSourceRecords.length,
  });

  const normalizedRecords = rawMockDirectionSourceRecords.map((record) => {
    const normalizedRecord = normalizeRawDirectionSourceRecord(record);
    const profile = mockDirectionProfiles[normalizedRecord.code];

    if (!profile) {
      logMockSource("error", "Missing mock direction profile for code.", {
        code: normalizedRecord.code,
      });

      throw new Error(
        `Missing mock direction profile for code ${normalizedRecord.code}.`,
      );
    }

    return attachDirectionProfile(normalizedRecord, profile);
  });

  logMockSource("info", "Mock direction source dataset normalized.", {
    records: normalizedRecords.length,
    surfacedFields: [
      "code",
      "title",
      "qualification",
      "department",
      "studyDuration",
      "budgetSeats",
      "paidSeats",
      "tuitionPerYearRub",
      "passingScores",
      "subjects",
      "profile",
      "learningContent",
    ],
    deferredFields: ["real-db-id", "normalized-curriculum-taxonomy"],
  });

  return normalizedRecords;
}

export function getRawMockDirectionSourceRecords(): RawDirectionSourceRecord[] {
  return rawMockDirectionSourceRecords;
}
