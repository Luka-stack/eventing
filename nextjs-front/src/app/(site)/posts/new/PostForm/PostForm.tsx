'use client';

import clsx from 'clsx';
import { useState } from 'react';
import {
  Badge,
  Button,
  Container,
  Group,
  Paper,
  SimpleGrid,
  TextInput,
  Textarea,
  Title,
  Text,
} from '@mantine/core';

import classes from './PostForm.module.css';
import { createPost } from '@/actions';
import { useRouter } from 'next/navigation';

type Props = {
  userId: string;
};

export function PostForm({ userId }: Props) {
  const router = useRouter();
  const [groups, setGroups] = useState<Record<string, boolean>>({});
  const [state, setState] = useState<string | null>();

  const handleGroup = (group: string) => {
    setGroups((prev) => {
      if (prev[group]) {
        const { [group]: removed, ...rest } = prev;
        return rest;
      }

      return { ...prev, [group]: true };
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const data = {
      title: formData.get('title') as string,
      thumbnail: formData.get('thumbnail') as string,
      description: formData.get('description') as string,
      content: formData.get('content') as string,
      groups: Object.keys(groups),
    };

    const response = await createPost(data, userId);

    if (response.message) {
      setState(response.message);
    }

    router.push('/');
  };

  return (
    <Container size={'xl'} my="md">
      <form onSubmit={handleSubmit}>
        <Title
          order={2}
          size="h1"
          style={{ fontFamily: 'Greycliff CF, var(--mantine-font-family)' }}
          fw={900}
          ta="center"
        >
          Create new post
        </Title>

        <Text size="sm" className="text-center">
          {state}
        </Text>

        <SimpleGrid cols={{ base: 1, sm: 2 }} mt="xl">
          <TextInput
            label="Title"
            placeholder="Post title"
            name="title"
            variant="filled"
          />

          <TextInput
            label="Thumbnail link"
            placeholder="Link to thumbnail image"
            name="thumbnail"
            variant="filled"
          />
        </SimpleGrid>

        <TextInput
          label="Description"
          placeholder="Write a short description"
          mt="md"
          name="description"
          variant="filled"
        />

        <Paper>
          <Text mt="md" size="md">
            Groups
          </Text>

          <Group
            className={clsx('rounded-md cursor-pointer', classes.groups)}
            p="xs"
          >
            <Badge
              size="lg"
              color="orange"
              variant={groups['games'] ? 'filled' : 'outline'}
              onClick={() => handleGroup('games')}
            >
              Games
            </Badge>
            <Badge
              variant={groups['anime'] ? 'filled' : 'outline'}
              color="orange"
              size="lg"
              className={'cursor-pointer'}
              onClick={() => handleGroup('anime')}
            >
              Anime
            </Badge>
            <Badge
              variant={groups['manga'] ? 'filled' : 'outline'}
              color="orange"
              size="lg"
              className={'cursor-pointer'}
              onClick={() => handleGroup('manga')}
            >
              Manga
            </Badge>
            <Badge
              variant={groups['books'] ? 'filled' : 'outline'}
              color="orange"
              size="lg"
              className={'cursor-pointer'}
              onClick={() => handleGroup('books')}
            >
              Books
            </Badge>
            <Badge
              variant={groups['movies'] ? 'filled' : 'outline'}
              color="orange"
              size="lg"
              className={'cursor-pointer'}
              onClick={() => handleGroup('movies')}
            >
              Movies
            </Badge>
          </Group>
        </Paper>

        <Textarea
          mt="md"
          label="Content"
          placeholder="Write your post here..."
          maxRows={10}
          minRows={5}
          autosize
          name="content"
          variant="filled"
        />

        <Group mt="xl">
          <Button type="submit" size="md" fullWidth>
            Add Post
          </Button>
        </Group>
      </form>
    </Container>
  );
}
