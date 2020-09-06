import {
  dedupExchange,
  Exchange,
  fetchExchange,
  stringifyVariables,
} from 'urql';
import {
  LogoutMutation,
  MeQuery,
  MeDocument,
  SignInMutation,
  SignUpMutation,
  MutationVoteArgs,
  DeletePostMutationVariables,
} from '../generated/graphql';
import { pipe, tap } from 'wonka';
import { _updateQuery } from './_updateQuery';
import { cacheExchange, Resolver, Cache } from '@urql/exchange-graphcache';
import Router from 'next/router';
import gql from 'graphql-tag';
import { isServer } from './isServer';

const errorExchange: Exchange = ({ forward }) => (ops$) => {
  return pipe(
    forward(ops$),
    tap(({ error }) => {
      if (error?.message.includes('not authenticated')) {
        Router.replace('/signin');
      }
    })
  );
};

const cursorPagination = (): Resolver => {
  return (_parent, fieldArgs, cache, info) => {
    const { parentKey: entityKey, fieldName } = info;
    const allFields = cache.inspectFields(entityKey);
    const fieldInfos = allFields.filter((info) => info.fieldName === fieldName);
    const size = fieldInfos.length;
    if (size === 0) {
      return undefined;
    }
    const fieldKey = `${fieldName}(${stringifyVariables(fieldArgs)})`;
    const isItInTheCache = cache.resolve(
      cache.resolveFieldByKey(entityKey, fieldKey) as string,
      'posts'
    );
    info.partial = !isItInTheCache;
    let hasMore = true;
    const results: string[] = [];
    fieldInfos.forEach((fi) => {
      const key = cache.resolveFieldByKey(entityKey, fi.fieldKey) as string;
      const data = cache.resolve(key, 'posts') as string[];
      const _hasMore = cache.resolve(key, 'hasMore');
      if (!_hasMore) {
        hasMore = _hasMore as boolean;
      }
      results.push(...data);
    });

    return {
      __typename: 'PaginatedPosts',
      hasMore,
      posts: results,
    };
  };
};

const invalidatePosts = (cache: Cache) => {
  const querySection = cache.inspectFields('Query');
  const fieldInfos = querySection.filter(
    (query) => query.fieldName === 'posts'
  );
  fieldInfos.forEach((field) => {
    cache.invalidate('Query', 'posts', field.arguments || {});
  });
};

export const createUrqlClient = (ssrExchange: any, ctx: any) => {
  let cookie = '';
  if (isServer()) {
    cookie = ctx?.req?.headers?.cookie;
  }
  console.log(cookie);
  return {
    url: 'http://localhost:4000/graphql',
    fetchOptions: {
      credentials: 'include',
      headers: cookie ? { cookie } : undefined,
    } as const,

    exchanges: [
      dedupExchange,
      cacheExchange({
        keys: {
          PaginatedPosts: () => null,
        },
        resolvers: {
          Query: {
            posts: cursorPagination(),
          },
        },
        updates: {
          Mutation: {
            deletePost: (_result, args, cache, info) => {
              cache.invalidate({
                __typename: 'Post',
                id: (args as DeletePostMutationVariables).id,
              });
            },
            vote: (_result, args, cache, info) => {
              const { postId, value } = args as MutationVoteArgs;
              const data = cache.readFragment(
                gql`
                  fragment _ on Post {
                    id
                    points
                    voteStatus
                  }
                `,
                { id: postId } as any
              );
              if (data) {
                if (data.voteStatus == value) {
                  return;
                }
                console.log(data.voteStatus);
                const newValue =
                  (data.points as number) + (!data.voteStatus ? 1 : 2) * value;
                cache.writeFragment(
                  gql`
                    fragment __ on Post {
                      points
                      voteStatus
                    }
                  `,
                  { id: postId, points: newValue, voteStatus: value } as any
                );
              }
            },
            createPost: (_result, args, cache, info) => {
              invalidatePosts();
            },
            logout: (_result, args, cache, info) => {
              _updateQuery<LogoutMutation, MeQuery>(
                cache,
                { query: MeDocument },
                _result,
                () => ({ me: null })
              );
            },
            signIn: (_result, args, cache, info) => {
              try {
                cache.updateQuery({ query: MeDocument }, (data) => {
                  _updateQuery<SignInMutation, MeQuery>(
                    cache,
                    { query: MeDocument },
                    _result,
                    (result, query) => {
                      if (result.signIn.errors) {
                        return query;
                      } else {
                        return { me: result.signIn.user };
                      }
                    }
                  );
                });
              } catch (e) {
                console.log(e);
              }
              invalidatePosts(cache);
            },
            signUp: (_result, args, cache, info) => {
              try {
                cache.updateQuery({ query: MeDocument }, (data) => {
                  _updateQuery<SignUpMutation, MeQuery>(
                    cache,
                    { query: MeDocument },
                    _result,
                    (result, query) => {
                      if (result.signUp.errors) return query;
                      else return { me: result.signUp.user };
                    }
                  );
                });
              } catch (e) {
                console.log(e);
              }
              invalidatePosts(cache);
            },
          },
        },
      }),
      errorExchange,
      ssrExchange,
      fetchExchange,
    ],
  };
};
