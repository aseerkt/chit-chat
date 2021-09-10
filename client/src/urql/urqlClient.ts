import {
  createClient,
  dedupExchange,
  fetchExchange,
  subscriptionExchange,
} from 'urql';
import { createClient as createWSClient } from 'graphql-ws';
import { API_URL, JWT_LOCAL_NAME } from '../constants';
import urqlCache from './urqlCache';

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
    dedupExchange,
    urqlCache,
    // urqlAuth,
    fetchExchange,
    subscriptionExchange({
      forwardSubscription: (operation) => ({
        subscribe: (sink) => ({
          unsubscribe: wsClient.subscribe(operation, sink),
        }),
      }),
    }),
  ],
});

export default client;
