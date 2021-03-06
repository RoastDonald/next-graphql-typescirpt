import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useMeQuery } from '../generated/graphql';

export const useAuthCheck = () => {
  const [{ data, fetching }] = useMeQuery();
  const router = useRouter();

  useEffect(() => {
    if (!data?.me && !fetching) {
      router.replace('/signin?next=' + router.pathname);
    }
  }, [fetching, data, router]);
};
