import type { DomainEvent } from "@/shared/kernel/events";
import { logWithLevel } from "@/shared/utils/logging";

import type { EventPublisher } from "../domain/event-publisher";

export async function publishEvent<TType extends DomainEvent["type"]>(
  publisher: EventPublisher,
  event: DomainEvent<TType>,
): Promise<void> {
  logWithLevel("event-publish", "info", "Publishing domain event.", {
    eventType: event.type,
    directionId: event.directionId,
    occurredAt: event.occurredAt,
    payload: event.payload,
  });

  try {
    await publisher.publish(event);

    logWithLevel("event-publish", "info", "Domain event published.", {
      eventType: event.type,
      directionId: event.directionId,
      occurredAt: event.occurredAt,
    });
  } catch (error) {
    logWithLevel("event-publish", "error", "Domain event publish failed.", {
      eventType: event.type,
      directionId: event.directionId,
      occurredAt: event.occurredAt,
      error: error instanceof Error ? error.message : "unknown-error",
    });

    throw error;
  }
}
