'use client';

import cx from 'clsx';
import { Box, Card, Text } from '@mantine/core';

import classes from './GroupList.module.css';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useMemo } from 'react';

type Props = {
  groups: string[];
};

export function GroupList({ groups }: Props) {
  const searchParams = useSearchParams();

  const activeGroup = searchParams.get('group') || '';
  const selectedIndex = useMemo(() => {
    return groups.indexOf(activeGroup) + 1;
  }, [groups, activeGroup]);

  return (
    <Card withBorder radius="md" my="xl" className={classes.card}>
      <Text tt="uppercase" c="dimmed" fw={700} size="xs" mb="lg">
        Groups filter
      </Text>

      <div className={classes.root}>
        <div className={classes.links}>
          <div
            className={classes.indicator}
            style={{
              transform: `translateY(calc(${selectedIndex} * var(--link-height) + var(--indicator-offset)))`,
            }}
          />

          <Link
            href="/"
            className={cx(
              'pl-4',
              classes.link,
              activeGroup === '' && classes.linkActive
            )}
          >
            All
          </Link>

          {groups.map((group) => (
            <Link
              key={group}
              href={{
                pathname: '/',
                query: { group },
              }}
              className={cx(
                'pl-4',
                classes.link,
                group === activeGroup && classes.linkActive
              )}
            >
              {group}
            </Link>
          ))}

          {/* <Box<'a'>
            component="a"
            href="/"
            className={cx(classes.link)}
            style={{
              paddingLeft: `var(--mantine-spacing-md)`,
            }}
          >
            Label
          </Box>
          <Box<'a'>
            component="a"
            href="/"
            className={cx(classes.link)}
            style={{
              paddingLeft: `var(--mantine-spacing-md)`,
            }}
          >
            Label
          </Box> */}
        </div>
      </div>
    </Card>
  );
}
