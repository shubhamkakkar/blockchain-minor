/* eslint-disable no-underscore-dangle */
import { GraphQLError } from 'graphql';
import ValidationContract from '../../../../utis/validator/validator';
import { TLoginArgs } from '../../../../generated/graphql';
import UserModel from '../../../../models/UserModel';
import { generateToken } from '../../../../utis/jwt/jwt';

export default function loginUser(args: TLoginArgs) {
  const contract = new ValidationContract();
  const {
    email,
    password,
  } = args;

  contract.isEmail(email, 'Email is invalid');
  contract.hasMinLen(password, 6, 'password should be of at least 6 characters');

  if (!contract.isValid()) {
    return new GraphQLError(contract.errors() || 'Review Signup information');
  }

  return UserModel
    .findOne({ email })
    .then((user) => {
      if (user) {
        // eslint-disable-next-line no-underscore-dangle
        const token = generateToken({ email, userId: user._id });
        console.log({ user: { ...user } });
        return {
          // @ts-ignore
          ...user._doc,
          token,
        };
      }
      return new GraphQLError('user does not exists');
    })
    .catch((er) => console.log('login e', er));
}
