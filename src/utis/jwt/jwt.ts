import jwt from 'jsonwebtoken';

import { ReturnedUser } from 'src/generated/graphql';
import userHash from 'src/utis/userHash/userHash';

type TTokenContent = {
  email: string;
  userId: string;
  error?: any
  user?: ReturnedUser
}
const SECRET_JWT = 'SECRET_JWT';

export function generateToken(tokenContent: TTokenContent): string {
  return jwt.sign(tokenContent, SECRET_JWT, { expiresIn: '365d' });
}

export async function verifyToken(token: string) {
  try {
    const tokenContent = jwt.verify(token, SECRET_JWT) as TTokenContent;
    const user = await userHash(tokenContent.userId);
    if (user) {
      tokenContent.user = user;
      return tokenContent;
    }
    return {
      userId: '',
      email: '',
      error: 'Invalid authentication',
    };
  } catch (error) {
    return {
      userId: '',
      email: '',
      error: 'Authentication token not provided',
    };
  }
}

export function encryptMessageForRequestedBlock(message: string, secretKey: string) {
  return jwt.sign(message, secretKey);
}

export function decryptMessageForRequestedBlock(message: string, secretKey: string) {
  try {
    return jwt.verify(message, secretKey);
  } catch (e) {
    console.log('decryptMessageForRequestedBlock e()', e);
    return '';
  }
}
