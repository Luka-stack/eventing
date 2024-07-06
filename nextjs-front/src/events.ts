import { Post, Comment } from './types';

export type EventMetaData = Readonly<{ eventId: string }>;

export type EventTypeOf<T extends Event> = T['type'];
export type EventDataOf<T extends Event> = T['data'];

export type Event<
  EventType extends string = string,
  EventData extends Record<string, unknown> = Record<string, unknown>
> = Readonly<{ type: EventType; data: Readonly<EventData> & EventMetaData }>;

export type ServerEvent =
  | PostCreated
  | PostCreationFailed
  | CommentAdded
  | CreatingPost;

export type ServerEventTypes = ServerEvent['type'];

export type CreatingPost = Event<
  'CreatingPost',
  { queueId: string; title: string }
>;

export type CommentAdded = Event<
  'CommentAdded',
  {
    postId: string;
    postTitle: string;
    comment: Comment;
  }
>;

export type PostCreated = Event<'PostCreated', { post: Post; queueId: string }>;

export type PostCreationFailed = Event<
  'PostCreationFailed',
  {
    title: string;
    error: string;
  }
>;

export const event = <EventType extends Event>(
  type: EventTypeOf<EventType>,
  data: EventDataOf<EventType>
): EventType => {
  return { type, data } as EventType;
};
