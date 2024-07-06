import { TheContent } from '@/app/(site)/_components/TheContent/TheContent';
import { createServerUrl } from '@/libs/utils';

async function getPosts() {
  const url = createServerUrl('/posts');
  const response = await fetch(url, {
    cache: 'no-cache',
  });

  if (!response.ok) {
    return [];
  }

  return response.json();
}

export default async function Home() {
  const posts = await getPosts();

  return <TheContent data={posts} />;
}
