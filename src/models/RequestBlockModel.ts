import { Schema, model } from 'mongoose';

import { RequestedBlockMessage } from 'src/generated/graphql';

const RequestBlockSchema = new Schema(
  {
    message: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    messageType: {
      type: String,
      enum: [
        RequestedBlockMessage.InsuranceInformation,
        RequestedBlockMessage.MedicalReports,
        RequestedBlockMessage.PersonalMedicalInformation,
      ],
      required: true,
    },
    requestAt: {
      type: Date,
      default: Date.now(),
    },
    acceptCount: {
      type: Number,
      default: 0,
    },
    rejectCount: {
      type: Number,
      default: 0,
    },
    votedUsers: {
      type: [String],
      default: [],
      required: true,
    },
  },
  { collection: 'RequestBlock' },
);

export default model('RequestBlock', RequestBlockSchema);
