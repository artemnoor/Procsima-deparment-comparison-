import type { DomainEvent } from "@/shared/kernel/events";

import type { EventPublisher } from "../domain/event-publisher";

export class NoopEventPublisher implements EventPublisher {
  async publish<TType extends DomainEvent["type"]>(
    _event: DomainEvent<TType>,
  ): Promise<void> {
    return Promise.resolve();
  }
}
