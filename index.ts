import mongoose from 'mongoose';
import { config } from 'dotenv';
import { resolve } from 'path';

import app from './src';

config({ path: resolve(__dirname, '.env') });
const { MONGO_URI_DEV = '' } = process.env;

mongoose
  .connect(MONGO_URI_DEV,
    {
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    })
  .then(() => {
    app();
  })
  .catch((er) => {
    console.log('failed to connect to mongoose', er);
  });
