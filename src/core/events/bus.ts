/**
 * EventBus — a small but real typed pub/sub used by services, workflows,
 * the audit log, search indexer and the Operations Wall.
 *
 * Process-local. In a multi-instance deployment, swap this for Redis pub/sub
 * or NATS without changing call sites.
 */

import type { DomainEvent, EventName, EventByName } from './types'

type Handler<N extends EventName> = (event: EventByName<N>) => void | Promise<void>
type WildcardHandler = (event: DomainEvent) => void | Promise<void>

type AnyHandler = (event: DomainEvent) => void | Promise<void>

class EventBusImpl {
  private handlers = new Map<EventName, Set<AnyHandler>>()
  private wildcards = new Set<WildcardHandler>()
  private history: DomainEvent[] = []
  private readonly maxHistory = 200

  on<N extends EventName>(name: N, handler: Handler<N>): () => void {
    if (!this.handlers.has(name)) this.handlers.set(name, new Set())
    const set = this.handlers.get(name)!
    set.add(handler as AnyHandler)
    return () => set.delete(handler as AnyHandler)
  }

  onAny(handler: WildcardHandler): () => void {
    this.wildcards.add(handler)
    return () => this.wildcards.delete(handler)
  }

  async emit<N extends EventName>(
    name: N,
    payload: EventByName<N>['payload'],
    meta: { actorId?: string; source?: string } = {}
  ): Promise<void> {
    const event = {
      name,
      payload,
      actorId: meta.actorId,
      source: meta.source ?? 'system',
      occurredAt: new Date().toISOString(),
    } as EventByName<N>

    this.history.push(event)
    if (this.history.length > this.maxHistory) this.history.shift()

    const direct = this.handlers.get(name)
    if (direct) {
      for (const handler of direct) {
        try {
          await handler(event as DomainEvent)
        } catch (err) {
          console.error(`[EventBus] handler failed for ${name}`, err)
        }
      }
    }
    for (const handler of this.wildcards) {
      try {
        await handler(event)
      } catch (err) {
        console.error(`[EventBus] wildcard handler failed for ${name}`, err)
      }
    }
  }

  getRecent(limit = 50): DomainEvent[] {
    return this.history.slice(-limit).reverse()
  }

  /**
   * Remove every registered handler. Used by bootstrap to guarantee that
   * subscribers are installed exactly once per process — even when the dev
   * server hot-reloads modules while this (global) bus instance persists.
   */
  clearAllHandlers(): void {
    this.handlers.clear()
    this.wildcards.clear()
  }
}

declare global {
  var __pflegenest_eventBus__: EventBusImpl | undefined
}

export const eventBus: EventBusImpl =
  globalThis.__pflegenest_eventBus__ ?? new EventBusImpl()

if (!globalThis.__pflegenest_eventBus__) {
  globalThis.__pflegenest_eventBus__ = eventBus
}
