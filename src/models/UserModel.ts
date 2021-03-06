import { Schema, model } from 'mongoose';

import { USER_ROLE_TYPE } from 'src/constants';

const UserSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    middleName: {
      type: String,
      default: '',
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    publicKey: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: USER_ROLE_TYPE.USER,
    },
  },
  { collection: 'User' },
);

export default model('User', UserSchema);
