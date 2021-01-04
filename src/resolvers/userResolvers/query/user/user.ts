import { GraphQLError } from 'graphql';

import { Context } from 'src/context';
import errorHandler from 'src/utis/errorHandler/errorHandler';

export default async function user({ req: context }: Context) {
  try {
    if (context.user) {
      return context.user;
    }
    return new GraphQLError('AUTHENTICATION NOT PROVIDED');
  } catch (e) {
    return errorHandler('user', e);
  }
}
