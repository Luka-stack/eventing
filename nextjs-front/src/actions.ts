'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createServerUrl } from './libs/utils';
import { revalidatePath, revalidateTag } from 'next/cache';

type RegisterData = {
  email: string;
  nickname: string;
  password: string;
};

type LoginData = {
  email: string;
  password: string;
};

type PostData = {
  title: string;
  thumbnail: string;
  description: string;
  content: string;
  groups: string[];
};

type CommentData = {
  content: string;
  postId: string;
};

export async function register(_: any, formData: FormData) {
  const body: RegisterData = {
    email: formData.get('email') as string,
    nickname: formData.get('nickname') as string,
    password: formData.get('password') as string,
  };
  const url = createServerUrl('/register');

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (response.ok) {
    redirect('/login');
  }

  const json = await response.json();

  return {
    message: json.message,
  };
}

export async function login(formData: FormData) {
  const body: LoginData = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  const url = createServerUrl('/login');

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const json = await response.json();

  if (response.ok) {
    cookies().set('userid', json.id);
  }

  return {
    user: json,
    message: json.message,
  };
}

export async function createPost(data: PostData, userId: string) {
  const url = createServerUrl('/posts');

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      userid: userId,
    },
    body: JSON.stringify(data),
  });

  if (response.ok) {
    return {};
  }

  const json = await response.json();

  return {
    message: json.message,
  };
}

export async function createComment(data: CommentData, userId: string) {
  const url = createServerUrl('/comments');

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      userid: userId,
    },
    body: JSON.stringify(data),
  });

  const json = await response.json();

  if (response.ok) {
    revalidatePath(`/posts/${data.postId}`);

    return {
      commentId: json.id,
    };
  }

  return {
    message: json.message,
  };
}

export async function subscribe(userId: string, formData: FormData) {
  const groupId = formData.get('group') as string;

  const url = createServerUrl(`/groups/${groupId}/subscribe`);

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      userid: userId,
    },
    body: JSON.stringify({}),
  });

  if (response.ok) {
    revalidateTag('groups');
  }

  return {};
}

export async function unsubscribe(userId: string, formData: FormData) {
  const groupId = formData.get('group') as string;

  const url = createServerUrl(`/groups/${groupId}/unsubscribe`);

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      userid: userId,
    },
    body: JSON.stringify({}),
  });

  if (response.ok) {
    revalidateTag('groups');
  }

  return {};
}
