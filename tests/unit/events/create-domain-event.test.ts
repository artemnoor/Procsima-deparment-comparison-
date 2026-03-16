import { createDomainEvent } from "@/shared/kernel/events";

describe("createDomainEvent", () => {
  it("creates a typed event with an ISO timestamp", () => {
    const event = createDomainEvent({
      type: "page_opened",
      payload: {
        route: "/directions",
        contour: "public",
        source: "page",
      },
    });

    expect(event.type).toBe("page_opened");
    expect(event.payload.route).toBe("/directions");
    expect(() => new Date(event.occurredAt)).not.toThrow();
    expect(Number.isNaN(Date.parse(event.occurredAt))).toBe(false);
  });
});
