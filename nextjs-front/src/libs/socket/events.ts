export enum SocketNamespace {
  EVENTS = 'events',
  EVENTS1 = 'events1',
  EVENTS2 = 'events2',
}

export enum SocketEvent {
  EVENTS = 'events',
  EVENTS1 = 'event1',
  EVENTS2 = 'event2',
}

export type EventEmitters = {
  [SocketEvent.EVENTS]: { message: string };
  [SocketEvent.EVENTS1]: string;
  [SocketEvent.EVENTS2]: number;
};

export type EventListeners = {
  [SocketEvent.EVENTS]: { message: string };
  [SocketEvent.EVENTS1]: string;
  [SocketEvent.EVENTS2]: number;
};
