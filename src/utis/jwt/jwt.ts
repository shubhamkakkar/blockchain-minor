import jwt from 'jsonwebtoken';

type TTokenContent = {
  email: string;
}
const SECRET_JWT = 'SECRET_JWT';

export function generateToken(tokenContent: TTokenContent): string {
  return jwt.sign(tokenContent, SECRET_JWT);
}

export function verifyToken(token: string) {
  const temp = jwt.verify(token, SECRET_JWT);
  console.log({ temp });
  return true;
}
