import { Post } from '@prisma/client';
import type { Event } from '../../utils';

export type PostCreated = Event<'PostCreated', { post: Post; queueId: string }>;
