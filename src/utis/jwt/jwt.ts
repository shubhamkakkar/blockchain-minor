import jwt from 'jsonwebtoken';

type TTokenContent = {
  email: string;
  userId: string;
}
const SECRET_JWT = 'SECRET_JWT';

export function generateToken(tokenContent: TTokenContent): string {
  return jwt.sign(tokenContent, SECRET_JWT);
}

export function verifyToken(token: string) {
  return jwt.verify(token, SECRET_JWT) as TTokenContent;
}

export function encryptMessageForRequestedBlock(message: string, secretKey: string) {
  return jwt.sign(message, secretKey);
}

export function decryptMessageForRequestedBlock(message: string, secretKey: string) {
  return jwt.verify(message, secretKey);
}
