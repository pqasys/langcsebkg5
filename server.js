const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { Server: SocketIOServer } = require('socket.io');
const { initializeSignalingServer } = require('./lib/websocket-server.js');

// Enable Turbopack
process.env.TURBOPACK = '1';

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
// Allow command line argument for port, fallback to environment variable, then default to 3000
const port = process.argv[2] || process.env.PORT || 3000;

// Prepare the Next.js app with Turbopack enabled
const app = next({ 
  dev, 
  hostname, 
  port
});
const handle = app.getRequestHandler();

app.prepare().then(() => {
  // Create HTTP server
  const server = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  });

  // Initialize WebRTC signaling server
  initializeSignalingServer(server);

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://${hostname}:${port}`);
    console.log('> WebRTC signaling server initialized');
  });
}); 