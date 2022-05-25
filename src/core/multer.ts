import { extname } from 'path';
import { AppConfig } from './config';

const multer = require('multer');

const { mediaSize, mediaFormat } = AppConfig;

export const MediaMulterOptions = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: mediaSize },
  fileFilter: (req, file, callback) => {
    const extension = extname(file.originalname);
    if (!extension.match(mediaFormat)) {
      callback(new Error(`Unsupported file type ${extension}`));
    }

    callback(null, true);
  },
});
