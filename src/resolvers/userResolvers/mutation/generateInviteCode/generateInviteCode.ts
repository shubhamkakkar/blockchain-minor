import { GraphQLError } from 'graphql';

import { generateToken, verifyToken } from '../../../../utis/jwt/jwt';

export default async function generateInviteCode(context: any) {
  try {
    const tokenContent = await verifyToken(`${context.authorization}`);
    if (tokenContent.error) {
      return new GraphQLError(tokenContent.error || 'Authentication token not present');
    }
    if (tokenContent.user?.role !== 'admin') {
      return new GraphQLError('You can not generate an invite code');
    }
    const inviteTokenContent = {
      email: 'false-email',
      userId: 'false-user-id',
    };
    const code = generateToken(inviteTokenContent, '7d');
    return {
      code,
    };
  } catch (e) {
    console.log('generateInviteCode e()', e);
    throw new GraphQLError(`Internal server generateInviteCode e() : ${e}`);
  }
}
