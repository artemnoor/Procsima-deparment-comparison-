import type { DomainEvent } from "@/shared/kernel/events";

import type { EventPublisher } from "../domain/event-publisher";

export async function publishEvent<TType extends DomainEvent["type"]>(
  publisher: EventPublisher,
  event: DomainEvent<TType>,
): Promise<void> {
  await publisher.publish(event);
}
