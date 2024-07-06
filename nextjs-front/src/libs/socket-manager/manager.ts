import { Manager as IoManager, Socket } from 'socket.io-client';
import { getToken } from '../utils';

type Connection = {
  socket: Socket;
  namespace: string;
};

export type ImmutableSocket = Readonly<{
  connect(): void;
  status(): { connected: boolean; active: boolean };

  on(event: string, callback: (...args: any[]) => void): void;
  once(event: string, callback: (...args: any[]) => void): void;
  onAny(callback: (event: string, ...args: any[]) => void): void;

  emit(event: string, ...args: any[]): void;
  emitWithAck(event: string, ...args: any[]): Promise<any>;

  off(event: string, callback: (...args: any[]) => void): void;
  offAny(callback: (event: string, ...args: any[]) => void): void;
  offAll(): void;
}>;

const Manager = new IoManager('http://localhost:5000', {
  autoConnect: false,
  reconnection: true,
});

const Connections = new Map<string, Connection>();

export const ConnectionAPI = {
  connectOrJoin(namespace = '/', autoConnect = false) {
    if (!Connections.has(namespace)) {
      const socket = Manager.socket(namespace, {
        auth: (cb) => {
          cb({ token: getToken() });
        },
      });
      Connections.set(namespace, {
        socket,
        namespace,
      });
    }

    const conn = Connections.get(namespace)!;
    if (autoConnect) {
      conn.socket.connect();
    }

    return toImmutableSocket(conn);
  },
};

function toImmutableSocket(conn: Connection): ImmutableSocket {
  const { socket } = conn;
  let unsub: Function[] = [];

  return {
    status() {
      return {
        connected: socket.connected,
        active: socket.active,
      };
    },

    connect() {
      socket.connect();
    },

    on(event: string, callback: (...args: any[]) => void) {
      socket.on(event, callback);
      unsub.push(() => socket.off(event, callback));
    },

    once(event: string, callback: (...args: any[]) => void) {
      socket.once(event, callback);
      unsub.push(() => socket.off(event, callback));
    },

    onAny(callback: (event: string, ...args: any[]) => void) {
      socket.onAny(callback);
      unsub.push(() => socket.offAny(callback));
    },

    emit(event: string, ...args: any[]) {
      socket.emit(event, ...args);
    },

    emitWithAck(event: string, ...args: any[]) {
      return socket.emitWithAck(event, ...args);
    },

    off(event: string, callback: (...args: any[]) => void) {
      socket.off(event, callback);
      unsub = unsub.filter((fn) => fn !== callback);
    },

    offAny(callback: (event: string, ...args: any[]) => void) {
      socket.offAny(callback);
      unsub = unsub.filter((fn) => fn !== callback);
    },

    offAll() {
      unsub.forEach((fn) => fn());
      unsub = [];
    },
  };
}
