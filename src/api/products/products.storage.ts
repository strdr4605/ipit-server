import { Bucket, Storage } from '@google-cloud/storage';
import { Injectable } from '@nestjs/common';
import * as sharp from 'sharp';

import { AppConfig } from '../../core';

const { mediaDimensions, mediaQuality } = AppConfig;

@Injectable()
export class ProductsStorage {
  private readonly _storage: Storage;
  private readonly _bucket: Bucket;

  constructor() {
    this._storage = new Storage({
      keyFilename: 'google-cloud-keys.json',
      projectId: 'ipit-321513',
    });
    this._bucket = this._storage.bucket('products.ipit.io');
  }

  public uploadImage(file: any, productId: number): Promise<string> {
    return new Promise(async (resolve, reject) => {
      const fileName = `product-${productId}.webp`;
      const fileBuffer = await sharp(file.buffer)
        .rotate()
        .resize(mediaDimensions.width, mediaDimensions.height)
        .webp({ quality: mediaQuality })
        .toBuffer();

      this._bucket
        .file(fileName)
        .createWriteStream({ resumable: false })
        .on('finish', () => {
          resolve(
            `https://storage.googleapis.com/${this._bucket.name}/${fileName}`,
          );
        })
        .on('error', reject)
        .end(fileBuffer);
    });
  }

  public async removeImage(filePath: string): Promise<unknown> {
    const fileName = filePath.slice(filePath.lastIndexOf('/') + 1);
    const [fileExists] = await this._bucket.file(fileName).exists();
    if (fileExists) {
      return this._bucket.file(fileName).delete();
    }
  }
}
