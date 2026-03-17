"use client";

import { useEffect, useState } from "react";

const stages = [
  {
    id: "profile",
    label: "01",
    title: "Пройди профтест",
    description:
      "Ответь на короткие вопросы, чтобы алгоритм понял твои реальные интересы и сильные стороны.",
    cursor: { x: 340, y: 314 },
    ripple: { x: 340, y: 314 },
  },
  {
    id: "compare",
    label: "02",
    title: "Сравни кафедры",
    description:
      "Наглядное сравнение проходных баллов, бюджетных мест и учебных планов.",
    cursor: { x: 216, y: 230 },
    ripple: { x: 216, y: 230 },
  },
  {
    id: "recommend",
    label: "03",
    title: "Получи рекомендации",
    description:
      "Умная система подберет похожие направления, о которых ты мог даже не знать.",
    cursor: { x: 340, y: 198 },
    ripple: { x: 340, y: 198 },
  },
  {
    id: "choose",
    label: "04",
    title: "Выбери идеальное",
    description:
      "Сохраняй лучшие варианты и выстраивай спокойный план поступления.",
    cursor: { x: 340, y: 332 },
    ripple: { x: 340, y: 332 },
  },
];

export function HowPlatformFlow() {
  const [stageIndex, setStageIndex] = useState(0);
  const [pulseKey, setPulseKey] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setStageIndex((currentIndex) => (currentIndex + 1) % stages.length);
      setPulseKey((currentKey) => currentKey + 1);
    }, 2400);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  const activeStage = stages[stageIndex];

  return (
    <div className="homeFlowCard">
      <div className="homeFlowContainer">
        <div aria-hidden="true" className="homeFlowDemo">
          <svg
            className="homeFlowSvg"
            fill="none"
            viewBox="0 0 680 420"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="home-flow-shell" x1="58" x2="618" y1="48" y2="374">
                <stop stopColor="white" stopOpacity="0.98" />
                <stop offset="1" stopColor="#E8F0FE" stopOpacity="0.96" />
              </linearGradient>
              <linearGradient id="home-flow-button" x1="0" x2="1" y1="0" y2="1">
                <stop stopColor="#2563EB" />
                <stop offset="1" stopColor="#60A5FA" />
              </linearGradient>
              <linearGradient id="home-flow-card" x1="0" x2="1" y1="0" y2="1">
                <stop stopColor="#0F172A" stopOpacity="0.96" />
                <stop offset="1" stopColor="#1E3A8A" stopOpacity="0.92" />
              </linearGradient>
            </defs>

            <rect fill="rgba(255,255,255,0.26)" height="380" rx="34" width="632" x="24" y="20" />
            <rect
              fill="url(#home-flow-shell)"
              height="336"
              rx="30"
              stroke="rgba(15,23,42,0.08)"
              strokeWidth="2"
              width="596"
              x="42"
              y="42"
            />
            <rect fill="rgba(15,23,42,0.04)" height="52" rx="30" width="596" x="42" y="42" />
            <circle cx="78" cy="68" fill="rgba(15,23,42,0.18)" r="6" />
            <circle cx="102" cy="68" fill="rgba(15,23,42,0.12)" r="6" />
            <circle cx="126" cy="68" fill="rgba(15,23,42,0.12)" r="6" />
            <rect fill="rgba(37,99,235,0.08)" height="20" rx="10" width="170" x="158" y="58" />
            <rect fill="rgba(15,23,42,0.06)" height="20" rx="10" width="126" x="460" y="58" />

            <g className={`homeFlowPanel ${stageIndex === 0 ? "is-active" : ""}`}>
              <text
                fill="#0F172A"
                fontSize="24"
                fontWeight="800"
                textAnchor="middle"
                x="340"
                y="136"
              >
                Профтест: Твои интересы
              </text>
              <text
                fill="#526076"
                fontSize="15"
                textAnchor="middle"
                x="340"
                y="162"
              >
                С какими данными тебе интереснее работать?
              </text>

              <g className="homeFlowInteractive" style={{ transformOrigin: "340px 200px" }}>
                <rect
                  className="homeFlowBgRect"
                  fill="rgba(15,23,42,0.05)"
                  height="40"
                  rx="12"
                  width="320"
                  x="180"
                  y="180"
                />
                <circle cx="210" cy="200" fill="rgba(15,23,42,0.1)" r="8" />
                <text fill="#0F172A" fontSize="14" fontWeight="600" x="236" y="205">
                  Аналитика и графики
                </text>
              </g>

              <g
                className={`homeFlowInteractive ${stageIndex === 0 ? "is-selected" : ""}`}
                style={{ transformOrigin: "340px 250px" }}
              >
                <rect
                  className="homeFlowBgRect"
                  fill="rgba(15,23,42,0.05)"
                  height="40"
                  rx="12"
                  width="320"
                  x="180"
                  y="230"
                />
                <circle
                  cx="210"
                  cy="250"
                  fill={stageIndex === 0 ? "#2563EB" : "rgba(15,23,42,0.1)"}
                  r="8"
                />
                <text fill="#0F172A" fontSize="14" fontWeight="600" x="236" y="255">
                  Программный код и архитектура
                </text>
              </g>

              <g
                className={`homeFlowInteractive ${stageIndex === 0 ? "is-selected" : ""}`}
                style={{ transformOrigin: "340px 314px" }}
              >
                <rect
                  className="homeFlowBgRect"
                  fill="url(#home-flow-button)"
                  height="40"
                  rx="20"
                  width="160"
                  x="260"
                  y="294"
                />
                <text
                  fill="white"
                  fontSize="15"
                  fontWeight="700"
                  textAnchor="middle"
                  x="340"
                  y="320"
                >
                  Ответить
                </text>
              </g>
            </g>

            <g className={`homeFlowPanel ${stageIndex === 1 ? "is-active" : ""}`}>
              <text
                fill="#0F172A"
                fontSize="22"
                fontWeight="800"
                textAnchor="middle"
                x="340"
                y="130"
              >
                Сравнение направлений
              </text>

              <g
                className={`homeFlowInteractive ${stageIndex === 1 ? "is-selected" : ""}`}
                style={{ transformOrigin: "216px 230px" }}
              >
                <rect
                  className="homeFlowBgRect"
                  fill="rgba(15,23,42,0.04)"
                  height="150"
                  rx="20"
                  width="240"
                  x="86"
                  y="160"
                />
                <text
                  fill="#0F172A"
                  fontSize="16"
                  fontWeight="800"
                  textAnchor="middle"
                  x="206"
                  y="190"
                >
                  ФИИТ
                </text>
                <text fill="#526076" fontSize="12" x="106" y="220">
                  Проходной балл
                </text>
                <text
                  fill="#0F172A"
                  fontSize="12"
                  fontWeight="700"
                  textAnchor="end"
                  x="306"
                  y="220"
                >
                  284
                </text>
                <rect fill="rgba(15,23,42,0.1)" height="6" rx="3" width="200" x="106" y="228" />
                <rect fill="#2563EB" height="6" rx="3" width="180" x="106" y="228" />
                <text fill="#526076" fontSize="12" x="106" y="260">
                  Бюджетных мест
                </text>
                <text
                  fill="#0F172A"
                  fontSize="12"
                  fontWeight="700"
                  textAnchor="end"
                  x="306"
                  y="260"
                >
                  60
                </text>
                <rect fill="rgba(15,23,42,0.1)" height="6" rx="3" width="200" x="106" y="268" />
                <rect fill="#60A5FA" height="6" rx="3" width="120" x="106" y="268" />
              </g>

              <g className="homeFlowInteractive" style={{ transformOrigin: "464px 230px" }}>
                <rect
                  className="homeFlowBgRect"
                  fill="rgba(15,23,42,0.04)"
                  height="150"
                  rx="20"
                  width="240"
                  x="344"
                  y="160"
                />
                <text
                  fill="#0F172A"
                  fontSize="16"
                  fontWeight="800"
                  textAnchor="middle"
                  x="464"
                  y="190"
                >
                  Прикладная информатика
                </text>
                <text fill="#526076" fontSize="12" x="364" y="220">
                  Проходной балл
                </text>
                <text
                  fill="#0F172A"
                  fontSize="12"
                  fontWeight="700"
                  textAnchor="end"
                  x="564"
                  y="220"
                >
                  260
                </text>
                <rect fill="rgba(15,23,42,0.1)" height="6" rx="3" width="200" x="364" y="228" />
                <rect fill="#2563EB" height="6" rx="3" width="140" x="364" y="228" />
                <text fill="#526076" fontSize="12" x="364" y="260">
                  Бюджетных мест
                </text>
                <text
                  fill="#0F172A"
                  fontSize="12"
                  fontWeight="700"
                  textAnchor="end"
                  x="564"
                  y="260"
                >
                  120
                </text>
                <rect fill="rgba(15,23,42,0.1)" height="6" rx="3" width="200" x="364" y="268" />
                <rect fill="#60A5FA" height="6" rx="3" width="180" x="364" y="268" />
              </g>
            </g>

            <g className={`homeFlowPanel ${stageIndex === 2 ? "is-active" : ""}`}>
              <text
                fill="#0F172A"
                fontSize="22"
                fontWeight="800"
                textAnchor="middle"
                x="340"
                y="130"
              >
                Похожие кафедры
              </text>
              <text
                fill="#526076"
                fontSize="14"
                textAnchor="middle"
                x="340"
                y="154"
              >
                На основе твоих ответов мы подобрали альтернативы
              </text>

              <g
                className={`homeFlowInteractive ${stageIndex === 2 ? "is-selected" : ""}`}
                style={{ transformOrigin: "340px 200px" }}
              >
                <rect
                  className="homeFlowBgRect"
                  fill="rgba(37,99,235,0.06)"
                  height="48"
                  rx="16"
                  width="440"
                  x="120"
                  y="174"
                />
                <rect fill="#2563EB" height="28" rx="8" width="60" x="130" y="184" />
                <text
                  fill="white"
                  fontSize="12"
                  fontWeight="800"
                  textAnchor="middle"
                  x="160"
                  y="203"
                >
                  92%
                </text>
                <text fill="#0F172A" fontSize="15" fontWeight="700" x="204" y="203">
                  Программная инженерия
                </text>
              </g>

              <g className="homeFlowInteractive" style={{ transformOrigin: "340px 256px" }}>
                <rect
                  className="homeFlowBgRect"
                  fill="rgba(15,23,42,0.04)"
                  height="48"
                  rx="16"
                  width="440"
                  x="120"
                  y="232"
                />
                <rect fill="rgba(15,23,42,0.2)" height="28" rx="8" width="60" x="130" y="242" />
                <text
                  fill="white"
                  fontSize="12"
                  fontWeight="800"
                  textAnchor="middle"
                  x="160"
                  y="261"
                >
                  84%
                </text>
                <text fill="#0F172A" fontSize="15" fontWeight="700" x="204" y="261">
                  Информационная безопасность
                </text>
              </g>

              <g className="homeFlowInteractive" style={{ transformOrigin: "340px 312px" }}>
                <rect
                  className="homeFlowBgRect"
                  fill="rgba(15,23,42,0.04)"
                  height="48"
                  rx="16"
                  width="440"
                  x="120"
                  y="290"
                />
                <rect fill="rgba(15,23,42,0.2)" height="28" rx="8" width="60" x="130" y="300" />
                <text
                  fill="white"
                  fontSize="12"
                  fontWeight="800"
                  textAnchor="middle"
                  x="160"
                  y="319"
                >
                  76%
                </text>
                <text fill="#0F172A" fontSize="15" fontWeight="700" x="204" y="319">
                  Компьютерные науки
                </text>
              </g>
            </g>

            <g className={`homeFlowPanel ${stageIndex === 3 ? "is-active" : ""}`}>
              <text
                fill="#0F172A"
                fontSize="22"
                fontWeight="800"
                textAnchor="middle"
                x="340"
                y="130"
              >
                Твой идеальный выбор
              </text>

              <g className="homeFlowInteractive" style={{ transformOrigin: "340px 220px" }}>
                <rect
                  className="homeFlowBgRect"
                  fill="url(#home-flow-card)"
                  height="150"
                  rx="24"
                  width="360"
                  x="160"
                  y="160"
                />
                <text
                  fill="rgba(255,255,255,0.8)"
                  fontSize="13"
                  fontWeight="700"
                  textAnchor="middle"
                  x="340"
                  y="200"
                >
                  Направление подготовки
                </text>
                <text
                  fill="white"
                  fontSize="22"
                  fontWeight="800"
                  textAnchor="middle"
                  x="340"
                  y="230"
                >
                  Программная инженерия
                </text>
                <text
                  fill="rgba(255,255,255,0.7)"
                  fontSize="14"
                  textAnchor="middle"
                  x="340"
                  y="260"
                >
                  Здесь учат строить архитектуру ПО,
                </text>
                <text
                  fill="rgba(255,255,255,0.7)"
                  fontSize="14"
                  textAnchor="middle"
                  x="340"
                  y="280"
                >
                  управлять командами и писать чистый код.
                </text>
              </g>

              <g
                className={`homeFlowInteractive ${stageIndex === 3 ? "is-selected" : ""}`}
                style={{ transformOrigin: "340px 332px" }}
              >
                <rect
                  className="homeFlowBgRect"
                  fill="#2563EB"
                  height="44"
                  rx="22"
                  width="200"
                  x="240"
                  y="310"
                />
                <text
                  fill="white"
                  fontSize="15"
                  fontWeight="800"
                  textAnchor="middle"
                  x="340"
                  y="337"
                >
                  Добавить в избранное
                </text>
              </g>
            </g>

            <circle
              className="homeFlowRipple"
              cx={activeStage.ripple.x}
              cy={activeStage.ripple.y}
              fill="none"
              key={pulseKey}
              r="10"
              stroke="#2563EB"
              strokeWidth="3"
            />

            <g
              className="homeFlowCursor"
              transform={`translate(${activeStage.cursor.x} ${activeStage.cursor.y})`}
            >
              <path
                d="M0 0L0 28L7 21L13 36L19 33L13 18L24 18L0 0Z"
                fill="white"
                stroke="#0F172A"
                strokeWidth="2.2"
              />
            </g>
          </svg>
        </div>

        <div className="homeFlowSteps">
          {stages.map((stage, index) => (
            <div
              className={`homeFlowStep ${index === stageIndex ? "is-active" : ""}`}
              key={stage.id}
            >
              <div className="homeFlowStepDot">{stage.label}</div>
              <div>
                <h4 className="homeFlowStepTitle">{stage.title}</h4>
                <p className="homeFlowStepText">{stage.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
