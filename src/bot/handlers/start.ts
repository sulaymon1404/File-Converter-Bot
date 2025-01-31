import { Context } from 'telegraf';

export function handleStart() {
  return (ctx: Context) => {
    ctx.reply("Welcome! Send me an image, and I'll convert it for you.");
  };
}