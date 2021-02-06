import util from 'util';
import crypto from 'crypto';
import path from 'path';

import multer from 'multer';
import GridFsStorage from 'multer-gridfs-storage';

import { MONGO_DB } from 'src/constants';

const storage = new GridFsStorage({
  url: MONGO_DB.MONGO_URI_DEV,
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: (req, file) => new Promise((resolve, reject) => {
    crypto.randomBytes(16, (err, buf) => {
      if (err) {
        return reject(err);
      }
      const filename = buf.toString('hex') + path.extname(file.originalname);
      return {
        filename,
        bucketName: 'uploads',
      };
    });
  }),
});

export default util.promisify(multer({ storage }).single('file'));
