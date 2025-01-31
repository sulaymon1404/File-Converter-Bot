import { Context } from 'telegraf';
import { fileStorage } from '../storage';
import { convertImage } from '../../services/image';

export function handleConvert() {
  return async (ctx: Context & { match: RegExpExecArray }) => {
    const format = ctx.match[1].toLowerCase() as 'png' | 'jpeg' | 'webp';
    const userId = ctx.from?.id ?? 0;
    const buffer = fileStorage.get(userId);

    if (!buffer) return ctx.reply("Please send an image first.");

    try {
      const converted = await convertImage(buffer, format);
      await ctx.replyWithDocument({
        source: converted,
        filename: `converted.${format}`
      });
      fileStorage.delete(userId);
    } catch (error) {
      console.error(error);
      ctx.reply("Error converting image.");
    }
  };
}