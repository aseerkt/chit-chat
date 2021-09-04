import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  split,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { JWT_LOCAL_NAME } from '../constants';
import { getMainDefinition } from '@apollo/client/utilities';
import { PaginatedUsers } from '../generated/graphql';
import wsLink from './wsLink';

export default function createApolloClient() {
  let apolloClient;
  let cache;

  const httpLink = createHttpLink({ uri: 'http://localhost:5000/graphql' });

  const authLink = setContext((_, { headers }) => {
    // get the authentication token from local storage if it exists
    const token = localStorage.getItem(JWT_LOCAL_NAME);
    // return the headers to the context so httpLink can read them
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : '',
      },
    };
  });

  const splitLink = split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === 'OperationDefinition' &&
        definition.operation === 'subscription'
      );
    },
    wsLink,
    httpLink
  );

  if (!cache || !apolloClient) {
    cache = new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            allUsers: {
              keyArgs: [],
              merge(
                existing: PaginatedUsers | undefined,
                incoming: PaginatedUsers,
                { args }
              ) {
                if (args) {
                  const offset = args.offset || 0;
                  const mergedUsers = existing?.users.slice(0) || [];
                  for (let i = 0; i < incoming.users.length; ++i) {
                    mergedUsers[offset + i] = incoming.users[i];
                  }
                  return { ...incoming, users: mergedUsers };
                }
              },
            },
          },
        },
      },
    });

    apolloClient = new ApolloClient({
      link: authLink.concat(splitLink),
      cache,
    });
  }

  return { cache, apolloClient };
}
