import { Markup ,Context } from 'telegraf';
import { Message } from 'telegraf/types';
import { fileStorage } from '../storage';
import { downloadImage } from '../../services/image';

export function handlePhoto() {
    return async (ctx: Context) => {
        try {
            const message = ctx.message as Message.PhotoMessage;
            const photos = message.photo;
            if (!photos || photos.length === 0) return ctx.reply("No valid image found.");

            const fileId = photos.pop()?.file_id;
            if (!fileId) return ctx.reply("No valid image found.");

            const fileLink = await ctx.telegram.getFileLink(fileId);
            const buffer = await downloadImage(fileLink.href);

            fileStorage.store(ctx.from?.id ?? 0, buffer);

            ctx.reply("Choose format:", Markup.inlineKeyboard([
                [Markup.button.callback("PNG", "convert_png"),
                Markup.button.callback("JPG", "convert_jpg")],
                [Markup.button.callback("WEBP", "convert_webp")]
            ]));
        } catch (error) {
            console.error(error);
            ctx.reply("Oops! Something went wrong.");
        }
    };
}