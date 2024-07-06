import type { Event } from '../../utils';

export type PostCreationFailed = Event<
  'PostCreationFailed',
  {
    title: string;
    error: string;
  }
>;
