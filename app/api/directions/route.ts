import { NextResponse } from "next/server";

import { prisma } from "@/app/db";
import {
  listDirections,
  PrismaDirectionCatalogRepository,
} from "@/modules/catalog";
import { publishEvent, PrismaEventPublisher } from "@/modules/events";
import { createDomainEvent } from "@/shared/kernel/events";

export async function GET() {
  const repository = new PrismaDirectionCatalogRepository(prisma);
  const publisher = new PrismaEventPublisher(prisma);

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
