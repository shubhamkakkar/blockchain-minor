import { GraphQLError } from 'graphql';
import { verifyToken } from '../../../utis/jwt/jwt';

export default function publicLedger(context: any) {
  const tokenContent = verifyToken(context.authorization);
  if (tokenContent) {
    const { userId } = tokenContent;
  } else {
    throw new GraphQLError('Authentication token not present');
  }
}
