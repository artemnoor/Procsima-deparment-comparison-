"use client";

import Link from "next/link";
import type { PromotionStatus } from "@prisma/client";
import type { FormEvent } from "react";
import { useMemo, useState, useTransition } from "react";

import type {
  DirectionPromotionDirectionOption,
  DirectionPromotionSummary,
} from "../domain/direction-promotion";

type DirectionPromotionsPanelProps = {
  initialPromotions: DirectionPromotionSummary[];
  directionOptions: DirectionPromotionDirectionOption[];
};

type PromotionResponse =
  | {
      status: "ok";
      promotion: DirectionPromotionSummary;
    }
  | {
      status: "invalid" | "forbidden" | "not-found";
      reason: string;
    };

type PromotionListResponse =
  | {
      status: "ok";
      promotions: DirectionPromotionSummary[];
    }
  | {
      status: "invalid" | "forbidden";
      reason: string;
    };

type CreatePromotionDraft = {
  directionId: string;
  status: PromotionStatus;
  priority: string;
  note: string;
  startsAt: string;
  endsAt: string;
};

type UpdatePromotionDraft = {
  status: PromotionStatus;
  priority: string;
  note: string;
  startsAt: string;
  endsAt: string;
};

const promotionStatuses: PromotionStatus[] = ["draft", "active", "inactive"];

function toDatetimeLocalInput(value: string | null): string {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);

  return localDate.toISOString().slice(0, 16);
}

function createDraftFromPromotion(
  promotion: DirectionPromotionSummary,
): UpdatePromotionDraft {
  return {
    status: promotion.status,
    priority: String(promotion.priority),
    note: promotion.note,
    startsAt: toDatetimeLocalInput(promotion.startsAt),
    endsAt: toDatetimeLocalInput(promotion.endsAt),
  };
}

export function DirectionPromotionsPanel(props: DirectionPromotionsPanelProps) {
  const [promotions, setPromotions] = useState(props.initialPromotions);
  const [statusFilter, setStatusFilter] = useState<
    PromotionStatus | "all" | "active-only"
  >("all");
  const [sortMode, setSortMode] = useState<
    "priority-asc" | "priority-desc" | "title-asc"
  >("priority-asc");
  const [createDraft, setCreateDraft] = useState<CreatePromotionDraft>({
    directionId: props.directionOptions[0]?.id ?? "",
    status: "draft",
    priority: "100",
    note: "",
    startsAt: "",
    endsAt: "",
  });
  const [drafts, setDrafts] = useState<Record<string, UpdatePromotionDraft>>(
    Object.fromEntries(
      props.initialPromotions.map((promotion) => [
        promotion.id,
        createDraftFromPromotion(promotion),
      ]),
    ),
  );
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const statusCounts = useMemo(
    () => ({
      total: promotions.length,
      active: promotions.filter((promotion) => promotion.status === "active")
        .length,
      draft: promotions.filter((promotion) => promotion.status === "draft")
        .length,
      inactive: promotions.filter(
        (promotion) => promotion.status === "inactive",
      ).length,
    }),
    [promotions],
  );

  const filteredPromotions = useMemo(() => {
    const basePromotions =
      statusFilter === "all"
        ? promotions
        : statusFilter === "active-only"
          ? promotions.filter((promotion) => promotion.isCurrentlyActive)
          : promotions.filter((promotion) => promotion.status === statusFilter);

    return [...basePromotions].sort((left, right) => {
      if (sortMode === "priority-desc") {
        return right.priority - left.priority;
      }

      if (sortMode === "title-asc") {
        return left.directionTitle.localeCompare(right.directionTitle, "ru");
      }

      return left.priority - right.priority;
    });
  }, [promotions, sortMode, statusFilter]);

  async function patchPromotion(
    promotionId: string,
    body: Record<string, string | number | null>,
    successMessage: string,
  ) {
    const response = await fetch(`/api/admin/promotions/${promotionId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const payload = (await response.json()) as PromotionResponse;

    if (!response.ok || payload.status !== "ok") {
      setFeedback(
        "reason" in payload ? payload.reason : "Could not update promotion.",
      );
      return;
    }

    await refreshPromotions(statusFilter);
    setFeedback(successMessage);
  }

  async function refreshPromotions(filter: typeof statusFilter) {
    const searchParams = new URLSearchParams();

    if (filter === "active-only") {
      searchParams.set("activeOnly", "true");
    } else if (filter !== "all") {
      searchParams.set("status", filter);
    }

    const response = await fetch(
      `/api/admin/promotions${searchParams.size > 0 ? `?${searchParams.toString()}` : ""}`,
      {
        cache: "no-store",
      },
    );
    const payload = (await response.json()) as PromotionListResponse;

    if (!response.ok || payload.status !== "ok") {
      throw new Error("Could not refresh promotion list.");
    }

    setPromotions(payload.promotions);
    setDrafts(
      Object.fromEntries(
        payload.promotions.map((promotion) => [
          promotion.id,
          createDraftFromPromotion(promotion),
        ]),
      ),
    );
  }

  function handleCreateSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedback(null);

    startTransition(async () => {
      const response = await fetch("/api/admin/promotions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          directionId: createDraft.directionId,
          status: createDraft.status,
          priority: Number(createDraft.priority),
          note: createDraft.note,
          startsAt: createDraft.startsAt || undefined,
          endsAt: createDraft.endsAt || undefined,
        }),
      });
      const payload = (await response.json()) as PromotionResponse;

      if (!response.ok || payload.status !== "ok") {
        setFeedback(
          "reason" in payload ? payload.reason : "Could not save promotion.",
        );
        return;
      }

      await refreshPromotions(statusFilter);
      setCreateDraft((current) => ({
        ...current,
        note: "",
        startsAt: "",
        endsAt: "",
      }));
      setFeedback("Promotion saved.");
    });
  }

  function handleUpdateSubmit(
    event: FormEvent<HTMLFormElement>,
    promotionId: string,
  ) {
    event.preventDefault();
    setFeedback(null);
    const draft = drafts[promotionId];

    if (!draft) {
      return;
    }

    startTransition(async () => {
      const response = await fetch(`/api/admin/promotions/${promotionId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: draft.status,
          priority: Number(draft.priority),
          note: draft.note,
          startsAt: draft.startsAt || null,
          endsAt: draft.endsAt || null,
        }),
      });
      const payload = (await response.json()) as PromotionResponse;

      if (!response.ok || payload.status !== "ok") {
        setFeedback(
          "reason" in payload ? payload.reason : "Could not update promotion.",
        );
        return;
      }

      await refreshPromotions(statusFilter);
      setFeedback("Promotion updated.");
    });
  }

  function handleQuickStatusChange(
    promotionId: string,
    status: PromotionStatus,
    successMessage: string,
  ) {
    setFeedback(null);

    startTransition(async () => {
      await patchPromotion(
        promotionId,
        {
          status,
        },
        successMessage,
      );
    });
  }

  return (
    <div className="stack">
      <section className="card">
        <div className="sectionEyebrow">Internal contour</div>
        <h2 className="sectionTitle">Direction promotions</h2>
        <p className="muted">
          Editorial promotion lives separately from recommendation logic. Use
          this screen to manage priority, status, and active windows without
          changing deterministic profile-test ranking.
        </p>
        <div className="promotionBadgeRow">
          <span className="chipMuted">All: {statusCounts.total}</span>
          <span className="chipMuted">Active: {statusCounts.active}</span>
          <span className="chipMuted">Draft: {statusCounts.draft}</span>
          <span className="chipMuted">Inactive: {statusCounts.inactive}</span>
        </div>
        <div className="toolbarRow">
          <label className="formField">
            <span className="fieldLabel">Filter</span>
            <select
              className="input"
              onChange={(event) =>
                setStatusFilter(
                  event.target.value as PromotionStatus | "all" | "active-only",
                )
              }
              value={statusFilter}
            >
              <option value="all">All promotions</option>
              <option value="active-only">Currently active</option>
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </label>
          <label className="formField">
            <span className="fieldLabel">Sort</span>
            <select
              className="input"
              onChange={(event) =>
                setSortMode(
                  event.target.value as
                    | "priority-asc"
                    | "priority-desc"
                    | "title-asc",
                )
              }
              value={sortMode}
            >
              <option value="priority-asc">Priority: highest first</option>
              <option value="priority-desc">Priority: lowest first</option>
              <option value="title-asc">Title: A-Z</option>
            </select>
          </label>
          <Link className="shellActionLink" href="/api/admin/promotions">
            Open API JSON
          </Link>
        </div>
        <p className="muted">
          Lower priority number means stronger editorial emphasis.
        </p>
        {feedback ? <p className="feedbackNote">{feedback}</p> : null}
      </section>

      <section className="card">
        <h3 className="cardTitle">Create or replace promotion</h3>
        <form className="promotionForm" onSubmit={handleCreateSubmit}>
          <label className="formField">
            <span className="fieldLabel">Direction</span>
            <select
              className="input"
              onChange={(event) =>
                setCreateDraft((current) => ({
                  ...current,
                  directionId: event.target.value,
                }))
              }
              value={createDraft.directionId}
            >
              {props.directionOptions.map((direction) => (
                <option key={direction.id} value={direction.id}>
                  {direction.title}
                </option>
              ))}
            </select>
          </label>
          <label className="formField">
            <span className="fieldLabel">Status</span>
            <select
              className="input"
              onChange={(event) =>
                setCreateDraft((current) => ({
                  ...current,
                  status: event.target.value as PromotionStatus,
                }))
              }
              value={createDraft.status}
            >
              {promotionStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>
          <label className="formField">
            <span className="fieldLabel">Priority</span>
            <input
              className="input"
              min="1"
              onChange={(event) =>
                setCreateDraft((current) => ({
                  ...current,
                  priority: event.target.value,
                }))
              }
              type="number"
              value={createDraft.priority}
            />
          </label>
          <label className="formField promotionFormWide">
            <span className="fieldLabel">Editorial note</span>
            <textarea
              className="input textarea"
              onChange={(event) =>
                setCreateDraft((current) => ({
                  ...current,
                  note: event.target.value,
                }))
              }
              rows={3}
              value={createDraft.note}
            />
          </label>
          <label className="formField">
            <span className="fieldLabel">Starts at</span>
            <input
              className="input"
              onChange={(event) =>
                setCreateDraft((current) => ({
                  ...current,
                  startsAt: event.target.value,
                }))
              }
              type="datetime-local"
              value={createDraft.startsAt}
            />
          </label>
          <label className="formField">
            <span className="fieldLabel">Ends at</span>
            <input
              className="input"
              onChange={(event) =>
                setCreateDraft((current) => ({
                  ...current,
                  endsAt: event.target.value,
                }))
              }
              type="datetime-local"
              value={createDraft.endsAt}
            />
          </label>
          <div className="promotionActions">
            <button className="actionButton" disabled={isPending} type="submit">
              {isPending ? "Saving..." : "Save promotion"}
            </button>
          </div>
        </form>
      </section>

      <section className="stack">
        {filteredPromotions.length === 0 ? (
          <article className="card">
            <h3 className="cardTitle">No promotions found</h3>
            <p className="muted">
              Adjust the filter or create the first promotion from the form
              above.
            </p>
          </article>
        ) : (
          filteredPromotions.map((promotion) => {
            const draft =
              drafts[promotion.id] ?? createDraftFromPromotion(promotion);

            return (
              <article className="card" key={promotion.id}>
                <div className="promotionCardHeader">
                  <div>
                    <h3 className="cardTitle">{promotion.directionTitle}</h3>
                    <p className="muted">Slug: {promotion.directionSlug}</p>
                    <p className="muted">Priority: {promotion.priority}</p>
                  </div>
                  <div className="promotionBadgeRow">
                    <span className="chipMuted">
                      Status: {promotion.status}
                    </span>
                    <span className="chipMuted">
                      Active now: {promotion.isCurrentlyActive ? "yes" : "no"}
                    </span>
                  </div>
                </div>

                <div className="quickActionRow">
                  <button
                    className="secondaryButton"
                    disabled={isPending || promotion.status === "active"}
                    onClick={() =>
                      handleQuickStatusChange(
                        promotion.id,
                        "active",
                        "Promotion activated.",
                      )
                    }
                    type="button"
                  >
                    Activate now
                  </button>
                  <button
                    className="secondaryButton"
                    disabled={isPending || promotion.status === "draft"}
                    onClick={() =>
                      handleQuickStatusChange(
                        promotion.id,
                        "draft",
                        "Promotion moved to draft.",
                      )
                    }
                    type="button"
                  >
                    Move to draft
                  </button>
                  <button
                    className="secondaryButton"
                    disabled={isPending || promotion.status === "inactive"}
                    onClick={() =>
                      handleQuickStatusChange(
                        promotion.id,
                        "inactive",
                        "Promotion deactivated.",
                      )
                    }
                    type="button"
                  >
                    Deactivate
                  </button>
                </div>

                <form
                  className="promotionForm"
                  onSubmit={(event) => handleUpdateSubmit(event, promotion.id)}
                >
                  <label className="formField">
                    <span className="fieldLabel">Status</span>
                    <select
                      className="input"
                      onChange={(event) =>
                        setDrafts((current) => ({
                          ...current,
                          [promotion.id]: {
                            ...draft,
                            status: event.target.value as PromotionStatus,
                          },
                        }))
                      }
                      value={draft.status}
                    >
                      {promotionStatuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="formField">
                    <span className="fieldLabel">Priority</span>
                    <input
                      className="input"
                      min="1"
                      onChange={(event) =>
                        setDrafts((current) => ({
                          ...current,
                          [promotion.id]: {
                            ...draft,
                            priority: event.target.value,
                          },
                        }))
                      }
                      type="number"
                      value={draft.priority}
                    />
                  </label>
                  <label className="formField promotionFormWide">
                    <span className="fieldLabel">Editorial note</span>
                    <textarea
                      className="input textarea"
                      onChange={(event) =>
                        setDrafts((current) => ({
                          ...current,
                          [promotion.id]: {
                            ...draft,
                            note: event.target.value,
                          },
                        }))
                      }
                      rows={3}
                      value={draft.note}
                    />
                  </label>
                  <label className="formField">
                    <span className="fieldLabel">Starts at</span>
                    <input
                      className="input"
                      onChange={(event) =>
                        setDrafts((current) => ({
                          ...current,
                          [promotion.id]: {
                            ...draft,
                            startsAt: event.target.value,
                          },
                        }))
                      }
                      type="datetime-local"
                      value={draft.startsAt}
                    />
                  </label>
                  <label className="formField">
                    <span className="fieldLabel">Ends at</span>
                    <input
                      className="input"
                      onChange={(event) =>
                        setDrafts((current) => ({
                          ...current,
                          [promotion.id]: {
                            ...draft,
                            endsAt: event.target.value,
                          },
                        }))
                      }
                      type="datetime-local"
                      value={draft.endsAt}
                    />
                  </label>
                  <div className="promotionActions">
                    <button
                      className="actionButton"
                      disabled={isPending}
                      type="submit"
                    >
                      {isPending ? "Saving..." : "Update promotion"}
                    </button>
                  </div>
                </form>
              </article>
            );
          })
        )}
      </section>
    </div>
  );
}
