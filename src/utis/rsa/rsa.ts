// @ts-ignore
import { RSA } from 'hybrid-crypto-js';

type TKeys = { publicKey: string; privateKey: string };
interface TReturnUserProfileKeys extends Partial<TKeys> {
    isError ?: null
}

const rsa = new RSA();

export async function userProfileKeys(): Promise<TReturnUserProfileKeys> {
  const isError = null;
  try {
    const keys = await rsa.generateKeyPairAsync() as TKeys;
    return {
      ...keys,
      isError,
    };
  } catch (e) {
    return {
      isError,
    };
  }
}
