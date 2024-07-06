export enum Events {
  COMMENT_ADDED = 'comment-added',
  POST_ADDED = 'post-added',
  POST_CREATING = 'post-creating',
  POST_CREATED = 'post-created',
}

export type Post = {
  id: string;
  title: string;
  thumbnail: string;
  description: string;
  content: string;
  authorId: string;
  author: {
    id: string;
    email: string;
    nickname: string;
  };
  comments: Comment[];
  groups: [
    {
      name: string;
    },
    {
      name: string;
    }
  ];
};

export type Comment = {
  id: string;
  content: string;
  createdAt: string;
  authorId: string;
  postId: string;
  author: {
    id: string;
    email: string;
    nickname: string;
  };
};

export type User = {
  id: string;
  email: string;
  nickname: string;
};

export type ServerEvent<T = unknown> = {
  id: string;
  data: T;
};

export type Notification = {
  id: string;
  seen: boolean;
  text: string;
  link?: string;
  pending: boolean;
};

export type Group = {
  name: string;
  subscribed: boolean;
};
