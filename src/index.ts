import { createBot } from './bot';
import { createServer } from './server';
// Initialize bot
const bot = createBot();
bot.launch();
console.log('Bot started');

// Start HTTP server
const server = createServer();

// Graceful shutdown
['SIGINT', 'SIGTERM'].forEach(signal => {
  process.once(signal, () => {
    console.log('Shutting down...');
    bot.stop(signal);
    server.close();
    process.exit(0);
  });
});