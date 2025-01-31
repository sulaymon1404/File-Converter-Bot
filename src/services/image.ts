import axios from 'axios';
import sharp from 'sharp';

export async function downloadImage(url: string) {
  const response = await axios({ url, responseType: 'arraybuffer' });
  return Buffer.from(response.data);
}

export async function convertImage(buffer: Buffer, format: 'png' | 'jpeg' | 'webp') {
  return sharp(buffer).toFormat(format);
}