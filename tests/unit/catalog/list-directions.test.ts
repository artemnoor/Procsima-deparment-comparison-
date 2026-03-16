import { listDirections } from "@/modules/catalog";
import type { DirectionCatalogRepository } from "@/modules/catalog";

describe("listDirections", () => {
  it("delegates direction listing to the repository", async () => {
    const repository: DirectionCatalogRepository = {
      listDirections: async () => [
        {
          id: "direction-1",
          slug: "software-engineering",
          title: "Software Engineering",
          shortDescription: "Build software systems.",
          programFocus: "software",
          learningDifficulty: 4,
        },
      ],
    };

    await expect(listDirections(repository)).resolves.toEqual([
      {
        id: "direction-1",
        slug: "software-engineering",
        title: "Software Engineering",
        shortDescription: "Build software systems.",
        programFocus: "software",
        learningDifficulty: 4,
      },
    ]);
  });
});
