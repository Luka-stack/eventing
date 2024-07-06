import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SocketSessionService } from './socket-session.service';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(SocketGateway.name);

  @WebSocketServer()
  server: Server;

  constructor(private readonly sessionService: SocketSessionService) {}

  handleDisconnect(client: Socket) {
    this.logger.log(`Client connected ${client.id}`);

    const { token } = client.handshake.auth;

    if (token) {
      this.sessionService.removeUser(token);
    }
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected ${client.id}`);

    // TODO check if user actually exists base on the token

    const { token } = client.handshake.auth;

    if (!token) {
      // client.disconnect();
      this.logger.warn('Client disconnected due to missing token');
      return;
    }

    this.sessionService.addUser(token, client.id);
  }

  // Socket Manager
  @SubscribeMessage('session')
  handleBroadcast(): any {
    this.sessionService.printSession();

    return;
  }

  // @SubscribeMessage('log')
  // handleLog(
  //   @MessageBody() data: string,
  //   @ConnectedSocket() client: Socket,
  // ): any {
  //   client.broadcast.emit('log', data);
  //   this.cache.push({ data, time: Date.now() });
  //   return;
  // }

  // @SubscribeMessage('feeder')
  // hadnleFeeder(@MessageBody() data: any): any {
  //   if (data.status) {
  //     this.feeder = setInterval(() => {
  //       const feed = [...this.cache];
  //       this.cache = [];
  //       this.server.emit('feed', feed);
  //     }, 5000);

  //     return Date.now();
  //   }

  //   clearInterval(this.feeder);
  // }

  // // Socket
  // @SubscribeMessage('events')
  // handleEvents(
  //   @MessageBody() data: any,
  //   @ConnectedSocket() client: Socket,
  // ): any {
  //   console.log(data);

  //   client.broadcast.emit('events', data);

  //   return data;
  // }

  // @SubscribeMessage('event1')
  // handleEvent1(
  //   @MessageBody() data: any,
  //   @ConnectedSocket() client: Socket,
  // ): any {
  //   console.log('event1', data);

  //   client.broadcast.emit('event1', data);

  //   return data;
  // }

  // @SubscribeMessage('event2')
  // handleEvent2(
  //   @MessageBody() data: any,
  //   @ConnectedSocket() client: Socket,
  // ): any {
  //   console.log('event2', data);

  //   client.broadcast.emit('event2', data);

  //   return data;
  // }
}
