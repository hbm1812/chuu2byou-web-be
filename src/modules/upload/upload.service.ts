import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class UploadService {
  async uploadImage(file: Express.Multer.File): Promise<any> {
    console.log('Cloudinary:', cloudinary);
    if (!cloudinary || !cloudinary.uploader || !cloudinary.uploader.upload) {
      throw new Error('Cloudinary is not properly configured.');
    }

    return cloudinary.uploader.upload(file.path);
  }
}
