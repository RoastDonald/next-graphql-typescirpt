import { Box, Button, Flex } from '@chakra-ui/core';
import { Form, Formik } from 'formik';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import React from 'react';
import InputField from '../../../components/InputField';
import { Layout } from '../../../components/Layout';
import { useUpdatePostMutation } from '../../../generated/graphql';
import { createUrqlClient } from '../../../utils/createUrqlClient';
import { usePost } from '../../../utils/usePost';

export const EditPage = () => {
  const router = useRouter();
  const [{ postId: id, data, error, fetching }] = usePost();
  const [, updatePost] = useUpdatePostMutation();

  if (!id) {
    return <Layout variant="small">post wasn't found</Layout>;
  }
  if (error) {
    return <Layout variant="small">{error.message}</Layout>;
  }
  if (!data && fetching) {
    return <Layout variant="small">loading...</Layout>;
  }
  if (!data?.post) {
    return <Layout variant="small">post wasn't found</Layout>;
  }

  return (
    <Layout variant="small">
      <Formik
        initialValues={{ title: data.post.title, text: data.post.text }}
        onSubmit={async (values) => {
          await updatePost({ id, ...values });
          router.back();
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField name="title" label="Title" />
            <Box mt={4}>
              <InputField height={48} name="text" label="Post" />
            </Box>
            <Flex mt={4}>
              <Button
                type="submit"
                variantColor="teal"
                isLoading={isSubmitting}
              >
                edit Post
              </Button>
            </Flex>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};
export default withUrqlClient(createUrqlClient)(EditPage);
