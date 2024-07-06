'use client';

import Link from 'next/link';
import { IconBell } from '@tabler/icons-react';
import { Fragment, useMemo } from 'react';
import { Box, Button, Group, Menu, Title } from '@mantine/core';

import classes from './TheHeader.module.css';
import { useAuth } from '@/hooks/useAuth';
import { useSocket } from '@/hooks/useSocket';
import { TheNotification } from '../TheNotification/TheNotification';
import { useNotification } from '@/hooks/useNotification';
import type { ServerEvent } from '@/events';

export function TheHeader() {
  const user = useAuth();

  const { notifications, add, remove, markAsSeen } = useNotification();

  const newNotifications = useMemo(() => {
    return notifications.some((notification) => !notification.seen);
  }, [notifications]);

  const { readyState } = useSocket({
    filters: ['CreatingPost', 'PostCreated', 'CommentAdded'],
    onMessage: ({ type, data }: ServerEvent) => {
      switch (type) {
        case 'CreatingPost':
          add(creatingPost(data.queueId, data.title));
          return;

        case 'PostCreated':
          remove(data.queueId);
          add(postCreated(data.queueId, data.post.id, data.post.title));
          return;

        case 'CommentAdded':
          add(commentAdded(data.eventId, data.postId, data.postTitle));
          return;
      }
    },
  });

  return (
    <Box p="md" className={classes.box}>
      <header>
        <Group justify="space-between">
          <Link href="/">
            <Title order={1} className="flex items-baseline">
              Events
              <div
                data-open={readyState === 2}
                className="h-5 w-5 rounded-full ml-4 data-[open=true]:bg-green-500 data-[open=false]:bg-red-500"
              />
            </Title>
          </Link>

          <Group className="">
            <Link
              href="/"
              className="font-medium text-lg hover:bg-black/10 p-2 rounded-md active:scale-95 transition-all"
            >
              Home
            </Link>

            <Link
              href="/groups"
              className="font-medium text-lg hover:bg-black/10 p-2 rounded-md active:scale-95 transition-all"
            >
              Groups
            </Link>

            <Link
              href="/posts/new"
              className="font-medium text-lg hover:bg-black/10 p-2 rounded-md active:scale-95 transition-all"
            >
              Add Post
            </Link>
          </Group>

          <Group>
            {user ? (
              <Menu shadow="md" width={400} zIndex={9999}>
                <Menu.Target>
                  <Button
                    variant="light"
                    color="gray"
                    className={classes.btn}
                    px={6}
                  >
                    <IconBell
                      stroke={2}
                      color="orange"
                      className={newNotifications ? classes.icon : ''}
                    />
                  </Button>
                </Menu.Target>

                <Menu.Dropdown>
                  <Menu.Label>
                    <Title order={4}>Notifications</Title>
                  </Menu.Label>

                  {notifications.map((notification, index) => (
                    <TheNotification
                      key={index}
                      notification={notification}
                      onClose={remove}
                      onClick={markAsSeen}
                    />
                  ))}
                </Menu.Dropdown>
              </Menu>
            ) : null}

            {user ? (
              <Fragment>
                <Title order={3}>{user.nickname}</Title>
                <Button color="orange" variant="outline">
                  Logout
                </Button>
              </Fragment>
            ) : null}
          </Group>
        </Group>
      </header>
    </Box>
  );
}

function creatingPost(id: string, title: string) {
  return {
    id,
    text: `Your post is being created: ${title}`,
    seen: false,
    pending: true,
  };
}

function postCreated(eventId: string, id: string, title: string) {
  return {
    id: eventId,
    text: `Your post has been added: ${title}`,
    link: `/posts/${id}`,
    seen: false,
    pending: false,
  };
}

function commentAdded(eventId: string, id: string, title: string) {
  return {
    id: eventId,
    text: `New Comment on your post: ${title}`,
    link: `/posts/${id}`,
    seen: false,
    pending: false,
  };
}
