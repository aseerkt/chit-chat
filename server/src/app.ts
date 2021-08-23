import path from 'path';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';

export default async function createApp() {
  const app = express();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [path.join(__dirname, './resolvers/*.{j,t}s')],
    }),
  });
  await apolloServer.start();
  apolloServer.applyMiddleware({ app });

  return { app };
}
