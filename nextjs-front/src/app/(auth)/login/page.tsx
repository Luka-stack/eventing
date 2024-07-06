'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  Container,
  Input,
  PasswordInput,
  Stack,
  Title,
  Text,
  Button,
} from '@mantine/core';
import { IconAt, IconLock } from '@tabler/icons-react';

import { login } from '@/actions';

type FormState = {
  message?: string;
  pending: boolean;
};

export default function LoginPage() {
  const router = useRouter();
  const [formState, setFormState] = useState<FormState>({ pending: false });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormState({ pending: true });

    const formData = new FormData(event.currentTarget);

    const response = await login(formData);

    if (response.message) {
      setFormState({ message: response.message, pending: false });
    }

    setFormState({ pending: false });
    localStorage.setItem('user', JSON.stringify(response.user));
    router.replace('/');
  };

  return (
    <div className="h-screen items-center flex">
      <Container size="xs" className="w-full">
        <Card withBorder>
          <form onSubmit={handleSubmit}>
            <Stack>
              <Title order={2}>Login</Title>

              <Text size="sm" className="text-center">
                {formState.message}
              </Text>

              <Input.Wrapper label="Email">
                <Input
                  name="email"
                  placeholder="Your email"
                  leftSection={<IconAt size={16} />}
                />
              </Input.Wrapper>

              <PasswordInput
                name="password"
                label="Password"
                placeholder="Your password"
                leftSection={<IconLock size={16} />}
              />

              <Button
                color="orange"
                mt="md"
                type="submit"
                disabled={formState.pending}
              >
                Login
              </Button>

              <Text className="text-center" size="sm">
                {`Don't have an account yet? `}
                <Link
                  href="/register"
                  className="text-orange-500 font-semibold underline"
                >
                  Register
                </Link>
              </Text>
            </Stack>
          </form>
        </Card>
      </Container>
    </div>
  );
}
