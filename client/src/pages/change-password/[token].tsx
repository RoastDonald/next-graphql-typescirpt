import React, { useState } from 'react';
import { NextPage } from 'next';
import { Box, Button, Flex, Link } from '@chakra-ui/core';
import { Formik, Form } from 'formik';
import InputField from '../../components/InputField';
import { Wrapper } from '../../components/Wrapper';
import { useChangePasswordMutation } from '../../generated/graphql';
import { toError } from '../../utils/toError';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../../utils/createUrqlClient';

export const ChangePassword: NextPage = () => {
  const [, changePassword] = useChangePasswordMutation();
  const router = useRouter();
  const [tokenError, setTokenError] = useState('');
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ newpassword: '' }}
        onSubmit={async (values, { setErrors }) => {
          const response = await changePassword({
            newpassword: values.newpassword,
            token:
              typeof router.query.token === 'string' ? router.query.token : '',
          });
          if (response.data?.changePassword.errors) {
            const errorMap = toError(response.data?.changePassword.errors);
            if ('token' in errorMap) {
              setTokenError(errorMap['token']);
            }
            setErrors(errorMap);
          } else if (response.data?.changePassword.user) {
            router.push('/');
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="newpassword"
              placeholder="new password"
              label="New password"
              type="password"
            />
            {tokenError ? (
              <Flex>
                <Box color="red">{tokenError}</Box>
                <NextLink ml={2} href="/forgot-password">
                  <Link>remember again</Link>
                </NextLink>
              </Flex>
            ) : null}
            <Button
              mt={4}
              type="submit"
              variantColor="teal"
              isLoading={isSubmitting}
            >
              Reset password
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default withUrqlClient(createUrqlClient)(ChangePassword);
