// @ts-ignore
import { Crypt } from 'hybrid-crypto-js';

type TSignature = { privateKey: string, message: string };
type TEncrypted = {
    cryptoSystemSignature: string | any;
    publicKey: string;
    message: string | any;
}
type TVerify = {
    publicKey: string,
    cryptoSystemSignature: string,
    message: string,
}
type TVerification = {
    publicKey: string,
    privateKey: string,
    encryptedMessage: string
}

const crypt = new Crypt();

const signature = (
  /*
  * this privateKey is issuerPrivateKey
  * */
  { privateKey, message }:TSignature,
) => crypt.signature(privateKey, message);

const encrypted = (
  /*
   *  this publicKey is receiverPublicKey
   *  */
  { publicKey, message, cryptoSystemSignature }:TEncrypted,
) => crypt.encrypt(publicKey, message, cryptoSystemSignature);

export const verified = (
  {
    publicKey,
    cryptoSystemSignature,
    message,
  }: TVerify,
) => crypt.verify(
  publicKey,
  cryptoSystemSignature,
  message,
);

export function stringEncryption(
  /*
   * this privateKey is issuerPrivateKey
   * this publicKey is receiverPublicKey
   * TODO: RENAME variables
   * */
  { message, privateKey, publicKey }: { message: string, privateKey: string, publicKey: string },
) {
  const cryptoSystemSignature = signature({
    message,
    privateKey,
  });
  return encrypted({ publicKey, message, cryptoSystemSignature });
}

export function verification(
  /*
   * this privateKey is receiverPrivateKey
   * this publicKey is issuerPublicKey
   * TODO: RENAME variables
   * */
  {
    publicKey,
    encryptedMessage,
    privateKey,
  }: TVerification,
) {
  const { message, cryptoSystemSignature } = crypt.decrypt(privateKey, encryptedMessage);
  const verificationBool = verified({
    publicKey,
    cryptoSystemSignature,
    message,
  });

  console.log('verification', verificationBool);

  if (verificationBool) {
    return message;
  }
  return false;
}
