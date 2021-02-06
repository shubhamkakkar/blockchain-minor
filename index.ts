import mongoose from 'mongoose';
import { MONGO_DB } from 'src/constants';

import app from './src';

const connection = mongoose.createConnection(MONGO_DB.MONGO_URI_DEV,
  {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  });

connection.once('open', () => {
  const gfs = new mongoose.mongo.GridFSBucket(connection.db, {
    bucketName: 'uploads',
  });
  console.log('DB connected');
  return app(gfs);
});
