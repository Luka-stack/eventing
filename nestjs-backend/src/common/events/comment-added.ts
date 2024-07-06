import { Comment } from '@prisma/client';
import { Event } from 'src/utils';

export type CommentAdded = Event<
  'CommentAdded',
  {
    postId: string;
    postTitle: string;
    comment: Comment;
  }
>;
