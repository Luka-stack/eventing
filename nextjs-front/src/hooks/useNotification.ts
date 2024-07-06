import { useCallback, useState } from 'react';

import { Notification } from '@/types';

export function useNotification() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((notification: Notification) => {
    setNotifications((prev) => {
      return [notification, ...prev];
    });
  }, []);

  const removeNotification = useCallback((id: Notification['id']) => {
    setNotifications((prev) => {
      return prev.filter((n) => n.id !== id);
    });
  }, []);

  const seenNotification = useCallback((id: Notification['id']) => {
    setNotifications((prev) => {
      return prev.map((n) => {
        if (n.id === id) {
          return { ...n, seen: true };
        }

        return n;
      });
    });
  }, []);

  return {
    notifications,
    add: addNotification,
    remove: removeNotification,
    markAsSeen: seenNotification,
  };
}
