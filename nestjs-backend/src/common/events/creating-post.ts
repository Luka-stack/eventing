import type { Event } from '../../utils';

export type CreatingPost = Event<
  'CreatingPost',
  {
    queueId: string;
    title: string;
  }
>;
