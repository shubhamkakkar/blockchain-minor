import { GraphQLError } from 'graphql';

export default async function user(context: any) {
  try {
    if (context.user) {
      return context.user;
    }
    return new GraphQLError('AUTHENTICATION NOT PROVIDED');
  } catch (e) {
    console.log('user e()', e);
    throw new GraphQLError(`Internal server user e() : ${e}`);
  }
}
