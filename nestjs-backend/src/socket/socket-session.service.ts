import { Injectable, Logger } from '@nestjs/common';

import { SocketSessionRepository } from './socket-session.repository';

@Injectable()
export class SocketSessionService {
  private readonly logger = new Logger(SocketSessionService.name);

  constructor(private readonly repo: SocketSessionRepository) {}

  addUser(userId: string, socketId: string): boolean {
    try {
      this.repo.addUser(userId, socketId);
      this.logger.log(`User ${userId} added with socketId ${socketId}`);
      return true;
    } catch (err) {
      this.logger.error(err);
      return false;
    }
  }

  removeUser(userId: string): void {
    this.repo.removeUser(userId);
    this.logger.log(`User ${userId} removed`);
  }

  getSocketId(userId: string): string | null {
    return this.repo.getSocketId(userId);
  }

  printSession() {
    this.repo.printSession();
  }

  getSocketIds(): string[] {
    return this.repo.getSocketIds();
  }
}
