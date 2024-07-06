import { createServerUrl } from '@/libs/utils';
import { cookies } from 'next/headers';
import { GroupList } from './_components/GroupList';

async function getGroups() {
  const cookieStore = cookies();
  const userId = cookieStore.get('userid');
  const url = createServerUrl('/groups');

  const response = await fetch(url, {
    headers: {
      userid: `${userId?.value}`,
    },
    next: {
      tags: ['groups'],
    },
  });

  if (!response.ok) {
    return [];
  }

  return response.json();
}

export default async function GroupPage() {
  const groups = await getGroups();

  const cookieStore = cookies();
  const userid = cookieStore.get('userid');

  return <GroupList groups={groups} userId={userid?.value!} />;
}
