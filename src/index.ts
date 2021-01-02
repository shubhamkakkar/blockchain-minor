import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import bodyParser from 'body-parser';
import redis from 'redis';

import typeDefs from './typeDefs';
import resolvers from './resolvers';
import context from './context';

export default function app() {
  const expressApp = express();
  const client = redis.createClient({
    host: process.env.REDIS_DB_HOST,
    port: Number(process.env.REDIS_DB_PORT) || 6379,
  });

  expressApp.use(bodyParser.json());
  const server = new ApolloServer(
    {
      typeDefs,
      resolvers,
      context: ({ req }: { req: express.Request }) => context({ req, client }),
    },
  );
  server.applyMiddleware({ app: expressApp });
  const port = Number(process.env.PORT) || 4001;
  expressApp.listen(
    port, '0.0.0.0', () => {
      console.log(`Server up and running on port ${port}`);
    },
  );
}
