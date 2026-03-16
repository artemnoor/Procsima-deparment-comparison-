import {
  buildComparisonSelectionPath,
  getComparisonPageData,
} from "@/modules/comparison";
import type { DirectionComparisonRepository } from "@/modules/comparison";
import { MockDirectionComparisonRepository } from "@/modules/comparison";

describe("getComparisonPageData", () => {
  it("returns empty state when no direction ids are provided", async () => {
    const repository = new MockDirectionComparisonRepository();

    const result = await getComparisonPageData(repository, {});

    expect(result.state).toBe("empty");
    expect(result.selection.directionIds).toEqual([]);
    expect(result.comparison).toBeNull();
  });

  it("returns ready state with comparison data for a valid selection", async () => {
    const repository = new MockDirectionComparisonRepository();

    const result = await getComparisonPageData(repository, {
      ids: ["direction-09-02-01", "direction-09-02-07"],
      source: "catalog",
    });

    expect(result.state).toBe("ready");
    expect(result.selection.source).toBe("catalog");
    expect(result.directions).toHaveLength(2);
    expect(result.comparison?.directionIds).toEqual([
      "direction-09-02-01",
      "direction-09-02-07",
    ]);
    expect(result.comparison?.comparedFields).toContain("subjectBlocks");
  });

  it("preserves the requested direction order in comparison output", async () => {
    const repository = new MockDirectionComparisonRepository();

    const result = await getComparisonPageData(repository, {
      ids: ["direction-10-02-05", "direction-09-02-01"],
      source: "catalog",
    });

    expect(result.state).toBe("ready");
    expect(result.directions.map((direction) => direction.id)).toEqual([
      "direction-10-02-05",
      "direction-09-02-01",
    ]);
    expect(result.comparison?.directionIds).toEqual([
      "direction-10-02-05",
      "direction-09-02-01",
    ]);
  });

  it("returns missing-directions state when some ids cannot be resolved", async () => {
    const repository: DirectionComparisonRepository = {
      async findDirectionsByIds(directionIds) {
        const mockRepository = new MockDirectionComparisonRepository();
        const resolvedDirections = await mockRepository.findDirectionsByIds(directionIds);

        return resolvedDirections.slice(0, 1);
      },
    };

    const result = await getComparisonPageData(repository, {
      ids: ["direction-09-02-01", "direction-09-02-07"],
      source: "comparison-page",
    });

    expect(result.state).toBe("missing-directions");
    expect(result.directions).toHaveLength(1);
    expect(result.comparison).toBeNull();
  });

  it("builds a page-local selection path for add or remove flows", () => {
    const result = buildComparisonSelectionPath(
      "/directions",
      ["direction-09-02-01", "direction-09-02-07"],
      "catalog",
    );

    expect(result).toBe(
      "/directions?ids=direction-09-02-01%2Cdirection-09-02-07&source=catalog",
    );
  });

  it("drops search params when the selection is cleared", () => {
    const result = buildComparisonSelectionPath(
      "/directions/program-09-02-07",
      [],
      "direction-detail",
    );

    expect(result).toBe("/directions/program-09-02-07");
  });
});
