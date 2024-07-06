'use client';

import {
  Text,
  Badge,
  Card,
  Image,
  Group,
  Center,
  Avatar,
  ActionIcon,
  rem,
  Container,
  useMantineTheme,
  Grid,
} from '@mantine/core';
import { IconBookmark, IconHeart, IconShare } from '@tabler/icons-react';

import classes from './TheContent.module.css';
import { GroupList } from '../../../../components/GroupList/GroupList';
import { Post } from '@/types';
import Link from 'next/link';

type Props = {
  data: Post[];
};

export function TheContent({ data }: Props) {
  const theme = useMantineTheme();

  return (
    <Container size={'xl'}>
      <Grid>
        <Grid.Col span={9}>
          {data.map((post) => (
            <Card
              withBorder
              radius="md"
              className="relative"
              key={post.id}
              my="xl"
            >
              <Card.Section>
                <Link href={`/posts/${post.id}`}>
                  <Image src={post.thumbnail} height={180} />
                </Link>
              </Card.Section>

              <Text fw={500} component="a" my="sm">
                {post.title}
              </Text>

              <Text fz="sm" c="dimmed" lineClamp={4}>
                {post.description}
              </Text>

              <Group justify="space-between" mt="md">
                <Center>
                  <Avatar
                    src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-1.png"
                    size={24}
                    radius="xl"
                    mr="xs"
                  />
                  <Text fz="sm" inline>
                    {post.author.nickname}
                  </Text>
                </Center>

                <Group gap={8} mr={0}>
                  <ActionIcon className={classes.action}>
                    <IconHeart
                      style={{ width: rem(16), height: rem(16) }}
                      color={theme.colors.red[6]}
                    />
                  </ActionIcon>

                  <ActionIcon className={classes.action}>
                    <IconBookmark
                      style={{ width: rem(16), height: rem(16) }}
                      color={theme.colors.yellow[7]}
                    />
                  </ActionIcon>

                  <ActionIcon className={classes.action}>
                    <IconShare
                      style={{ width: rem(16), height: rem(16) }}
                      color={theme.colors.blue[6]}
                    />
                  </ActionIcon>
                </Group>
              </Group>
            </Card>
          ))}
        </Grid.Col>

        <Grid.Col span={3}>
          <GroupList groups={['Games', 'Movies', 'Anime', 'Manga', 'Books']} />
        </Grid.Col>
      </Grid>
    </Container>
  );
}
