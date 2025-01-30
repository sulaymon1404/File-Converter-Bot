import dotenv from "dotenv";
dotenv.config();
import { Telegraf, Markup, Context } from "telegraf";
import sharp from "sharp";
import axios from "axios";


const bot = new Telegraf(process.env.TELEGRAM_API_TOKEN as string);

// Store user image buffers
const userFiles = new Map<number, Buffer>();

bot.start((ctx: Context) => {
    ctx.reply("Welcome! Send me an image, and I'll convert it for you.");
});

// Handle image upload
bot.on("photo", async (ctx) => {
    try {
        const fileId = ctx.message.photo.pop()?.file_id;
        if (!fileId) return ctx.reply("No valid image found.");

        const fileLink = await ctx.telegram.getFileLink(fileId);

        // Download the image
        const response = await axios({ url: fileLink.href, responseType: "arraybuffer" });
        const inputBuffer = Buffer.from(response.data);

        // Store file buffer with user ID
        userFiles.set(ctx.from?.id?? 0, inputBuffer);

        // Ask the user for format
        ctx.reply("Choose a format to convert to:", Markup.inlineKeyboard([
            [Markup.button.callback("PNG", "convert_png"), Markup.button.callback("JPG", "convert_jpg")],
            [Markup.button.callback("WEBP", "convert_webp")]
        ]));
    } catch (error) {
        console.error(error);
        ctx.reply("Oops! Something went wrong. Try again.");
    }
});

// Handle conversion
bot.action(/^convert_(.+)$/, async (ctx) => {
    const format = ctx.match[1] as "png" | "jpeg" | "webp"; // Restrict formats
    const userId = ctx.from?.id ?? 0;

    if (!userFiles.has(userId)) {
        return ctx.reply("Please send an image first.");
    }

    const inputBuffer = userFiles.get(userId) as Buffer;

    try {
        const outputBuffer = await sharp(inputBuffer).toFormat(format)
        await ctx.replyWithDocument({ source: outputBuffer, filename: `converted.${format}` });

        // TODO: Save the file to disk or upload to a cloud storage
        userFiles.delete(userId);
    } catch (error) {
        console.error(error);
        ctx.reply("Error converting the image. Please try again.");
    }
});

bot.launch();
console.log("Bot is running...");

// Graceful shutdown
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));


