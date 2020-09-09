import bcrypt from 'bcryptjs';

const saltRounds = 10;

export async function generatePasswordCrypt(password: string) {
  return bcrypt.hash(password, saltRounds)
    .then((hash) => hash)
    .catch((er) => console.log('generatePasswordCrypt*() e', er));
}
