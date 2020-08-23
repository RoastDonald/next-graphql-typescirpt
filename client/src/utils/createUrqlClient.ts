import { dedupExchange, fetchExchange } from 'urql';
import {
  LogoutMutation,
  MeQuery,
  MeDocument,
  SignInMutation,
  SignUpMutation,
} from '../generated/graphql';
import { _updateQuery } from './_updateQuery';
import { cacheExchange } from '@urql/exchange-graphcache';
export const createUrqlClient = (ssrExchange) => ({
  url: 'http://localhost:4000/graphql',
  fetchOptions: {
    credentials: 'include',
  } as const,
  exchanges: [
    dedupExchange,
    cacheExchange({
      updates: {
        Mutation: {
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
          },
        },
      },
    }),
    ssrExchange,
    fetchExchange,
  ],
});
