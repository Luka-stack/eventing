import { Socket } from 'socket.io-client';

type Subscriber = {};

type Connection = {
  socket: Socket;
  subscribers: Set<Subscriber>;
};

export class SocketMap {
  private connections: Map<string, Connection>;

  constructor() {
    this.connections = new Map();
  }

  addConnection(name: string, socket: Socket) {}
}
