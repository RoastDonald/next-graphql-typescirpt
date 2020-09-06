import { useRouter } from 'next/router';
import { usePostQuery } from '../generated/graphql';

export const usePost = () => {
  const router = useRouter();
  const postId =
    typeof router.query.id === 'string' ? parseInt(router.query.id, 10) : -1;

  const [{ data, fetching, error }] = usePostQuery({
    pause: postId === -1,
    variables: {
      id: postId,
    },
  });
  return [{ postId, data, fetching, error }];
};
