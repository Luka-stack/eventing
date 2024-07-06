export type EventMetaData = Readonly<{ eventId: string }>;

export type EventTypeOf<T extends Event> = T['type'];
export type EventDataOf<T extends Event> = T['data'];

export type Event<
  EventType extends string = string,
  EventData extends Record<string, unknown> = Record<string, unknown>,
> = Readonly<{ type: EventType; data: Readonly<EventData> & EventMetaData }>;

export const event = <EventType extends Event>(
  type: EventTypeOf<EventType>,
  data: Omit<EventDataOf<EventType>, 'eventId'>,
): EventType => {
  return {
    type,
    data: {
      ...data,
      eventId: Date.now().toString(),
    },
  } as EventType;
};
