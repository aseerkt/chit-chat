import 'reflect-metadata';
import http from 'http';
import path from 'path';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { execute, subscribe } from 'graphql';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { createConnection } from 'typeorm';
import {
  ApolloServerPluginLandingPageProductionDefault,
  ApolloServerPluginLandingPageGraphQLPlayground,
} from 'apollo-server-core';
import { errorLog, successLog } from './utils/chalkLogs';
import { __prod__ } from './constants';
import { buildSchema } from 'type-graphql';
import createUserLoader from './dataloaders/userLoader';
import createMemberLoader from './dataloaders/memberLoader';

async function startServer() {
  await createConnection();
  const app = express();

  const schema = await buildSchema({
    resolvers: [path.join(__dirname, './resolvers/*.{j,t}s')],
  });

  const httpServer = http.createServer(app);
  const subscriptionServer = SubscriptionServer.create(
    {
      schema,
      execute,
      subscribe,
    },
    {
      server: httpServer,
      path: '/graphql',
    }
  );
  const apolloServer = new ApolloServer({
    schema,
    context: ({ req, res }) => ({
      req,
      res,
      userLoader: createUserLoader(),
      memberLoader: createMemberLoader(),
    }),
    plugins: [
      {
        async serverWillStart() {
          return {
            async drainServer() {
              subscriptionServer.close();
            },
          };
        },
      },
      __prod__
        ? ApolloServerPluginLandingPageProductionDefault
        : ApolloServerPluginLandingPageGraphQLPlayground,
    ],
  });
  await apolloServer.start();
  apolloServer.applyMiddleware({ app });

  const PORT = process.env.PORT || 5000;
  httpServer.listen(PORT, () =>
    console.log(successLog(`GraphQL API: http://localhost:${PORT}/graphql`))
  );
}

startServer().catch((err) => console.error(errorLog(err)));
