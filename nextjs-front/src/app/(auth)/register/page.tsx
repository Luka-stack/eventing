'use client';

import {
  Card,
  Container,
  Input,
  PasswordInput,
  Stack,
  TextInput,
  Title,
  Text,
} from '@mantine/core';
import { IconAt, IconLock, IconUser } from '@tabler/icons-react';
import Link from 'next/link';
import { useFormState } from 'react-dom';

import { register } from '@/actions';
import { SubmitButton } from '@/components/SubmitButton';

const initialState = {
  message: '',
};

export default function RegisterPage() {
  const [state, formAction] = useFormState(register, initialState);

  return (
    <div className="h-screen items-center flex">
      <Container size="xs" className="w-full">
        <Card withBorder>
          <form action={formAction}>
            <Stack>
              <Title order={2}>Register</Title>

              <Text size="sm" className="text-center">
                {state.message}
              </Text>

              <Input.Wrapper label="Email">
                <Input
                  name="email"
                  placeholder="Your email"
                  leftSection={<IconAt size={16} />}
                />
              </Input.Wrapper>

              <TextInput
                name="nickname"
                label="Nickname"
                placeholder="Your nick"
                leftSection={<IconUser size={16} />}
              />

              <PasswordInput
                name="password"
                label="Password"
                placeholder="Your password"
                leftSection={<IconLock size={16} />}
              />

              <SubmitButton color="orange" mt="md" type="submit">
                Register
              </SubmitButton>

              <Text className="text-center" size="sm">
                Have an accounta already?{' '}
                <Link
                  href="/login"
                  className="text-orange-500 font-semibold underline"
                >
                  Login
                </Link>
              </Text>
            </Stack>
          </form>
        </Card>
      </Container>
    </div>
  );
}
