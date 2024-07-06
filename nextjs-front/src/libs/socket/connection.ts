import { Socket, io } from 'socket.io-client';
import { attachListeners } from './listener';
import { SocketOptions, SocketStatus, SocketSubscriber } from './types';
import { addSubscriber, hasSubscribers, removeSubscriber } from './subscriber';
import { SocketNamespace } from './events';

// Shared connection to the server based on url
const connections: Record<string, Socket> = {} as const;

export function connectOrJoin(options: SocketOptions) {
  const { filter, listeners, namespace, setStatus, setMessage } = options;
  const url = getUrl(namespace);

  options.setStatus(SocketStatus.CONNECTING);

  let conn: Socket;

  if (!connections[url]) {
    conn = io(url, {
      autoConnect: false,
    });

    connections[url] = conn;
    attachListeners(connections[url], url);
  } else {
    conn = connections[url];
  }
  const subscriber: SocketSubscriber = {
    url: url,
    filter,
    listeners,
    setStatus,
    setMessage,
  };

  addSubscriber(url, subscriber);

  if (conn.connected) {
    subscriber.setStatus(SocketStatus.CONNECTED);
  } else {
    if (conn.active) {
      subscriber.setStatus(SocketStatus.RECONECTING);
    }

    conn.connect();
  }

  const unsub = unsubscribe(url, subscriber);

  return {
    socket: conn,
    unsubscribe: unsub,
  };
}

function unsubscribe(url: string, subscriber: SocketSubscriber) {
  return () => {
    removeSubscriber(url, subscriber);

    if (!hasSubscribers(url)) {
      const socket = connections[url];
      delete connections[url];
      subscriber.setStatus(SocketStatus.DISCONNECTED);
      socket.close();
    }
  };
}

function getUrl(namespace?: SocketNamespace) {
  if (namespace === undefined) {
    return 'http://localhost:5000';
  }

  return `http://localhost:5000/${namespace}`;
}
