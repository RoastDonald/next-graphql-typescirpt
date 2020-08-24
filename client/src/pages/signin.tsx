import React from 'react';
import { Formik, Form } from 'formik';
import { Box, Button, Flex, Link } from '@chakra-ui/core';
import { Wrapper } from '../components/Wrapper';
import { createUrqlClient } from '../utils/createUrqlClient';

import NextLink from 'next/link';
import InputField from '../components/InputField';
import { useSignInMutation } from '../generated/graphql';
import { toError } from '../utils/toError';
import { useRouter } from 'next/router';
import { withUrqlClient } from 'next-urql';
type SignIpProps = {};

const SignIn = ({}: SignIpProps) => {
  const [, signin] = useSignInMutation();
  const router = useRouter();
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ usernameOrEmail: '', password: '' }}
        onSubmit={async (values, { setErrors }) => {
          const res = await signin(values);
          if (res.data?.signIn.errors) {
            setErrors(toError(res.data.signIn.errors));
          } else if (res.data?.signIn.user) {
            if (typeof router.query.next === 'string') {
              router.push(router.query.next);
            } else {
              router.push('/');
            }
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="usernameOrEmail"
              placeholder="Username or Email"
              label="Username or Email"
            />
            <Box mt={4}>
              <InputField
                name="password"
                placeholder="password"
                label="Password"
                type="password"
              />
            </Box>
            <Flex mt={4}>
              <Button
                type="submit"
                variantColor="teal"
                isLoading={isSubmitting}
              >
                signIn
              </Button>
              <NextLink ml={2} href="/forgot-password">
                <Link ml="auto">forgot password?</Link>
              </NextLink>
            </Flex>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default withUrqlClient(createUrqlClient)(SignIn);
