export function createServerUrl(endpoint: string) {
  return `${process.env.SERVER_URL}${endpoint}`;
}

export function removeUndefined<T extends object>(
  obj: T
): {
  [K in keyof T]-?: Exclude<T[K], undefined>;
} {
  const result = {} as { [K in keyof T]-?: Exclude<T[K], undefined> };
  for (const key in obj) {
    const value = obj[key];
    if (value !== undefined) {
      result[key] = value as any;
    }
  }
  return result;
}

export function getToken() {
  if (typeof window === 'undefined') return '';

  const user = localStorage.getItem('user');
  if (!user) return '';

  const { id } = JSON.parse(user);
  return id;
}
