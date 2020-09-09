import jwt from 'jsonwebtoken';

const SECRET_JWT = 'SECRET_JWT';

export function generateToken(password: any): string {
  return jwt.sign(password, SECRET_JWT);
}
