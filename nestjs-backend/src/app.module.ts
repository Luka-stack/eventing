import { Module } from '@nestjs/common';

import { AppService } from './app.service';
import { AppController } from './app.controller';
import { PrismaService } from './prisma.service';
import { SocketGateway } from './socket/socket.gateway';

import { SocketEmitter } from './socket/socket-emitter';
import { SocketSessionService } from './socket/socket-session.service';
import { SocketSessionRepository } from './socket/socket-session.repository';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [
    PrismaService,
    AppService,
    SocketGateway,
    SocketEmitter,
    SocketSessionRepository,
    SocketSessionService,
  ],
})
export class AppModule {}
