import 'reflect-metadata';
import 'dotenv-safe/config';
import path from 'path';
import cors from 'cors';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import ws from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import { createConnection } from 'typeorm';
import {
  ApolloServerPluginLandingPageProductionDefault,
  ApolloServerPluginLandingPageGraphQLPlayground,
} from 'apollo-server-core';
import { errorLog, successLog } from './utils/chalkLogs';
import { __prod__ } from './constants';
import { buildSchema } from 'type-graphql';
import userLoader from './dataloaders/userLoader';
import memberLoader from './dataloaders/memberLoader';
import msgLoader from './dataloaders/messageLoader';
import ormconfig from './ormconfig';
import { getPayload } from './utils/jwtHelper';

async function startServer() {
  await createConnection(ormconfig);
  const app = express();

  if (__prod__) {
    app.use(express.static('client/build'));
    app.get('*', (_req, res) => {
      res.sendFile(
        path.resolve(__dirname, '..', 'client', 'build', 'index.html')
      );
    });
  } else app.use(cors({ origin: 'http://localhost:3000' }));

  const schema = await buildSchema({
    resolvers: [path.join(__dirname, './resolvers/**/*.resolver.{j,t}s')],
  });

  const apolloServer = new ApolloServer({
    schema,
    context: ({ req, res }) => ({
      req,
      res,
      userLoader,
      memberLoader,
      msgLoader,
    }),
    plugins: [
      __prod__
        ? ApolloServerPluginLandingPageProductionDefault
        : ApolloServerPluginLandingPageGraphQLPlayground,
    ],
  });
  await apolloServer.start();
  apolloServer.applyMiddleware({ app });

  const PORT = process.env.PORT || 5000;

  const server = app.listen(PORT, () => {
    const wsServer = new ws.Server({
      server: server,
      path: '/graphql',
    });

    useServer(
      {
        schema,
        context: (ctx) => {
          const token = ctx.connectionParams?.authToken as string | undefined;
          if (!token) {
            throw new Error('WS Token missing');
          }
          const payload: any = getPayload(token);
          return { userLoader, userId: payload.userId };
        },
      },
      wsServer
    );

    console.log(successLog(`GraphQL API: http://localhost:${PORT}/graphql`));
  });
}

startServer().catch((err) => {
  console.error(errorLog(err));
  console.error(err);
});
