import { Button, Flex, Stack } from '@chakra-ui/core';
import { withUrqlClient } from 'next-urql';
import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import { Post } from '../components/post/post.component';
import { useMeQuery, usePostsQuery } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';
const Index = () => {
  const [variables, setVariables] = useState({
    limit: 15,
    cursor: null as null | string,
  });
  const [{ data, fetching }] = usePostsQuery({ variables });
  const [{ data: me }] = useMeQuery();
  if (!fetching && !data) return <div>no posts</div>;
  const handleLoad = () => {
    setVariables({
      limit: variables.limit,
      cursor: data!.posts.posts[data!.posts.posts.length - 1].createdAt,
    });
  };

  return (
    <Layout variant="small">
      {!data && fetching ? (
        <div>Loading...</div>
      ) : (
        <Stack spacing={15}>
          {data!.posts.posts.map((post) =>
            !post ? null : (
              <Post post={post} isMine={post.author.id === me?.me?.id} />
            )
          )}
        </Stack>
      )}
      {data && data.posts.hasMore ? (
        <Flex>
          <Button onClick={handleLoad} isLoading={fetching} m="auto" my={10}>
            load more
          </Button>
        </Flex>
      ) : null}
    </Layout>
  );
};
export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
