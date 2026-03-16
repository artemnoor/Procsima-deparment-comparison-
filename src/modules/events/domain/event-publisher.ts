import type { DomainEvent } from "@/shared/kernel/events";

export interface EventPublisher {
  publish<TType extends DomainEvent["type"]>(
    event: DomainEvent<TType>,
  ): Promise<void>;
}
