import { Schema, model } from 'mongoose';

const RequestBlockSchema = new Schema({
  message: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  requestAt: {
    type: Date,
    default: Date.now(),
  },
},
{ collection: 'RequestBlock' });

export default model('RequestBlock', RequestBlockSchema);
