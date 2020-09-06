import { Box, Flex, Heading, IconButton, Link, Text } from '@chakra-ui/core';
import NextLink from 'next/link';
import React from 'react';
import {
  PostSnippetFragment,
  useDeletePostMutation,
} from '../../generated/graphql';
import Updoot from '../Updoot';

type Props = {
  post: PostSnippetFragment;
  isMine: boolean;
};

export const Post = ({ post, isMine }: Props) => {
  const [{ fetching: deleteFetching }, deletePost] = useDeletePostMutation();

  return (
    <Flex key={post.id} p={4} shadow="md" borderWidth="1px">
      <Updoot post={post} />
      <Box>
        <NextLink href="/post/[id]" as={`/post/${post.id}`}>
          <Link>
            <Heading fontSize="xl">{post.title}</Heading>
          </Link>
        </NextLink>
        <Text>posted by{post.author.username}</Text>
        <Text mt={4}>{post.textSnippet}</Text>
      </Box>
      {!isMine ? null : (
        <Flex ml="auto" alignItems="flex-end">
          <IconButton
            isLoading={deleteFetching}
            aria-label="delete post"
            icon="delete"
            onClick={() => {
              deletePost({ id: post.id });
            }}
          />
          <NextLink href="/post/edit/[id]" as={`/post/edit/${post.id}`}>
            <IconButton aria-label="edit post" icon="edit" ml={2} as={Link} />
          </NextLink>
        </Flex>
      )}
    </Flex>
  );
};
