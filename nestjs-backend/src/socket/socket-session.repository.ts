import { Injectable } from '@nestjs/common';

@Injectable()
export class SocketSessionRepository {
  private readonly users = new Map<string, string>();

  addUser(userId: string, socketId: string) {
    if (this.users.has(userId)) {
      throw new Error('User already exists');
    }

    this.users.set(userId, socketId);
  }

  removeUser(userId: string): void {
    this.users.delete(userId);
  }

  getSocketId(userId: string): string | null {
    return this.users.get(userId) || null;
  }

  printSession() {
    for (const [key, value] of this.users) {
      console.log(key, value);
    }
  }

  getSocketIds(): string[] {
    return Array.from(this.users.values());
  }
}
