'use client';

import { Button, ButtonProps, ElementProps } from '@mantine/core';
import { useFormStatus } from 'react-dom';

interface Props
  extends ButtonProps,
    ElementProps<'button', keyof ButtonProps> {}

export function SubmitButton(props: Props) {
  const { pending } = useFormStatus();

  return <Button {...props} disabled={pending} />;
}
