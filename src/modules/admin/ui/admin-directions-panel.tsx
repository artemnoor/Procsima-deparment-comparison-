"use client";

import type { ChangeEvent, FormEvent } from "react";
import { useMemo, useRef, useState, useTransition } from "react";

import type { AdminDirectionRecord } from "../domain/direction-content";

type Props = {
  initialDirections: AdminDirectionRecord[];
};

type ApiResponse =
  | { status: "ok"; direction: AdminDirectionRecord }
  | { status: "invalid" | "forbidden" | "not-found"; reason: string };

type Draft = {
  id: string;
  code: string;
  slug: string;
  title: string;
  shortDescription: string;
  qualification: string;
  department: string;
  studyDuration: string;
  budgetSeats: string;
  paidSeats: string;
  tuitionPerYearRub: string;
  programFocus: string;
  whatYouLearn: string;
  programDescriptionUrl: string;
  curriculumUrl: string;
  learningContent: string;
  careerPaths: string;
  targetFit: string;
  keyDifferences: string;
  programmingScore: string;
  mathScore: string;
  engineeringScore: string;
  analyticsScore: string;
  aiScore: string;
  learningDifficulty: string;
  passingScores: Array<{ year: string; budget: string; paid: string }>;
  subjects: Array<{
    title: string;
    subjectBlock: string;
    department: string;
    hours: string;
    referenceUrl: string;
    sortOrder: string;
  }>;
};

const NEW_ID = "__new__";

function sortDirections(input: AdminDirectionRecord[]) {
  return [...input].sort((a, b) => a.title.localeCompare(b.title, "ru"));
}

function toDraft(direction: AdminDirectionRecord): Draft {
  return {
    id: direction.id,
    code: direction.code,
    slug: direction.slug,
    title: direction.title,
    shortDescription: direction.shortDescription,
    qualification: direction.qualification,
    department: direction.department,
    studyDuration: direction.studyDuration,
    budgetSeats: String(direction.budgetSeats),
    paidSeats: String(direction.paidSeats),
    tuitionPerYearRub: String(direction.tuitionPerYearRub),
    programFocus: direction.programFocus,
    whatYouLearn: direction.whatYouLearn,
    programDescriptionUrl: direction.programDescriptionUrl,
    curriculumUrl: direction.curriculumUrl,
    learningContent: JSON.stringify(direction.learningContent ?? {}, null, 2),
    careerPaths: direction.careerPaths.join("\n"),
    targetFit: direction.targetFit,
    keyDifferences: direction.keyDifferences.join("\n"),
    programmingScore: String(direction.programmingScore),
    mathScore: String(direction.mathScore),
    engineeringScore: String(direction.engineeringScore),
    analyticsScore: String(direction.analyticsScore),
    aiScore: String(direction.aiScore),
    learningDifficulty: String(direction.learningDifficulty),
    passingScores:
      direction.passingScores.length > 0
        ? direction.passingScores.map((row) => ({
            year: String(row.year),
            budget: row.budget,
            paid: row.paid,
          }))
        : [{ year: "", budget: "", paid: "" }],
    subjects:
      direction.subjects.length > 0
        ? direction.subjects.map((row) => ({
            title: row.title,
            subjectBlock: row.subjectBlock,
            department: row.department,
            hours: String(row.hours),
            referenceUrl: row.referenceUrl,
            sortOrder: String(row.sortOrder),
          }))
        : [
            {
              title: "",
              subjectBlock: "",
              department: "",
              hours: "",
              referenceUrl: "",
              sortOrder: "1",
            },
          ],
  };
}

function emptyDraft(): Draft {
  return {
    id: "",
    code: "",
    slug: "",
    title: "",
    shortDescription: "",
    qualification: "",
    department: "",
    studyDuration: "",
    budgetSeats: "0",
    paidSeats: "0",
    tuitionPerYearRub: "0",
    programFocus: "",
    whatYouLearn: "",
    programDescriptionUrl: "",
    curriculumUrl: "",
    learningContent: "{}",
    careerPaths: "",
    targetFit: "",
    keyDifferences: "",
    programmingScore: "0",
    mathScore: "0",
    engineeringScore: "0",
    analyticsScore: "0",
    aiScore: "0",
    learningDifficulty: "0",
    passingScores: [{ year: "", budget: "", paid: "" }],
    subjects: [
      {
        title: "",
        subjectBlock: "",
        department: "",
        hours: "",
        referenceUrl: "",
        sortOrder: "1",
      },
    ],
  };
}

function lines(input: string) {
  return input
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function toPayload(draft: Draft) {
  return {
    id: draft.id.trim() || undefined,
    code: draft.code.trim(),
    slug: draft.slug.trim(),
    title: draft.title.trim(),
    shortDescription: draft.shortDescription.trim(),
    qualification: draft.qualification.trim(),
    department: draft.department.trim(),
    studyDuration: draft.studyDuration.trim(),
    budgetSeats: Number(draft.budgetSeats),
    paidSeats: Number(draft.paidSeats),
    tuitionPerYearRub: Number(draft.tuitionPerYearRub),
    programFocus: draft.programFocus.trim(),
    whatYouLearn: draft.whatYouLearn.trim(),
    programDescriptionUrl: draft.programDescriptionUrl.trim(),
    curriculumUrl: draft.curriculumUrl.trim(),
    learningContent: draft.learningContent.trim()
      ? JSON.parse(draft.learningContent)
      : null,
    careerPaths: lines(draft.careerPaths),
    targetFit: draft.targetFit.trim(),
    keyDifferences: lines(draft.keyDifferences),
    programmingScore: Number(draft.programmingScore),
    mathScore: Number(draft.mathScore),
    engineeringScore: Number(draft.engineeringScore),
    analyticsScore: Number(draft.analyticsScore),
    aiScore: Number(draft.aiScore),
    learningDifficulty: Number(draft.learningDifficulty),
    passingScores: draft.passingScores.map((row) => ({
      year: Number(row.year),
      budget: row.budget.trim(),
      paid: row.paid.trim(),
    })),
    subjects: draft.subjects.map((row) => ({
      title: row.title.trim(),
      subjectBlock: row.subjectBlock.trim(),
      department: row.department.trim(),
      hours: Number(row.hours),
      referenceUrl: row.referenceUrl.trim(),
      sortOrder: Number(row.sortOrder),
    })),
  };
}

function fromImportedJson(value: unknown): Draft {
  if (typeof value !== "object" || value === null) {
    throw new Error("invalid");
  }

  const direction = value as Partial<AdminDirectionRecord>;

  return {
    ...emptyDraft(),
    id: typeof direction.id === "string" ? direction.id : "",
    code: typeof direction.code === "string" ? direction.code : "",
    slug: typeof direction.slug === "string" ? direction.slug : "",
    title: typeof direction.title === "string" ? direction.title : "",
    shortDescription:
      typeof direction.shortDescription === "string"
        ? direction.shortDescription
        : "",
    qualification:
      typeof direction.qualification === "string"
        ? direction.qualification
        : "",
    department:
      typeof direction.department === "string" ? direction.department : "",
    studyDuration:
      typeof direction.studyDuration === "string"
        ? direction.studyDuration
        : "",
    budgetSeats:
      typeof direction.budgetSeats === "number"
        ? String(direction.budgetSeats)
        : "0",
    paidSeats:
      typeof direction.paidSeats === "number"
        ? String(direction.paidSeats)
        : "0",
    tuitionPerYearRub:
      typeof direction.tuitionPerYearRub === "number"
        ? String(direction.tuitionPerYearRub)
        : "0",
    programFocus:
      typeof direction.programFocus === "string" ? direction.programFocus : "",
    whatYouLearn:
      typeof direction.whatYouLearn === "string" ? direction.whatYouLearn : "",
    programDescriptionUrl:
      typeof direction.programDescriptionUrl === "string"
        ? direction.programDescriptionUrl
        : "",
    curriculumUrl:
      typeof direction.curriculumUrl === "string"
        ? direction.curriculumUrl
        : "",
    learningContent: JSON.stringify(direction.learningContent ?? {}, null, 2),
    careerPaths: Array.isArray(direction.careerPaths)
      ? direction.careerPaths.join("\n")
      : "",
    targetFit:
      typeof direction.targetFit === "string" ? direction.targetFit : "",
    keyDifferences: Array.isArray(direction.keyDifferences)
      ? direction.keyDifferences.join("\n")
      : "",
    programmingScore:
      typeof direction.programmingScore === "number"
        ? String(direction.programmingScore)
        : "0",
    mathScore:
      typeof direction.mathScore === "number"
        ? String(direction.mathScore)
        : "0",
    engineeringScore:
      typeof direction.engineeringScore === "number"
        ? String(direction.engineeringScore)
        : "0",
    analyticsScore:
      typeof direction.analyticsScore === "number"
        ? String(direction.analyticsScore)
        : "0",
    aiScore:
      typeof direction.aiScore === "number" ? String(direction.aiScore) : "0",
    learningDifficulty:
      typeof direction.learningDifficulty === "number"
        ? String(direction.learningDifficulty)
        : "0",
    passingScores:
      Array.isArray(direction.passingScores) &&
      direction.passingScores.length > 0
        ? direction.passingScores.map((row) => ({
            year: String(row.year ?? ""),
            budget: typeof row.budget === "string" ? row.budget : "",
            paid: typeof row.paid === "string" ? row.paid : "",
          }))
        : [{ year: "", budget: "", paid: "" }],
    subjects:
      Array.isArray(direction.subjects) && direction.subjects.length > 0
        ? direction.subjects.map((row) => ({
            title: typeof row.title === "string" ? row.title : "",
            subjectBlock:
              typeof row.subjectBlock === "string" ? row.subjectBlock : "",
            department:
              typeof row.department === "string" ? row.department : "",
            hours: String(row.hours ?? ""),
            referenceUrl:
              typeof row.referenceUrl === "string" ? row.referenceUrl : "",
            sortOrder: String(row.sortOrder ?? "1"),
          }))
        : emptyDraft().subjects,
  };
}

export function AdminDirectionsPanel({ initialDirections }: Props) {
  const [directions, setDirections] = useState(
    sortDirections(initialDirections),
  );
  const [selectedId, setSelectedId] = useState(
    initialDirections[0]?.id ?? NEW_ID,
  );
  const [draft, setDraft] = useState(
    initialDirections[0] ? toDraft(initialDirections[0]) : emptyDraft(),
  );
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const importRef = useRef<HTMLInputElement | null>(null);

  const activeDirection = useMemo(
    () => directions.find((direction) => direction.id === selectedId) ?? null,
    [directions, selectedId],
  );

  function pick(id: string) {
    const direction = directions.find((item) => item.id === id);
    if (!direction) return;
    setSelectedId(id);
    setDraft(toDraft(direction));
    setFeedback(null);
  }

  function update<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedback(null);

    startTransition(async () => {
      try {
        const response = await fetch(
          selectedId === NEW_ID
            ? "/api/admin/directions"
            : `/api/admin/directions/${selectedId}`,
          {
            method: selectedId === NEW_ID ? "POST" : "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(toPayload(draft)),
          },
        );
        const body = (await response.json()) as ApiResponse;

        if (!response.ok || body.status !== "ok") {
          setFeedback(
            "reason" in body ? body.reason : "Could not save direction.",
          );
          return;
        }

        setDirections((current) =>
          sortDirections([
            ...current.filter((item) => item.id !== body.direction.id),
            body.direction,
          ]),
        );
        setSelectedId(body.direction.id);
        setDraft(toDraft(body.direction));
        setFeedback(
          selectedId === NEW_ID ? "Direction created." : "Direction updated.",
        );
      } catch {
        setFeedback("Could not save direction. Check JSON and numeric fields.");
      }
    });
  }

  async function importJson(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setDraft(fromImportedJson(JSON.parse(await file.text())));
      setSelectedId(NEW_ID);
      setFeedback(`Imported draft from ${file.name}.`);
    } catch {
      setFeedback("Could not import direction JSON.");
    } finally {
      event.target.value = "";
    }
  }

  function exportJson() {
    try {
      const blob = new Blob([JSON.stringify(toPayload(draft), null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `${draft.slug || "direction"}.json`;
      anchor.click();
      URL.revokeObjectURL(url);
      setFeedback("Draft exported.");
    } catch {
      setFeedback("Could not export draft.");
    }
  }

  return (
    <section style={{ padding: 24, display: "grid", gap: 24 }}>
      <div>
        <h1 style={{ marginBottom: 8 }}>Direction Content Management</h1>
        <p style={{ margin: 0 }}>
          Here admin can load existing directions, import JSON drafts, and edit
          all stored direction information.
        </p>
      </div>

      <div
        style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 24 }}
      >
        <aside
          style={{ border: "1px solid #cbd5e1", borderRadius: 12, padding: 16 }}
        >
          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            <button
              onClick={() => {
                setSelectedId(NEW_ID);
                setDraft(emptyDraft());
                setFeedback(null);
              }}
              type="button"
            >
              New
            </button>
            <button onClick={() => importRef.current?.click()} type="button">
              Import
            </button>
            <input
              accept="application/json"
              hidden
              onChange={importJson}
              ref={importRef}
              type="file"
            />
          </div>

          <div style={{ display: "grid", gap: 8 }}>
            {directions.map((direction) => (
              <button
                key={direction.id}
                onClick={() => pick(direction.id)}
                style={{
                  textAlign: "left",
                  padding: 12,
                  borderRadius: 10,
                  border:
                    selectedId === direction.id
                      ? "2px solid #0f172a"
                      : "1px solid #cbd5e1",
                  background: "#fff",
                }}
                type="button"
              >
                <strong>{direction.title}</strong>
                <div>{direction.code}</div>
                <small>{direction.department}</small>
              </button>
            ))}
          </div>
        </aside>

        <form onSubmit={submit} style={{ display: "grid", gap: 16 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 12,
            }}
          >
            <div>
              <h2 style={{ marginBottom: 4 }}>
                {activeDirection?.title ?? "New direction draft"}
              </h2>
              <div>{activeDirection?.slug ?? "Create a new direction."}</div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={exportJson} type="button">
                Export JSON
              </button>
              <button disabled={isPending} type="submit">
                {isPending ? "Saving..." : "Save"}
              </button>
            </div>
          </div>

          {feedback ? <div>{feedback}</div> : null}

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 12,
            }}
          >
            {(
              [
                ["id", "Technical ID"],
                ["code", "Code"],
                ["slug", "Slug"],
                ["title", "Title"],
                ["qualification", "Qualification"],
                ["department", "Department"],
                ["studyDuration", "Study duration"],
                ["programFocus", "Program focus"],
                ["budgetSeats", "Budget seats"],
                ["paidSeats", "Paid seats"],
                ["tuitionPerYearRub", "Tuition per year"],
                ["programDescriptionUrl", "Program description URL"],
                ["curriculumUrl", "Curriculum URL"],
                ["programmingScore", "Programming score"],
                ["mathScore", "Math score"],
                ["engineeringScore", "Engineering score"],
                ["analyticsScore", "Analytics score"],
                ["aiScore", "AI score"],
                ["learningDifficulty", "Learning difficulty"],
              ] as const
            ).map(([field, label]) => (
              <label key={field} style={{ display: "grid", gap: 4 }}>
                <span>{label}</span>
                <input
                  disabled={field === "id" && selectedId !== NEW_ID}
                  onChange={(event) =>
                    update(field as keyof Draft, event.target.value as never)
                  }
                  value={draft[field]}
                />
              </label>
            ))}
          </div>

          {(
            [
              ["shortDescription", "Short description", 3],
              ["whatYouLearn", "What you learn", 4],
              ["targetFit", "Target fit", 3],
              ["careerPaths", "Career paths (one per line)", 5],
              ["keyDifferences", "Key differences (one per line)", 5],
              ["learningContent", "learningContent JSON", 14],
            ] as const
          ).map(([field, label, rows]) => (
            <label key={field} style={{ display: "grid", gap: 4 }}>
              <span>{label}</span>
              <textarea
                onChange={(event) =>
                  update(field as keyof Draft, event.target.value as never)
                }
                rows={rows}
                spellCheck={field !== "learningContent"}
                value={draft[field]}
              />
            </label>
          ))}

          <section style={{ display: "grid", gap: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <h3 style={{ margin: 0 }}>Passing scores</h3>
              <button
                onClick={() =>
                  update("passingScores", [
                    ...draft.passingScores,
                    { year: "", budget: "", paid: "" },
                  ])
                }
                type="button"
              >
                Add row
              </button>
            </div>
            {draft.passingScores.map((row, index) => (
              <div
                key={index}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr auto",
                  gap: 8,
                }}
              >
                {(["year", "budget", "paid"] as const).map((field) => (
                  <input
                    key={field}
                    onChange={(event) =>
                      update(
                        "passingScores",
                        draft.passingScores.map((item, itemIndex) =>
                          itemIndex === index
                            ? { ...item, [field]: event.target.value }
                            : item,
                        ),
                      )
                    }
                    placeholder={field}
                    value={row[field]}
                  />
                ))}
                <button
                  onClick={() =>
                    update(
                      "passingScores",
                      draft.passingScores.length === 1
                        ? [{ year: "", budget: "", paid: "" }]
                        : draft.passingScores.filter(
                            (_, itemIndex) => itemIndex !== index,
                          ),
                    )
                  }
                  type="button"
                >
                  Remove
                </button>
              </div>
            ))}
          </section>

          <section style={{ display: "grid", gap: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <h3 style={{ margin: 0 }}>Subjects</h3>
              <button
                onClick={() =>
                  update("subjects", [
                    ...draft.subjects,
                    {
                      title: "",
                      subjectBlock: "",
                      department: "",
                      hours: "",
                      referenceUrl: "",
                      sortOrder: String(draft.subjects.length + 1),
                    },
                  ])
                }
                type="button"
              >
                Add row
              </button>
            </div>
            {draft.subjects.map((row, index) => (
              <div
                key={index}
                style={{
                  display: "grid",
                  gap: 8,
                  border: "1px solid #cbd5e1",
                  padding: 12,
                }}
              >
                {(
                  [
                    ["title", "Title"],
                    ["subjectBlock", "Subject block"],
                    ["department", "Department"],
                    ["hours", "Hours"],
                    ["referenceUrl", "Reference URL"],
                    ["sortOrder", "Sort order"],
                  ] as const
                ).map(([field, label]) => (
                  <label key={field} style={{ display: "grid", gap: 4 }}>
                    <span>{label}</span>
                    <input
                      onChange={(event) =>
                        update(
                          "subjects",
                          draft.subjects.map((item, itemIndex) =>
                            itemIndex === index
                              ? { ...item, [field]: event.target.value }
                              : item,
                          ),
                        )
                      }
                      value={row[field]}
                    />
                  </label>
                ))}
                <button
                  onClick={() =>
                    update(
                      "subjects",
                      draft.subjects.length === 1
                        ? [
                            {
                              title: "",
                              subjectBlock: "",
                              department: "",
                              hours: "",
                              referenceUrl: "",
                              sortOrder: "1",
                            },
                          ]
                        : draft.subjects.filter(
                            (_, itemIndex) => itemIndex !== index,
                          ),
                    )
                  }
                  type="button"
                >
                  Remove subject
                </button>
              </div>
            ))}
          </section>
        </form>
      </div>
    </section>
  );
}
