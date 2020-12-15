import jwt from 'jsonwebtoken';

import { ReturnedUser } from '../../generated/graphql';
import userHash from '../userHash/userHash';

type TTokenContent = {
  email: string;
  userId: string;
  error?: any
  user?: ReturnedUser
}
const SECRET_JWT = 'SECRET_JWT';

export function generateToken(tokenContent: TTokenContent, expiresIn?: string): string {
  return jwt.sign(tokenContent, SECRET_JWT, { expiresIn: expiresIn || '365d' });
}

export async function verifyInviteCode(token: string): Promise<boolean> {
  try {
    const tokenContent = jwt.verify(token, SECRET_JWT);
    return !!tokenContent;
  } catch (error) {
    return false;
  }
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
