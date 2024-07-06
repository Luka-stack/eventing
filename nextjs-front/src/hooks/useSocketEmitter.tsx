import { useCallback, useEffect, useRef, useState } from 'react';

import { ConnectionAPI, ImmutableSocket } from '@/libs/socket-manager/manager';

enum ReadyState {
  DISCONNECTED = 0,
  CONNECTING = 1,
  CONNECTED = 2,
}

type Client = {
  setReadyState: (status: ReadyState) => void;
};

export function useSocketEmitter(namespace?: string) {
  const cachedOptions = useRef(namespace);
  const socket = useRef<ImmutableSocket | null>(null);
  const [readyState, setReadyState] = useState(ReadyState.CONNECTING);

  const sendMessage = useCallback((event: string, ...args: any[]) => {
    if (socket.current && socket.current.status().connected) {
      socket.current.emit(event, ...args);
    }
  }, []);

  const ackMessage = useCallback((event: string, ...args: any[]) => {
    if (socket.current && socket.current.status().connected) {
      return socket.current.emitWithAck(event, ...args);
    }
  }, []);

  useEffect(() => {
    let closing = false;

    if (closing) return;

    socket.current = ConnectionAPI.connectOrJoin(cachedOptions.current);
    attachClientListeners(socket.current, {
      setReadyState(status: ReadyState) {
        if (!closing) {
          setReadyState(status);
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
    ackMessage,
    sendMessage,
  };
}

function attachClientListeners(socket: ImmutableSocket, client: Client) {
  addConnectListener(socket, client);
  addDisconnectListener(socket, client);
}

function addConnectListener(socket: ImmutableSocket, client: Client) {
  socket.on('connect', () => {
    client.setReadyState(ReadyState.CONNECTED);
  });
}

function addDisconnectListener(socket: ImmutableSocket, client: Client) {
  socket.on('disconnect', () => {
    client.setReadyState(ReadyState.DISCONNECTED);
  });
}
