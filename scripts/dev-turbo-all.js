// Starts WebRTC signaling server and Next dev with Turbopack in one command
const { spawn } = require('child_process')

process.env.TURBOPACK = '1'

function run(cmd, args, opts = {}) {
  return spawn(cmd, args, { stdio: 'inherit', env: process.env, ...opts })
}

// 1) Start signaling server
const signaling = run('node', ['scripts/start-signaling-dev.js'])
signaling.on('error', (e) => console.error('[signaling] error', e))

// 2) Start Next dev with Turbopack (use resolved CLI path for Windows reliability)
const nextDevCli = require.resolve('next/dist/cli/next-dev.js')
console.log('[next] Starting Turbopack dev on http://localhost:3000')
// Start Next dev directly via CLI (env TURBOPACK already set above)
const nextDev = run('node', [nextDevCli])
nextDev.on('error', (e) => console.error('[next] error', e))

function shutdown() {
  try { signaling.kill() } catch {}
  try { nextDev.kill() } catch {}
  process.exit(0)
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)


