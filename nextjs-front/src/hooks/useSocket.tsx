import { useCallback, useEffect, useRef, useState } from 'react';

import { event, ServerEvent, ServerEventTypes } from '@/events';
import { ConnectionAPI, ImmutableSocket } from '@/libs/socket-manager/manager';

type Props = {
  filters?: ServerEventTypes[];
  namespace?: string;
  onMessage?: (event: ServerEvent) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
};

type Client = {
  filters?: string[];
  setMessage: (event: ServerEvent) => void;
  setReadyState: (status: ReadyState) => void;

  listeners: {
    onMessage: (event: ServerEvent) => void;
    onConnect?: () => void;
    onDisconnect?: (reason: string) => void;
  };
};

const defaultListeners = {
  onMessage: () => {},
};

enum ReadyState {
  DISCONNECTED = 0,
  CONNECTING = 1,
  CONNECTED = 2,
}

export function useSocket(props: Props) {
  const cachedOptions = useRef(props);
  const socket = useRef<ImmutableSocket | null>(null);
  const [lastMessage, setLastMessage] = useState<ServerEvent | null>(null);
  const [readyState, setReadyState] = useState(ReadyState.CONNECTING);

  const sendMessage = useCallback((event: string, ...args: any[]) => {
    if (socket.current && socket.current.status().connected) {
      socket.current.emit(event, ...args);
    }
  }, []);

  useEffect(() => {
    let closing = false;

    if (closing) return;

    const { namespace, filters, ...rest } = cachedOptions.current;
    const listeners = { ...defaultListeners, ...rest };

    socket.current = ConnectionAPI.connectOrJoin(namespace);
    attachClientListeners(socket.current, {
      filters,
      listeners,
      setReadyState(status: ReadyState) {
        if (!closing) {
          setReadyState(status);
        }
      },

      setMessage(event: ServerEvent) {
        if (!closing) {
          setLastMessage(event);
        }
      },
    });

    if (!socket.current.status().connected) {
      socket.current.connect();
    } else {
      setReadyState(ReadyState.CONNECTED);
    }

    return () => {
      closing = true;
      socket.current?.offAll();
      socket.current = null;
    };
  }, []);

  return {
    readyState,
    lastMessage,
    sendMessage,
  };
}

function attachClientListeners(socket: ImmutableSocket, client: Client) {
  addMessageListener(socket, client);
  addConnectListener(socket, client);
  addDisconnectListener(socket, client);
}

function addMessageListener(socket: ImmutableSocket, client: Client) {
  const { filters, listeners } = client;

  if (!filters) {
    const cb = (type: string, data: Record<string, unknown>) => {
      const serverEvent = event<any>(type, data);
      listeners.onMessage(serverEvent);
      client.setMessage(serverEvent);
    };

    socket.onAny(cb);

    return;
  }

  filters.forEach((filter) => {
    const cb = (data: Record<string, unknown>) => {
      const serverEvent = event<any>(filter, data);
      listeners.onMessage(serverEvent);
      client.setMessage(serverEvent);
    };

    socket.on(filter, cb);
  });
}

function addConnectListener(socket: ImmutableSocket, client: Client) {
  socket.on('connect', () => {
    client.setReadyState(ReadyState.CONNECTED);
    client.listeners?.onConnect?.();
  });
}

function addDisconnectListener(socket: ImmutableSocket, client: Client) {
  socket.on('disconnect', (reason: string) => {
    client.setReadyState(ReadyState.DISCONNECTED);
    client.listeners?.onDisconnect?.(reason);
  });
}
