import { describe, expect, it } from "vitest";

import { MockDirectionDetailsRepository } from "@/modules/direction-pages";

describe("MockDirectionDetailsRepository", () => {
  it("returns a mapped detail record from the mock-backed source", async () => {
    const repository = new MockDirectionDetailsRepository();

    const direction = await repository.findDirectionBySlug("program-09-02-07");

    expect(direction).not.toBeNull();
    expect(direction?.id).toBe("direction-09-02-07");
    expect(direction?.subjects).toHaveLength(4);
    expect(direction?.careerPaths).toContain("Software Developer");
  });
});
