import { EventListeners, SocketEvent, SocketNamespace } from './events';

export enum SocketStatus {
  CONNECTING = 0,
  CONNECTED = 1,
  DISCONNECTED = 2,
  RECONECTING = 3,
}

export type EventFilter = string[] | ((event: string) => boolean);

export type SocketOptions = Readonly<{
  namespace?: SocketNamespace;
  listeners?: SocketListeners;
  filter?: EventFilter;
  setStatus: (status: SocketStatus) => void;
  setMessage: (message: unknown) => void;
}>;

export type SocketListeners = Readonly<{
  onConnect?: () => void;
  onDisconnect?: () => void;
  onMessage?: <E extends SocketEvent>(
    event: E,
    data: EventListeners[E]
  ) => void;
}>;

export type SocketSubscriber = Readonly<{
  url: string;
  listeners?: SocketListeners;
  filter?: EventFilter;
  setStatus: (status: SocketStatus) => void;
  setMessage: (message: unknown) => void;
}>;
