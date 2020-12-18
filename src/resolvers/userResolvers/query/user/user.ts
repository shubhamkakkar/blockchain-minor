import { GraphQLError } from 'graphql';

import { verifyToken } from 'utis/jwt/jwt';

export default async function user(context: any) {
  try {
    const tokenContent = await verifyToken(`${context.authorization}`);
    if (tokenContent.error) {
      return new GraphQLError(tokenContent.error || 'Authentication token not present');
    }
    return tokenContent.user;
  } catch (e) {
    console.log('user e()', e);
    throw new GraphQLError(`Internal server user e() : ${e}`);
  }
}
