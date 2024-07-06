'use client';

import { User } from '@/types';
import { useLayoutEffect, useState } from 'react';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);

  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;

    const user = localStorage.getItem('user');
    if (user) setUser(JSON.parse(user));
  }, []);

  return user;
}
