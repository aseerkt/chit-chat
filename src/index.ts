import 'reflect-metadata';
import 'dotenv/config';
import path from 'path';
import http from 'http';
import cors from 'cors';
import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import { errorLog, successLog } from './utils/chalkLogs';
import { __prod__ } from './constants';
import { buildSchema } from 'type-graphql';
import userLoader from './dataloaders/user.loader';
import memberLoader from './dataloaders/member.loader';
import msgLoader from './dataloaders/message.loader';
import { getPayload } from './utils/jwtHelper';
import { MyContext } from './types/global.types';
import { AppDataSource } from './data-source';

async function startServer() {
  await AppDataSource.initialize();
  const app = express();
  const httpServer = http.createServer(app);

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

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/graphql',
  });

  const wsServerCleanup = useServer(
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

  const apolloServer = new ApolloServer<MyContext>({
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await wsServerCleanup.dispose();
            },
          };
        },
      },
    ],
  });
  await apolloServer.start();

  app.use(
    '/graphql',
    express.json(),
    expressMiddleware(apolloServer, {
      context: async ({ req, res }) => ({
        req,
        res,
        userLoader,
        memberLoader,
        msgLoader,
      }),
    })
  );

  const PORT = process.env.PORT || 5000;

  httpServer.listen(PORT, () => {
    console.log(successLog(`GraphQL API: http://localhost:${PORT}/graphql`));
  });
}

startServer().catch((err) => {
  console.error(errorLog(err));
  console.error(err);
});
