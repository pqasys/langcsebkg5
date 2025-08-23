# Realtime Signaling Server and Dev Workflow (Turbopack)

This document explains what the signaling server does, when you need it, and how to run the app in development and production environments. It also covers Windows-specific notes and common troubleshooting steps.

## What the signaling server is (and isn’t)

- Purpose: Enable realtime WebRTC features (Live Classes / Live Conversations) by relaying signaling messages between browsers.
- It handles:
  - Room join/leave, presence, and basic participant lists
  - Exchanging SDP offers/answers and ICE candidates
  - Optional lightweight chat events during sessions
- It does NOT:
  - Carry media. Audio/video flows peer-to-peer (or via TURN, if configured).
  - Replace your Next.js app server.

### Where it lives in this repo
- Socket server logic: `lib/websocket-server.js` (uses Socket.IO)
- Standalone dev entry: `scripts/start-signaling-dev.js`
- Combined dev runner (signaling + Next dev): `scripts/dev-turbo-all.js`

### Socket events (high-level)
- Client → server
  - `join-session` { sessionId, userId, userName, isInstructor }
  - `offer` { sessionId, targetUserId, userId, offer }
  - `answer` { sessionId, targetUserId, userId, answer }
  - `ice-candidate` { sessionId, targetUserId, userId, candidate }
  - `chat-message` { sessionId, message, userId, userName }
- Server → client
  - `user-joined` { userId, userName, isInstructor }
  - `user-left` { userId, userName }
  - `participants-update` { participants }
  - `offer`, `answer`, `ice-candidate` relayed to targets

You generally don’t need to touch these unless you’re changing the realtime flow.

---

## Running in development

There are two processes:
- Next.js dev server (the app) on `http://localhost:3000`
- Signaling server on `http://localhost:3001` (shows a simple "Signaling server running" page)

### Recommended: one-command dev
Run both with Turbopack using the combined script:

```
npm run dev:turbo:all
```

- Visit the app at `http://localhost:3000`
- The signaling endpoint is `http://localhost:3001` (expected minimal page)

If port 3001 is used by another process:

```
$env:SIGNALING_PORT="3002"; npm run dev:turbo:all    # PowerShell (Windows)
# or
SIGNALING_PORT=3002 npm run dev:turbo:all             # macOS/Linux
```

### Alternative: run each process separately
- Start signaling:
  - Windows PowerShell:
    ```powershell
    npm run dev:signaling
    # or with a custom port
    $env:SIGNALING_PORT = "3002"; npm run dev:signaling
    ```
- Start Next dev (Turbopack):
  - Windows PowerShell:
    ```powershell
    $env:TURBOPACK = "1"; npx next dev
    ```
  - macOS/Linux:
    ```bash
    TURBOPACK=1 npx next dev
    ```

Notes:
- Don’t run multiple signaling instances simultaneously (you’ll see EADDRINUSE on 3001).
- Turbopack is dev-only; it speeds up rebuilds and helps avoid chunk errors you saw with the legacy custom server.

---

## Production setup

Turbopack is not used in production. You’ll run the built Next.js server plus the signaling server as separate processes (or containers).

### Steps (self-hosted)
1) Build the app:
```
npm run build
```
2) Start Next.js (default 3000):
```
npm start
```
3) Start the signaling server (choose a port, default 3001):
```
node scripts/start-signaling-dev.js
# or specify a port
SIGNALING_PORT=4001 node scripts/start-signaling-dev.js   # macOS/Linux
$env:SIGNALING_PORT = "4001"; node scripts/start-signaling-dev.js   # Windows PowerShell
```
4) Reverse proxy (recommended):
- Put both behind Nginx/Ingress.
- Example (very simplified Nginx):
```
server {
  listen 80;
  server_name yourapp.com;

  location / {
    proxy_pass http://127.0.0.1:3000;  # Next.js
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
  }
}

server {
  listen 80;
  server_name signaling.yourapp.com;

  # Socket.IO/WebSocket upgrade headers
  location / {
    proxy_pass http://127.0.0.1:3001;  # signaling
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
  }
}
```

5) Configure CORS origin for signaling (in `lib/websocket-server.js`):
- It reads `NEXTAUTH_URL` as the allowed origin by default. Set that to your site origin, e.g. `https://yourapp.com`.

### Vercel + external signaling
- Vercel hosts the Next.js app, but persistent WebSocket servers should run elsewhere (Render/Fly/EC2/PM2/Docker).
- Expose the signaling service at `https://signaling.yourapp.com`.
- Point your client code (where relevant) to that URL (via an env var like `NEXT_PUBLIC_SIGNALING_URL`).

### Process managers / containers
- Use PM2, systemd, or Docker to keep both Next.js and signaling alive.
- Set memory/CPU limits, health checks, and logs.

---

## Environment variables
- `SIGNALING_PORT` (optional): Port for the signaling server (default 3001)
- `NEXTAUTH_URL`: Used as allowed CORS origin for Socket.IO server (set to your site origin in prod)
- `NEXT_PUBLIC_SIGNALING_URL` (optional): Client-side URL if signaling runs on a different origin

---

## Troubleshooting

- I only see "Signaling server running" in the browser
  - You’re visiting the signaling server (3001). The app is at 3000 in dev (or your main domain in prod).

- EADDRINUSE on 3001
  - Another signaling instance is running. Close it or change `SIGNALING_PORT` and restart.

- Dev app doesn’t load on 3000 (Windows)
  - Use the combined script: `npm run dev:turbo:all`
  - Or set env vars explicitly in PowerShell: `$env:TURBOPACK="1"; npx next dev`

- Do I need signaling at all?
  - Only if you’re testing/using Live Classes / Live Conversations (WebRTC). Otherwise it can be off and the app still works.

---

## Security & production tips
- Restrict CORS origin for signaling (use your site domain).
- Consider auth gating for join/offer/answer events if you expose private sessions.
- Terminate TLS at your proxy for both the site and signaling hostnames.
- Monitor with PM2 logs / systemd journal / container logs.

---

## Quick reference

Dev (one command):
```
npm run dev:turbo:all
# App:        http://localhost:3000
# Signaling:  http://localhost:3001
```

Dev (separate):
```
# PowerShell
echo "Starting signaling"; npm run dev:signaling
$env:TURBOPACK = "1"; npx next dev
```

Prod (self-hosted):
```
npm run build
npm start                    # Next.js on :3000
SIGNALING_PORT=3001 node scripts/start-signaling-dev.js
```

If you need anything else added to this guide (TURN servers, auth on sockets, cloud deploy recipes), let me know and I’ll extend it.
