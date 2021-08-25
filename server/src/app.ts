import 'reflect-metadata';
import path from 'path';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import {
  ApolloServerPluginLandingPageProductionDefault,
  ApolloServerPluginLandingPageGraphQLPlayground,
} from 'apollo-server-core';
import { buildSchema } from 'type-graphql';
import { __prod__ } from './constants';
import createUserLoader from './dataloaders/userLoader';
import createMemberLoader from './dataloaders/memberLoader';

export default async function createApp() {
  const app = express();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [path.join(__dirname, './resolvers/*.{j,t}s')],
    }),
    context: ({ req, res }) => ({
      req,
      res,
      userLoader: createUserLoader(),
      memberLoader: createMemberLoader(),
    }),
    plugins: [
      __prod__
        ? ApolloServerPluginLandingPageProductionDefault
        : ApolloServerPluginLandingPageGraphQLPlayground,
    ],
  });
  await apolloServer.start();
  apolloServer.applyMiddleware({ app });

  return { app };
}
