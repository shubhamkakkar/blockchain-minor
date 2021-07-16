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
    privateKey: {
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

// UserSchema.index({
//   firstName: 'text', lastName: 'text', middleName: 'text', email: 'text',
// });

// UserSchema.index({
//   firstName: 1,
//   lastName: 1,
//   middleName: 1,
//   email: 1,
// });

export default model('User', UserSchema);
