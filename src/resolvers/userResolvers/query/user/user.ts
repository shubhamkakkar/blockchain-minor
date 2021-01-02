import { GraphQLError } from 'graphql';

import { Context } from 'src/context';

export default async function user({ req: context }: Context) {
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
