import { NextResponse } from "next/server";

import { createEventPublisher } from "@/app/event-publisher";
import { createDirectionCatalogRepository } from "@/app/public-direction-data";
import { listDirections } from "@/modules/catalog";
import { publishEvent } from "@/modules/events";
import { createDomainEvent } from "@/shared/kernel/events";

export async function GET() {
  const repository = createDirectionCatalogRepository();
  const publisher = createEventPublisher();

  const directions = await listDirections(repository);

  await publishEvent(
    publisher,
    createDomainEvent({
      type: "page_opened",
      payload: {
        route: "/directions",
        contour: "public",
        source: "api",
      },
    }),
  );

  return NextResponse.json({
    items: directions,
    total: directions.length,
  });
}
