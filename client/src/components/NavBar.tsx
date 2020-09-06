import { Box, Button, Flex, Heading, Link } from '@chakra-ui/core';
import React from 'react';
import NextLink from 'next/link';
import { useLogoutMutation, useMeQuery } from '../generated/graphql';
import { isServer } from '../utils/isServer';
import { useRouter } from 'next/router';
type NavBarProps = {};
const NavBar = (props: NavBarProps) => {
  const router = useRouter();
  const [{ data, fetching: dataFetching }] = useMeQuery({ pause: isServer() });
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
  let body = null;
  if (dataFetching) {
    body = (
      <>
        <div>loading..</div>
      </>
    );
  } else if (!data?.me) {
    body = (
      <Flex alignItems="center">
        <NextLink href="/signin">
          <Link color="#fff" mr={4}>
            sign in
          </Link>
        </NextLink>

        <NextLink href="/signup">
          <Link color="#fff">sign up</Link>
        </NextLink>
      </Flex>
    );
  } else {
    body = (
      <Flex alignItems="center">
        <NextLink href="/create-post" mr={4}>
          <Button as={Link} mr={2}>
            <Link>create post</Link>
          </Button>
        </NextLink>

        <Box mr={4}>{data.me?.username}</Box>
        <Button
          variant="link"
          onClick={async () => {
            await logout();
            router.reload();
          }}
          isLoading={logoutFetching}
        >
          logout
        </Button>
      </Flex>
    );
  }
  return (
    <Flex position="sticky" zIndex={1} top={0} bg="#4287f5" ml="auto" p={6}>
      <Flex flex={1} maxW={800} alignItems="center" m="auto">
        <NextLink href="/create-post">
          <Heading>
            <NextLink href="/">
              <Link>Ruster</Link>
            </NextLink>
          </Heading>
        </NextLink>
        <Box ml="auto">{body}</Box>
      </Flex>
    </Flex>
  );
};

export default NavBar;
