import { cookies } from 'next/headers';

import { ThePost } from './_components/ThePost/ThePost';
import { createServerUrl } from '@/libs/utils';

type Params = {
  params: {
    id: string;
  };
};

async function getPost(id: string) {
  const url = createServerUrl(`/posts/${id}`);
  const response = await fetch(url, {
    next: {
      tags: [`posts/${id}`],
    },
  });

  if (!response.ok) {
    return [];
  }

  return response.json();
}

export default async function PostPage({ params }: Params) {
  const post = await getPost(params.id);
  const cookieStore = cookies();
  const userid = cookieStore.get('userid');

  if (!userid) {
    return <div>Not logged in</div>;
  }

  return <ThePost post={post} userId={userid.value} />;
}
