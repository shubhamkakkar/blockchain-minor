// @ts-ignore
import { Crypt } from 'hybrid-crypto-js';

type TSignature = {
    message: string
    issuerPrivateKey: string,
};
interface IStringEncryption extends TSignature{
    receiverPublicKey: string
}

type TEncrypted = {
    cryptoSystemSignature: string | any;
    receiverPublicKey: string;
    message: string | any;
}

type TVerify = {
    issuerPublicKey: string,
    cryptoSystemSignature: string | any;
    message: string,
}

type TVerification = {
    issuerPublicKey: string,
    receiverPrivateKey: string,
    encryptedMessage: string
}

const crypt = new Crypt();

const signature = (
  { issuerPrivateKey, message }:TSignature,
) => crypt.signature(issuerPrivateKey, message);

const encrypted = (
  { receiverPublicKey, message, cryptoSystemSignature }:TEncrypted,
) => crypt.encrypt(receiverPublicKey, message, cryptoSystemSignature);

export const verified = (
  {
    issuerPublicKey,
    cryptoSystemSignature,
    message,
  }: TVerify,
) => crypt.verify(
  issuerPublicKey,
  cryptoSystemSignature,
  message,
);

export function stringEncryption(
  { message, issuerPrivateKey, receiverPublicKey }: IStringEncryption,
) {
  const cryptoSystemSignature = signature({
    message,
    issuerPrivateKey,
  });
  return encrypted({
    receiverPublicKey,
    message,
    cryptoSystemSignature,
  });
}

export function verification(
  {
    issuerPublicKey,
    receiverPrivateKey,
    encryptedMessage,
  }: TVerification,
) {
  const { message, cryptoSystemSignature } = crypt.decrypt(receiverPrivateKey, encryptedMessage);
  const verificationBool = verified({
    issuerPublicKey,
    cryptoSystemSignature,
    message,
  });

  if (verificationBool) {
    return message;
  }
  return false;
}
