import { Box, Flex, IconButton } from '@chakra-ui/core';
import React, { useState } from 'react';
import { PostSnippetFragment, useVotePostMutation } from '../generated/graphql';

type UpdootProps = {
  post: PostSnippetFragment;
};

export const Updoot = ({ post }: UpdootProps) => {
  const [dootLoading, setDootLoading] = useState<
    'updoot-loading' | 'downdoot-loading ' | 'not-loading'
  >('not-loading');
  const [, vote] = useVotePostMutation();

  return (
    <Flex direction="column" justifyContent="center" alignItems="center" mr={6}>
      <IconButton
        aria-label="updoot post"
        icon="chevron-up"
        variantColor={post.voteStatus === 1 ? 'green' : undefined}
        isLoading={dootLoading === 'updoot-loading'}
        onClick={async () => {
          if (post.voteStatus === 1) {
            return;
          }
          setDootLoading('updoot-loading');
          await vote({
            postId: post.id,
            value: 1,
          });
          setDootLoading('not-loading');
        }}
      />
      <Box>{post.points}</Box>
      <IconButton
        aria-label="downdoot post"
        icon="chevron-down"
        variantColor={post.voteStatus === -1 ? 'red' : undefined}
        isLoading={dootLoading === 'downdoot-loading '}
        onClick={async () => {
          if (post.voteStatus === -1) {
            return;
          }
          setDootLoading('downdoot-loading ');
          await vote({
            postId: post.id,
            value: -1,
          });
          setDootLoading('not-loading');
        }}
      />
    </Flex>
  );
};

export default Updoot;
