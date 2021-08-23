import 'reflect-metadata';
import { createConnection } from 'typeorm';
import { errorLog, successLog } from './utils/chalkLogs';
import createApp from './app';

async function startServer() {
  await createConnection();
  const { app } = await createApp();

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () =>
    console.log(successLog(`GraphQL API: http://localhost:${PORT}/graphql`))
  );
}

startServer().catch((err) => console.error(errorLog(err)));
