import React from 'react';
import { Formik, Form } from 'formik';
import { Box, Button } from '@chakra-ui/core';
import Wrapper from '../components/Wrapper';
import { createUrqlClient } from '../utils/createUrqlClient';

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
        initialValues={{ username: '', password: '' }}
        onSubmit={async (values, { setErrors }) => {
          const res = await signin({ body: values });
          if (res.data?.signIn.errors) {
            setErrors(toError(res.data.signIn.errors));
          } else if (res.data?.signIn.user) {
            router.push('/');
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="username"
              placeholder="username"
              label="Username"
            />
            <Box mt={4}>
              <InputField
                name="password"
                placeholder="password"
                label="Password"
                type="password"
              />
            </Box>
            <Button
              mt={4}
              type="submit"
              variantColor="teal"
              isLoading={isSubmitting}
            >
              signIn
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default withUrqlClient(createUrqlClient)(SignIn);
