import {
  createClient,
  dedupExchange,
  fetchExchange,
  subscriptionExchange,
} from 'urql';
import { devtoolsExchange } from '@urql/devtools';
import { createClient as createWSClient } from 'graphql-ws';
import urqlCache from './cache';

const API_URL = `${import.meta.env.VITE_API_URL}/graphql`;
export const JWT_LOCAL_NAME = 'dm-token';

const wsClient = createWSClient({
  url: API_URL.replace('http', 'ws'),
  connectionParams: {
    authToken: localStorage.getItem(JWT_LOCAL_NAME),
  },
});

const client = createClient({
  url: API_URL,
  fetchOptions: () => {
    const token = localStorage.getItem(JWT_LOCAL_NAME);
    return {
      headers: { authorization: token ? `Bearer ${token}` : '' },
    };
  },
  exchanges: [
    devtoolsExchange,
    dedupExchange,
    urqlCache,
    // urqlAuth,
    fetchExchange,
    subscriptionExchange({
      forwardSubscription(operation) {
        return {
          subscribe: (sink) => {
            const dispose = wsClient.subscribe(operation, sink as any);
            return {
              unsubscribe: dispose,
            };
          },
        };
      },
    }),
  ],
});

export default client;
