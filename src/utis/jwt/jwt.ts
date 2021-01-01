import jwt, { Secret } from 'jsonwebtoken';
import dotenv from 'dotenv';

import { ReturnedUser } from 'src/generated/graphql';
import UserModel from 'src/models/UserModel';

type TTokenContent = {
  error?: any
  user?: ReturnedUser
}

dotenv.config();
const SECRET = (process.env.SECRET_JWT || '') as Secret;

export function generateToken(id: string): string {
  return jwt.sign({ id }, SECRET, { expiresIn: '365d' });
}

export async function verifyToken(token: string):Promise<TTokenContent> {
  try {
    const { id } = await jwt.verify(token, SECRET) as { id?: string };
    return {
      user: await UserModel.findById(id).lean() as ReturnedUser,
    };
  } catch (e) {
    console.log('verifyToken e()', e);
    return {
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
