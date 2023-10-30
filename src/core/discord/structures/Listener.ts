import { ClientEvents, Collection } from "oceanic.js";

type Events = keyof ClientEvents;

interface ListenerData<Event extends Events> {
  listener: Event;
  execute(...args: ClientEvents[Event]): Promise<void>;
}

export class Listener<K extends Events = Events> {
  public static listeners = new Collection<string, ListenerData<Events>[]>();

  constructor(data: ListenerData<K>) {
    this.#register(data);
  }

  #register(listener: ListenerData<K>) {
    const listeners = Listener.listeners.get(listener.listener) ?? [];
    listeners.push(listener);
    Listener.listeners.set(listener.listener, listeners);
  }
}
