import { Box, Button, Flex, Link } from '@chakra-ui/core';
import React from 'react';
import NextLink from 'next/link';
import { useLogoutMutation, useMeQuery } from '../generated/graphql';
import { isServer } from '../utils/isServer';

type NavBarProps = {};
const NavBar = (props: NavBarProps) => {
  const [{ data, fetching: dataFetching }] = useMeQuery({ pause: isServer() });
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
  let body = null;
  if (dataFetching) {
    body = (
      <>
        <div>laodnig..</div>
      </>
    );
  } else if (!data?.me) {
    body = (
      <>
        <NextLink href="/signin">
          <Link color="#fff" mr={4}>
            sign in
          </Link>
        </NextLink>

        <NextLink href="/signup">
          <Link color="#fff">sign up</Link>
        </NextLink>
      </>
    );
  } else {
    body = (
      <Flex>
        <Box mr={4}>{data.me?.username}</Box>
        <Button
          variant="link"
          onClick={() => logout()}
          isLoading={logoutFetching}
        >
          logout
        </Button>
      </Flex>
    );
  }
  return (
    <Flex position="sticky" zIndex={1} top={0} bg="#4287f5" ml="auto" p={6}>
      <Box ml="auto">{body}</Box>
    </Flex>
  );
};

export default NavBar;
