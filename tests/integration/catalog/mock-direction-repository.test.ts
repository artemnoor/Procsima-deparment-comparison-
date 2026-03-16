import { describe, expect, it } from "vitest";

import { MockDirectionCatalogRepository } from "@/modules/catalog";

describe("MockDirectionCatalogRepository", () => {
  it("lists mock-backed directions in title order", async () => {
    const repository = new MockDirectionCatalogRepository();

    const directions = await repository.listDirections();

    expect(directions).toHaveLength(4);
    expect(directions.map((direction) => direction.slug)).toEqual([
      "program-09-02-07",
      "program-09-02-01",
      "program-10-02-05",
      "program-09-02-06",
    ]);
  });
});
