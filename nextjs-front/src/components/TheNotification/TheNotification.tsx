'use client';

import { Progress } from '@mantine/core';
import { IconArrowNarrowRight, IconX } from '@tabler/icons-react';

import { Notification } from '@/types';
import Link from 'next/link';

type Props = {
  notification: Notification;
  onClick: (id: Notification['id']) => void;
  onClose: (id: Notification['id']) => void;
};

export function TheNotification({ notification, onClose, onClick }: Props) {
  return (
    <button className="px-4 min-h-5 my-2 text-left">
      <div className="grid w-full h-full gap-1">
        <div className="flex justify-between">
          <div className="flex space-x-2 pr-4">
            {!notification.pending && !notification.seen ? (
              <button
                onClick={() => onClick(notification.id)}
                className="w-2 h-full bg-orange-500 rounded-sm"
              />
            ) : null}

            <p className="my-auto text-wrap">{notification.text}</p>
          </div>

          {!notification.pending ? (
            <div className="grid items-center">
              {notification.link ? (
                <Link
                  href={notification.link}
                  className="bg-black/20 rounded-md p-2 hover:bg-black/30 active:scale-95 transition-all mb-0.5"
                >
                  <IconArrowNarrowRight className="size-4" />
                </Link>
              ) : null}

              <button
                onClick={() => onClose(notification.id)}
                className="bg-black/20 rounded-md p-2 hover:bg-black/30 active:scale-95 transition-all"
              >
                <IconX className="size-4" />
              </button>
            </div>
          ) : null}
        </div>

        {notification.pending ? (
          <Progress color="orange" radius="xl" value={100} animated />
        ) : null}
      </div>
    </button>
  );
}
