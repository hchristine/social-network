import cloudinary from 'cloudinary';
import sharp from 'sharp';
import { rm } from 'fs/promises';
import { join } from 'path';
import { config } from '../config';

class Uploader {
    constructor() {
        cloudinary.v2.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET
        });
    }

    async upload(path: string): Promise<string> {
        const data = await cloudinary.v2.uploader.upload(path);
        return data.url;
    }

    async resizeImage(path: string): Promise<string> {
        const newFileName = join(process.cwd(), config.FILE_UPLOAD_PATH, `${Date.now()}.jpeg`);

        return sharp(path)
        .resize(200, 200, {
            fit: 'contain'
        })
        .jpeg()
        .toFile(newFileName)
        .then(() => rm(path))
        .then(() => newFileName)
    }
}

export const uploader = new Uploader();

