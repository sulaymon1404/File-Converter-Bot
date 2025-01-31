import http from 'http';
import { config } from './config';

export function createServer() {
  return http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Bot is running');
  }).listen(config.PORT, () => {
    console.log(`Server running on port ${config.PORT}`);
  });
}