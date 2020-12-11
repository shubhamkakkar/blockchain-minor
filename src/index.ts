import { ApolloServer } from 'apollo-server';
import typeDefs from './typeDefs';
import resolvers from './resolvers';
import context from './context';

export default function app() {
  const server = new ApolloServer(
    {
      cors: true,
      typeDefs,
      resolvers,
      context,
    },
  );

  server.listen(
    { port: process.env.PORT || 4001 },
  )
    .then(({ url }: { url: string }) => console.log(`🚀 Server ready at ${url}`))
    .catch((er:any) => console.log('ApolloServer Error', er));
}
