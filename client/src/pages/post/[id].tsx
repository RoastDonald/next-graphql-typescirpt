import { Heading, Text } from '@chakra-ui/core';
import { withUrqlClient } from 'next-urql';
import React from 'react';
import { Layout } from '../../components/Layout';
import { createUrqlClient } from '../../utils/createUrqlClient';
import { usePost } from '../../utils/usePost';

const Post = () => {
  const [{ postId, data, fetching, error }] = usePost();

  if (!postId) {
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
      <Heading>{data?.post?.title}</Heading>
      <Text>{data?.post?.text}</Text>
    </Layout>
  );
};
export default withUrqlClient(createUrqlClient, { ssr: true })(Post);
