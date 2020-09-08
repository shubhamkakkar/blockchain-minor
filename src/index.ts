import { ApolloServer } from 'apollo-server'
import typeDefs from './typeDefs'
import resolvers from './resolvers'


export default function app() {
    const server = new ApolloServer({ typeDefs, resolvers });
    server
        .listen(
            { port: process.env.PORT || 4000 }
    )
        .then(({ url }: { url: string }) => console.log(`🚀 Server ready at ${url}`))
        .catch( er => console.log("ApolloServer Error", er) );
}