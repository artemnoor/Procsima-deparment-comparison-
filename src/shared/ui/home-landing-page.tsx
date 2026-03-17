import Link from "next/link";

import { HowPlatformFlow } from "@/shared/ui/how-platform-flow";

const featureCards = [
  {
    title: "Детальная аналитика данных",
    description:
      "Сравнивай реальные проходные баллы, количество мест и стоимость обучения в одном спокойном интерфейсе.",
    accentClassName: "is-blue",
    icon: (
      <svg
        aria-hidden="true"
        fill="none"
        height="28"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
        width="28"
      >
        <path
          d="M9 19v-6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2Zm0 0V9a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v10m-6 0a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2m0 0V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2Z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: "Умный профтест",
    description:
      "Короткий опрос помогает перевести размытые интересы в понятный набор подходящих направлений.",
    accentClassName: "is-emerald",
    icon: (
      <svg
        aria-hidden="true"
        fill="none"
        height="28"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
        width="28"
      >
        <path
          d="M12 9v2m0 4h.01m-6.94 4h13.86c1.54 0 2.5-1.67 1.73-3L13.73 4c-.77-1.33-2.69-1.33-3.46 0L3.34 16c-.77 1.33.19 3 1.73 3Z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: "Прозрачное сравнение",
    description:
      "Показываем, где больше математики, где кодинга, а где инженерного фокуса, без перегруза академическим языком.",
    accentClassName: "is-amber",
    icon: (
      <svg
        aria-hidden="true"
        fill="none"
        height="28"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
        width="28"
      >
        <path
          d="m8 9 3 3-3 3m5 0h3M5 20h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2Z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: "Фокус на карьеру",
    description:
      "Показываем не только программу обучения, но и тип задач, ролей и карьерных траекторий после выпуска.",
    accentClassName: "is-violet",
    icon: (
      <svg
        aria-hidden="true"
        fill="none"
        height="28"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
        width="28"
      >
        <path
          d="M13 7h8m0 0v8m0-8-8 8-4-4-6 6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

const journeyLinks = [
  { href: "/directions", label: "Сразу в каталог" },
  { href: "/profile-test", label: "Хочу рекомендацию" },
  { href: "/compare", label: "Открыть сравнение" },
  { href: "/admin/dashboard", label: "Смотреть аналитику" },
];

const marqueeItems = [
  "Рекомендовано для тебя",
  "Системное мышление",
  "Проектирование",
  "Железо + код",
  "Карьерный фокус",
];

const faqItems = [
  {
    question: "Чем отличаются похоже звучащие направления?",
    answer:
      "В сравнении мы показываем профильные предметы, фокус программы, карьерные сценарии и акценты по осям вроде кода, математики, инженерии и аналитики.",
  },
  {
    question: "Что делать, если нравится всё сразу?",
    answer:
      "Пройди профтест. Он помогает расставить приоритеты и сузить выбор до нескольких действительно близких направлений, а не навязывает один ответ.",
  },
  {
    question: "Нужно ли уже сейчас знать будущую профессию?",
    answer:
      "Нет. Платформа связывает интересы, содержание обучения и карьерные варианты так, чтобы решение становилось осознаннее и спокойнее.",
  },
];

export function HomeLandingPage() {
  return (
    <>
      <main className="homePage">
        <div aria-hidden="true" className="homeAmbientBackground">
          <div className="homeBlob homeBlobOne" />
          <div className="homeBlob homeBlobTwo" />
          <div className="homeBlob homeBlobThree" />
        </div>

        <section className="homeHeroSection">
          <div className="homeContainer homeHeroLayout">
            <div className="homeHeroContent">
              <p className="homeEyebrow">Платформа осознанного выбора</p>
              <h1 className="homeHeroTitle">
                Выбери направление осознанно, а не вслепую
              </h1>
              <p className="homeHeroLead">
                Сравни программы, пройди короткий тест интересов и пойми, чем
                отличаются направления, чтобы выбрать то, что подходит именно
                тебе.
              </p>
              <div className="homeActionRow">
                <Link className="homeButton homeButtonPrimary" href="/directions">
                  Сравнить направления
                </Link>
                <Link
                  className="homeButton homeButtonSecondary"
                  href="/profile-test"
                >
                  Пройти профтест
                </Link>
              </div>
              <div className="homeJourneyRow">
                {journeyLinks.map((link) => (
                  <Link
                    className="homeJourneyChip"
                    href={link.href}
                    key={link.href}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <div aria-hidden="true" className="homeHeroVisual">
              <div className="homeHeroGlow" />
              <div className="homeHeroVideoShell">
                <video
                  autoPlay
                  className="homeHeroVideo"
                  disablePictureInPicture
                  disableRemotePlayback
                  loop
                  muted
                  playsInline
                  preload="auto"
                >
                  <source src="/home/hero-platform.webm" type="video/webm" />
                </video>
              </div>
            </div>
          </div>
        </section>

        <section className="homeSection" id="features">
          <div className="homeContainer">
            <div className="homeSectionHeader">
              <p className="homeEyebrow">Твой путь к уверенному выбору</p>
              <h2 className="homeSectionTitle">Ключевые возможности</h2>
              <p className="homeSectionLead">
                Мы собрали инструменты, которые делают процесс выбора направления
                простым, наглядным и спокойным.
              </p>
            </div>

            <div className="homeFeatureGrid">
              {featureCards.map((feature) => (
                <article
                  className={`homeFeatureCard ${feature.accentClassName}`}
                  key={feature.title}
                >
                  <div className="homeFeatureIcon">{feature.icon}</div>
                  <h3 className="homeCardTitle">{feature.title}</h3>
                  <p className="homeCardText">{feature.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="homeSection" id="how">
          <div className="homeContainer">
            <div className="homeSectionHeader">
              <p className="homeEyebrow">Сценарий выбора</p>
              <h2 className="homeSectionTitle">Как платформа помогает</h2>
              <p className="homeSectionLead">
                Мы превращаем хаос названий и описаний в понятную
                последовательность действий.
              </p>
            </div>

            <HowPlatformFlow />
          </div>
        </section>

        <div aria-hidden="true" className="homeMarqueeShell">
          <div className="homeMarqueeContainer">
            <div className="homeMarqueeTrack reverse">
              <div className="homeMarqueeContent">
                {marqueeItems.map((item) => (
                  <div className="homeMarqueeItem" key={`a-${item}`}>
                    {item}
                  </div>
                ))}
              </div>
              <div className="homeMarqueeContent">
                {marqueeItems.map((item) => (
                  <div className="homeMarqueeItem" key={`b-${item}`}>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <section className="homeSection" id="compare">
          <div className="homeContainer">
            <article className="homeSpotlightCard">
              <div className="homeSpotlightGlow homeSpotlightGlowLeft" />
              <div className="homeSpotlightGlow homeSpotlightGlowRight" />
              <h2 className="homeSpotlightTitle">Умный каталог программ</h2>
              <p className="homeSpotlightLead">
                Сравнивай направления в удобном формате. Мы перевели сложные
                учебные планы на человеческий язык: проходные баллы, количество
                мест, стоимость и визуальный баланс дисциплин.
              </p>
              <div className="homeActionRow is-centered">
                <Link className="homeButton homeButtonPrimary" href="/directions">
                  Перейти в каталог
                </Link>
              </div>
            </article>
          </div>
        </section>

        <section className="homeSection" id="test">
          <div className="homeContainer">
            <div className="homeTestPanel">
              <div>
                <p className="homeEyebrow">Профтест</p>
                <h2 className="homeSectionTitle">
                  Тест не решает за тебя. Он сужает выбор.
                </h2>
                <p className="homeCardText homeTestLead">
                  Ответь на 12 коротких вопросов о том, какие задачи тебе
                  нравятся, а мы покажем направления, которые ближе всего к
                  твоим интересам и типу мышления.
                </p>
                <Link
                  className="homeButton homeButtonSecondary"
                  href="/profile-test"
                >
                  Пройти профтест за 3 минуты
                </Link>
              </div>

              <div aria-hidden="true" className="homeTestVisual">
                <svg
                  className="homeTestSvg"
                  fill="none"
                  viewBox="0 0 400 300"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <linearGradient id="home-test-shell" x1="0" x2="1" y1="0" y2="1">
                      <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
                      <stop offset="100%" stopColor="#f8fafc" stopOpacity="0.85" />
                    </linearGradient>
                    <linearGradient
                      id="home-test-accent"
                      x1="0"
                      x2="1"
                      y1="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="#2563EB" />
                      <stop offset="100%" stopColor="#60A5FA" />
                    </linearGradient>
                  </defs>

                  <rect
                    fill="url(#home-test-shell)"
                    height="260"
                    rx="32"
                    stroke="rgba(15,23,42,0.06)"
                    strokeWidth="2"
                    width="360"
                    x="20"
                    y="20"
                  />
                  <rect
                    fill="rgba(15,23,42,0.1)"
                    height="12"
                    rx="6"
                    width="80"
                    x="40"
                    y="44"
                  />
                  <rect
                    fill="rgba(15,23,42,0.05)"
                    height="12"
                    rx="6"
                    width="40"
                    x="130"
                    y="44"
                  />
                  <circle cx="340" cy="50" fill="rgba(37,99,235,0.08)" r="14" />
                  <circle cx="340" cy="50" fill="#2563eb" r="6" />
                  <line
                    stroke="rgba(15,23,42,0.04)"
                    strokeWidth="2"
                    x1="20"
                    x2="380"
                    y1="80"
                    y2="80"
                  />

                  <rect
                    fill="rgba(15,23,42,0.04)"
                    height="6"
                    rx="3"
                    width="320"
                    x="40"
                    y="104"
                  />
                  <rect
                    className="homeAnimatedProgress"
                    fill="url(#home-test-accent)"
                    height="6"
                    rx="3"
                    width="180"
                    x="40"
                    y="104"
                  />

                  <rect
                    fill="rgba(15,23,42,0.15)"
                    height="10"
                    rx="5"
                    width="260"
                    x="40"
                    y="130"
                  />
                  <rect
                    fill="rgba(15,23,42,0.1)"
                    height="10"
                    rx="5"
                    width="180"
                    x="40"
                    y="150"
                  />

                  <rect
                    className="homeAnimatedChoice"
                    fill="rgba(37,99,235,0.06)"
                    height="40"
                    rx="14"
                    stroke="#2563EB"
                    strokeWidth="1.5"
                    width="320"
                    x="40"
                    y="180"
                  />
                  <circle
                    className="homeAnimatedDot"
                    cx="64"
                    cy="200"
                    fill="#2563eb"
                    r="8"
                  />
                  <rect
                    fill="rgba(15,23,42,0.2)"
                    height="8"
                    rx="4"
                    width="140"
                    x="88"
                    y="196"
                  />

                  <rect
                    fill="rgba(15,23,42,0.03)"
                    height="40"
                    rx="14"
                    stroke="rgba(15,23,42,0.06)"
                    strokeWidth="1.5"
                    width="320"
                    x="40"
                    y="230"
                  />
                  <circle cx="64" cy="250" fill="rgba(15,23,42,0.1)" r="8" />
                  <rect
                    fill="rgba(15,23,42,0.15)"
                    height="8"
                    rx="4"
                    width="100"
                    x="88"
                    y="246"
                  />

                  <g className="homeAnimatedCursor" transform="translate(160 206)">
                    <circle
                      className="homeAnimatedRipple"
                      cx="-2"
                      cy="-2"
                      fill="none"
                      r="24"
                      stroke="#2563eb"
                      strokeWidth="3"
                    />
                    <path
                      d="M0 0L0 26L7 20L13 32L18 30L12 18L22 18L0 0Z"
                      fill="#0F172A"
                      stroke="#ffffff"
                      strokeWidth="2.5"
                    />
                  </g>
                </svg>
              </div>
            </div>
          </div>
        </section>

        <section className="homeSection" id="careers">
          <div className="homeContainer">
            <div className="homeSectionHeader">
              <p className="homeEyebrow">После обучения</p>
              <h2 className="homeSectionTitle">
                Показываем не только программу, но и карьерные траектории
              </h2>
              <p className="homeSectionLead">
                Выбор становится спокойнее, когда понятно, к каким ролям и типам
                задач ведёт каждое направление.
              </p>
            </div>

            <div className="homeCareerGrid">
              <article className="homeInfoCard">
                <h3 className="homeCardTitle">Что ты увидишь в карьерном блоке</h3>
                <p className="homeCardText">
                  Роли выпускника, типы задач, востребованные навыки, отрасли и
                  примеры рабочих сценариев без перегруза и абстрактных обещаний.
                </p>
              </article>
              <article className="homeInfoCard">
                <h3 className="homeCardTitle">Зачем это нужно</h3>
                <p className="homeCardText">
                  Абитуриенту проще сравнивать направления, когда он видит не
                  только набор предметов, но и понятный выход в профессию.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section className="homeSection" id="faq">
          <div className="homeContainer">
            <div className="homeSectionHeader">
              <p className="homeEyebrow">Частые вопросы</p>
              <h2 className="homeSectionTitle">
                Пользователь всегда понимает, где искать следующий ответ
              </h2>
            </div>

            <div className="homeFaqList">
              {faqItems.map((item) => (
                <details className="homeFaqItem" key={item.question}>
                  <summary className="homeFaqButton">
                    <span>{item.question}</span>
                    <svg
                      aria-hidden="true"
                      className="homeFaqIcon"
                      fill="none"
                      height="20"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      viewBox="0 0 24 24"
                      width="20"
                    >
                      <path d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="homeFaqAnswer">{item.answer}</div>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="homeFinalSection">
          <div className="homeContainer">
            <div className="homeFinalCta">
              <p className="homeEyebrow">Следующий шаг</p>
              <h2 className="homeFinalTitle">
                Готов разобраться без лишней тревоги?
              </h2>
              <p className="homeFinalLead">
                Начни с каталога направлений или пройди профтест, чтобы сузить
                выбор до нескольких действительно подходящих вариантов.
              </p>
              <div className="homeActionRow is-centered">
                <Link className="homeButton homeButtonPrimary" href="/directions">
                  Посмотреть каталог
                </Link>
                <Link
                  className="homeButton homeButtonSecondary"
                  href="/profile-test"
                >
                  Пройти профтест
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="homeFooter">
        <div className="homeFooterInner">
          <div>Платформа осознанного выбора НПС</div>
          <div>Для абитуриентов и приёмной комиссии</div>
        </div>
      </footer>
    </>
  );
}
