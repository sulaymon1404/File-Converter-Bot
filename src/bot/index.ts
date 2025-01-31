import { Telegraf } from 'telegraf';
import { config } from '../config';
import { handleStart } from './handlers/start';
import { handlePhoto } from './handlers/photo';
import { handleConvert } from './handlers/convert';

export function createBot() {
  const bot = new Telegraf(config.TELEGRAM_TOKEN);

  bot.start(handleStart());
  bot.on('photo', handlePhoto());
  bot.action(/^convert_(.+)$/, handleConvert());

  return bot;
}