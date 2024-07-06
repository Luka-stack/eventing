import { SocketSubscriber } from './types';

type Subscribers = {
  [url: string]: Set<SocketSubscriber>;
};

const subscribers: Subscribers = {};

export function addSubscriber(namepsace: string, subscriber: SocketSubscriber) {
  if (!subscribers[namepsace]) {
    subscribers[namepsace] = new Set();
  }

  subscribers[namepsace].add(subscriber);
}

export function getSubscribers(namespace: string): SocketSubscriber[] {
  return Array.from(subscribers[namespace] || []);
}

export function removeSubscriber(
  namespace: string,
  subscriber: SocketSubscriber
) {
  subscribers[namespace]?.delete(subscriber);
}

export function hasSubscribers(namespace: string): boolean {
  return subscribers[namespace]?.size > 0;
}
