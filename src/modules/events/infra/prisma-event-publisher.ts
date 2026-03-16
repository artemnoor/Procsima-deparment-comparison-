import type { EventType, PrismaClient } from "@prisma/client";

import type { DomainEvent } from "@/shared/kernel/events";

import type { EventPublisher } from "../domain/event-publisher";

function toPrismaEventType(type: DomainEvent["type"]): EventType {
  return type;
}

export class PrismaEventPublisher implements EventPublisher {
  constructor(private readonly prisma: PrismaClient) {}

  async publish<TType extends DomainEvent["type"]>(
    event: DomainEvent<TType>,
  ): Promise<void> {
    await this.prisma.event.create({
      data: {
        type: toPrismaEventType(event.type),
        userId: event.userId,
        directionId: event.directionId,
        payload: event.payload,
        createdAt: new Date(event.occurredAt),
      },
    });
  }
}
