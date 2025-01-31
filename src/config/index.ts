import dotenv from 'dotenv';

dotenv.config();

export const config = {
  TELEGRAM_TOKEN: process.env.TELEGRAM_API_TOKEN as string,
  PORT: parseInt(process.env.PORT || '3000'),
  NODE_ENV: process.env.NODE_ENV || 'development'
};