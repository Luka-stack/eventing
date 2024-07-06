'use client';

import clsx from 'clsx';
import {
  Text,
  Container,
  Image,
  Title,
  Avatar,
  Group,
  Paper,
  Divider,
  Textarea,
  Button,
  Stack,
} from '@mantine/core';

import classes from './ThePost.module.css';
import { Post, Comment } from '@/types';
import { FormEvent, useState } from 'react';
import { createComment } from '@/actions';
import { useAuth } from '@/hooks/useAuth';
import { useSocket } from '@/hooks/useSocket';
import { ServerEvent } from '@/events';

type Props = {
  post: Post;
  userId: string;
};

export function ThePost({ post, userId }: Props) {
  const user = useAuth();
  const [comments, setComments] = useState<Comment[]>(post.comments);

  useSocket({
    filters: ['CommentAdded'],
    onMessage: ({ type, data }: ServerEvent) => {
      if (type === 'CommentAdded') {
        setComments((prev) => [...prev, data.comment]);
      }
    },
  });

  const addComment = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;

    const formData = new FormData(event.currentTarget);
    const data = {
      content: formData.get('message') as string,
      postId: post.id,
    };

    const timestamp = Date.now();

    const comment: Comment = {
      id: `optimistic-${timestamp}`,
      content: data.content,
      createdAt: new Date(timestamp).toISOString(),
      authorId: userId,
      postId: post.id,
      author: {
        id: userId,
        email: user!.email,
        nickname: user!.nickname,
      },
    };

    setComments((prev) => [...prev, comment]);

    await createComment(data, userId);
    form.reset();
  };

  return (
    <Container size="xl" my="md">
      <div className={clsx('border rounded-md overflow-hidden', classes.image)}>
        <Image src={post.thumbnail} height={180} />
      </div>

      <Stack gap={0} mt="lg">
        <Title order={1}>{post.title}</Title>
        <Text size="lg">{post.description}</Text>
      </Stack>

      <Group mt="lg">
        <Avatar
          src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-8.png"
          radius="xl"
        />

        <div style={{ flex: 1 }}>
          <Text size="sm" fw={500}>
            {post.author.nickname}
          </Text>

          <Text c="dimmed" size="xs">
            {post.author.email}
          </Text>
        </div>
      </Group>

      <Divider my="md" />

      <Text mt="lg">{post.content}</Text>

      <Divider my="md" />

      <Title order={2}>Comments</Title>

      <form onSubmit={addComment}>
        <Textarea
          mt="md"
          label="Your Comment"
          placeholder="Enter your comment here..."
          maxRows={10}
          minRows={3}
          autosize
          name="message"
          variant="filled"
        />

        <Button size="sm" fullWidth mt="md" type="submit">
          Add comment
        </Button>
      </form>

      <Stack>
        {comments.map((comment) => (
          <Paper
            withBorder
            key={comment.id}
            radius="md"
            className={classes.comment}
            mt="xl"
            p="md"
          >
            <Group>
              <Avatar
                src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-2.png"
                alt="Jacob Warnhalter"
                radius="xl"
              />
              <div>
                <Text fz="sm">{comment.author.nickname}</Text>
                <Text fz="xs" c="dimmed">
                  {new Date(comment.createdAt).toLocaleDateString()}{' '}
                  {new Date(comment.createdAt).toLocaleTimeString()}
                </Text>
              </div>
            </Group>

            <Text mt="sm">{comment.content}</Text>
          </Paper>
        ))}
      </Stack>
    </Container>
  );
}
