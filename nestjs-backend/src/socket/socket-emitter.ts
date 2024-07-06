import { Server } from 'socket.io';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';

import { SocketSessionService } from './socket-session.service';
import {
  CreatingPost,
  PostCreated,
  PostCreationFailed,
  CommentAdded,
} from '../common/events';

type EmitterEvent =
  | CreatingPost
  | PostCreated
  | PostCreationFailed
  | CommentAdded;

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class SocketEmitter {
  @WebSocketServer()
  server: Server;

  constructor(private readonly sessionService: SocketSessionService) {}

  publish(event: EmitterEvent, users?: string[]) {
    if (users) {
      const socketsIds = users.map((u) => this.sessionService.getSocketId(u));

      if (!socketsIds.length) {
        return;
      }

      this.server.to(socketsIds).emit(event.type, event.data);
      return;
    }

    this.server.emit(event.type, event.data);
  }
}
