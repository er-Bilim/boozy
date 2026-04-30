import multer from 'multer';
import path from 'path';
import config from '../config.ts';
import fs from 'fs/promises';
import { randomUUID } from 'crypto';

const createStorage = (subDir: string) => {
  return multer.diskStorage({
    destination: async (_req, _file, cb) => {
      const destDir = path.join(config.publicPath, subDir);
      await fs.mkdir(destDir, { recursive: true });
      cb(null, destDir);
    },
    filename: (_req, file, cb) => {
      const extension = path.extname(file.originalname);
      cb(null, randomUUID() + extension);
    },
  });
};

export const imagesUpload = multer({
  storage: createStorage('images'),
});
export const cocktailUpload = multer({
  storage: createStorage('uploads/cocktails'),
});
