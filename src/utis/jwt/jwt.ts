import jwt from 'jsonwebtoken';

type TTokenContent = {
  email: string;
  userId: string;
  error?: any
}
const SECRET_JWT = 'SECRET_JWT';

export function generateToken(tokenContent: TTokenContent): string {
  return jwt.sign(tokenContent, SECRET_JWT, { expiresIn: '365d' });
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, SECRET_JWT) as TTokenContent;
  } catch (error) {
    return {
      userId: '',
      email: '',
      error,
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
