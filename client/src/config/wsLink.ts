import {
  ApolloLink,
  Operation,
  FetchResult,
  Observable,
} from '@apollo/client/core';
import { print, GraphQLError } from 'graphql';
import { createClient, ClientOptions, Client } from 'graphql-ws';
import { API_URL, JWT_LOCAL_NAME } from '../constants';

class WebSocketLink extends ApolloLink {
  private client: Client;

  constructor(options: ClientOptions) {
    super();
    this.client = createClient(options);
  }

  public request(operation: Operation): Observable<FetchResult> {
    return new Observable((sink) => {
      return this.client.subscribe<FetchResult>(
        { ...operation, query: print(operation.query) },
        {
          next: sink.next.bind(sink),
          complete: sink.complete.bind(sink),
          error: (err) => {
            if (err instanceof Error) {
              return sink.error(err);
            }

            if (err instanceof CloseEvent) {
              return sink.error(
                // reason will be available on clean closes
                new Error(
                  `Socket closed with event ${err.code} ${err.reason || ''}`
                )
              );
            }

            return sink.error(
              new Error(
                (err as GraphQLError[]).map(({ message }) => message).join(', ')
              )
            );
          },
        }
      );
    });
  }
}

const wsLink = new WebSocketLink({
  url: API_URL.replace('http', 'ws'),
  connectionParams: () => {
    const token = localStorage.getItem(JWT_LOCAL_NAME);
    if (!token) return {};
    return {
      Authorization: `Bearer ${token}`,
    };
  },
});

export default wsLink;
