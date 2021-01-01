import { Schema, model } from 'mongoose';

const sharedSchema = new Schema({
  encryptedMessage: {
    type: String,
    required: true,
  },
  recipientUser: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  sharedAt: {
    type: Date,
    default: new Date(),
  },
});

const BlockModel = new Schema(
  {
    data: {
      type: String,
      required: true,
    },
    prevHash: {
      type: String,
      required: true,
    },
    hash: {
      type: String,
      required: true,
    },
    timeStamp: {
      type: Date,
      required: true,
    },
    nounce: {
      type: Number,
      required: true,
    },
    ownerId: {
      type: String,
      required: true,
    },
    shared: {
      type: [sharedSchema],
      required: false,
      default: [],
    },
    createdAt: {
      type: Date,
      default: new Date(),
    },
  },
  { collection: 'Blockchain' },
);
export default model('BlockModel', BlockModel);
