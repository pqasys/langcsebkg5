# Production Deployment Guide

## 🚀 Quick Start Scripts

### Development Mode (Both Servers)
```bash
# Enhanced development script (recommended)
npm run dev:all

# Simple development script (alternative)
npm run dev:all:simple
```

### Production Mode (Both Servers)
```bash
# Enhanced production script (recommended)
npm run start:prod

# Simple production script (alternative)
npm run start:prod:simple
```

## 📋 Server Ports
- **Next.js App**: Port 3000
- **Signaling Server**: Port 3001
- **Socket.IO URL**: http://localhost:3001

## 🔧 What Each Script Does

### Development Scripts
- **`npm run dev:all`**: Starts both Next.js dev server (with Turbopack) and signaling server
- **`npm run dev:all:simple`**: Simple version that starts signaling first, then Next.js

### Production Scripts
- **`npm run start:prod`**: Starts both Next.js production server and signaling server
- **`npm run start:prod:simple`**: Simple version that starts signaling first, then Next.js

## 🛠️ Manual Server Startup (Alternative)

If you prefer to start servers manually in separate terminals:

### Development
```bash
# Terminal 1: Next.js dev server
npm run dev:next

# Terminal 2: Signaling server
npm run dev:signaling
```

### Production
```bash
# Terminal 1: Next.js production server
npm start

# Terminal 2: Signaling server
npm run dev:signaling
```

## 🔍 Troubleshooting

### Port Conflicts
If you get "address already in use" errors:
```bash
# Kill all Node.js processes
taskkill /f /im node.exe

# Or on Linux/Mac
pkill -f node
```

### Signaling Server Issues
- Ensure the signaling server is running on port 3001
- Check that `NEXT_PUBLIC_SOCKET_URL` is set to `http://localhost:3001`
- Verify WebSocket connections in browser dev tools

### Production Build Issues
- Run `npm run build` before starting production servers
- Ensure all environment variables are properly set
- Check database connectivity

## 📝 Environment Variables

Make sure these are set in your `.env` file:
```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-here
DATABASE_URL=your-database-url
SIGNALING_PORT=3001
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
```

## ✅ Verification Steps

1. **Check both servers are running**:
   - Next.js: http://localhost:3000
   - Signaling: http://localhost:3001

2. **Test student dashboard**:
   - Sign in as a student
   - Verify dashboard loads without errors
   - Check browser console for WebSocket connections

3. **Test real-time features**:
   - Live Classes
   - Live Conversations
   - Video Sessions

## 🎯 Key Fixes Applied

1. **Fixed build-time detection**: Updated `isBuildTime()` and `isClientBuildTime()` functions
2. **Disabled API caching**: Added `force-dynamic` and cache control headers
3. **Fixed ProgressVisualization**: Added safe data handling and fallback objects
4. **Fixed PersonalizedRecommendations**: Added safe data handling and proper API response structure
5. **Enhanced error handling**: Robust error states and retry mechanisms
6. **Improved server management**: Better process handling and graceful shutdowns
