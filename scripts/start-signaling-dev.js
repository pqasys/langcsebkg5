// Standalone signaling server for Turbopack dev
const { createServer } = require('http')
const { initializeSignalingServer } = require('../lib/websocket-server.js')

// Allow Next dev on 3000 by default
if (!process.env.NEXTAUTH_URL) {
  process.env.NEXTAUTH_URL = 'http://localhost:3000'
}

const port = process.env.SIGNALING_PORT || 3001

const server = createServer((req, res) => {
  res.statusCode = 200
  res.setHeader('Content-Type', 'text/plain')
  res.end('Signaling server running')
})

initializeSignalingServer(server)

server.listen(port, () => {
  console.log(`[signaling] Ready on http://localhost:${port}`)
})


