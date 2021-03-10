import mongoose from 'mongoose';

import app from './server';

import { MONGO_DB } from 'src/constants';

mongoose.connect(MONGO_DB.MONGO_URI_DEV,
  {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('DB connected');
    return app();
  })
  .catch((er:any) => {
    console.log('failed to connect to mongoose', er);
  });
