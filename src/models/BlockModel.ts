import { Schema, model } from 'mongoose';

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
  },
  { collection: 'Blockchain' },
);
export default model('BlockModel', BlockModel);
