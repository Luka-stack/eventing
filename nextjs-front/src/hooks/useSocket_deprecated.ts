import { Socket } from 'socket.io-client';
import { useCallback, useEffect, useRef, useState } from 'react';

import { connectOrJoin } from '@/libs/socket/connection';
import {
  SocketNamespace,
  SocketEvent,
  EventEmitters,
} from '@/libs/socket/events';
import {
  SocketListeners,
  EventFilter,
  SocketStatus,
} from '@/libs/socket/types';

type Props = SocketListeners & {
  namespace?: SocketNamespace;
  filter?: EventFilter;
};

export function useSocket_deprecated(options?: Props) {
  const optionsCache = useRef({ ...options }).current;
  const socket = useRef<Socket | null>(null);
  const startRef = useRef<Function>(() => {});

  const [lastMessage, setLastMessage] = useState<unknown | null>(null);
  const [status, setStatus] = useState<SocketStatus>(SocketStatus.DISCONNECTED);

  const send = useCallback(
    <E extends SocketEvent>(type: E, data: EventEmitters[E]) => {
      if (status === SocketStatus.CONNECTED && socket.current) {
        socket.current.emit(type, data);
      }
    },
    [status]
  );

  useEffect(() => {
    let closing = false;
    let unsubscribe = () => {};

    const start = () => {
      if (closing) return;

      const { onConnect, onDisconnect, onMessage, ...rest } =
        optionsCache || {};

      const connection = connectOrJoin({
        ...rest,
        listeners: {
          onConnect,
          onDisconnect,
          onMessage,
        },
        setStatus(status: SocketStatus) {
          if (!closing) setStatus(status);
        },
        setMessage(message: unknown) {
          if (!closing) setLastMessage(message);
        },
      });

      unsubscribe = connection.unsubscribe;
      socket.current = connection.socket;
    };

    startRef.current = () => {
      if (closing) return;

      unsubscribe();
      start();
    };

    start();

    return () => {
      closing = true;
      unsubscribe();
    };
  }, [optionsCache]);

  return { status, lastMessage, send };
}
