import bcrypt from 'bcryptjs';

const saltRounds = 10;

export function generatePasswordCrypt(password: string) {
  return bcrypt.hash(password, saltRounds)
    .then((hash) => hash)
    .catch((er) => console.log('generatePasswordCrypt() e', er));
}

export function comparePasswordCrypt(password: string, hash: string) {
  return bcrypt.compare(password, hash)
    .then((compareResp) => compareResp)
    .catch((er) => console.log('comparePasswordCrypt() e', er));
}
