import { Socket } from 'socket.io-client';
import { getSubscribers } from './subscriber';
import { SocketStatus } from './types';

export function attachListeners(socket: Socket, namespace: string) {
  addOnConnect(socket, namespace);
  addOnAny(socket, namespace);
  addOnDisconnect(socket, namespace);
}

function addOnConnect(socket: Socket, namespace: string) {
  socket.on('connect', () => {
    getSubscribers(namespace).forEach((subscriber) => {
      subscriber.setStatus(SocketStatus.CONNECTED);

      if (subscriber.listeners?.onConnect) {
        subscriber.listeners.onConnect();
      }
    });
  });
}

function addOnAny(socket: Socket, namepsace: string) {
  socket.onAny((event, ...args: any[]) => {
    getSubscribers(namepsace).forEach((subscriber) => {
      if (subscriber.filter) {
        if (
          arrayFilter(subscriber.filter, event) ||
          functionFilter(subscriber.filter, event)
        ) {
          subscriber.setMessage(args);
          subscriber.listeners?.onMessage?.(event, args);
        }
      } else if (subscriber.listeners?.onMessage) {
        subscriber.listeners.onMessage(event, args);
      }
    });
  });
}

function addOnDisconnect(socket: Socket, namepsace: string) {
  socket.on('disconnect', (reason) => {
    getSubscribers(namepsace).forEach((subscriber) => {
      if (isReconnectable(reason)) {
        subscriber.setStatus(SocketStatus.RECONECTING);
        return;
      }

      subscriber.setStatus(SocketStatus.DISCONNECTED);

      if (subscriber.listeners?.onDisconnect) {
        subscriber.listeners.onDisconnect();
      }
    });
  });
}

function isReconnectable(reason: string) {
  if (reason === 'io server disconnect' || reason === 'io client disconnect') {
    return false;
  }

  return true;
}

function arrayFilter(filter: unknown, event: string) {
  if (Array.isArray(filter) && filter.includes(event)) {
    return true;
  }

  return false;
}

function functionFilter(filter: unknown, event: string) {
  if (typeof filter === 'function' && filter(event)) {
    return true;
  }

  return false;
}
