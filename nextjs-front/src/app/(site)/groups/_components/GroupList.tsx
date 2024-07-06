'use client';

import { Card, Container, Title } from '@mantine/core';
import { IconBellOff, IconBellRingingFilled } from '@tabler/icons-react';

import { Group } from '@/types';
import { subscribe, unsubscribe } from '@/actions';

type Props = {
  groups: Group[];
  userId: string;
};

export function GroupList({ groups, userId }: Props) {
  return (
    <Container size={'xl'} mt={'lg'}>
      <Title my={'xl'}>Group Page</Title>

      <div className="flex flex-wrap gap-4">
        {groups.map((group) => {
          if (group.subscribed) {
            return (
              <SubscribedCard key={group.name} group={group} userId={userId} />
            );
          }

          return (
            <UnsubscribedCard key={group.name} group={group} userId={userId} />
          );
        })}
      </div>
    </Container>
  );
}

function UnsubscribedCard({ group, userId }: { group: Group; userId: string }) {
  const subscribeWithId = subscribe.bind(null, userId);

  return (
    <Card radius="md" withBorder className="min-w-48">
      <div className="flex justify-between items-center h-full">
        <form action={subscribeWithId}>
          <input type="hidden" name="group" value={group.name} />
          <button
            type="submit"
            className=" bg-blue-900 rounded-md p-2 active:scale-95 shadow-md"
          >
            <IconBellOff />
          </button>
        </form>
        <h3>{group.name}</h3>
      </div>
    </Card>
  );
}

function SubscribedCard({ group, userId }: { group: Group; userId: string }) {
  const unsubscribeWithId = unsubscribe.bind(null, userId);

  return (
    <Card radius="md" withBorder className="min-w-48">
      <div className="flex justify-between items-center h-full">
        <form action={unsubscribeWithId}>
          <button
            type="submit"
            className=" bg-blue-900 rounded-md p-2 active:scale-95 shadow-md"
          >
            <IconBellRingingFilled />
          </button>
        </form>
        <h3>{group.name}</h3>
      </div>
    </Card>
  );
}
