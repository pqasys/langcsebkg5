@echo off
echo 🧹 Clearing Next.js cache...
if exist .next rmdir /s /q .next
if exist node_modules\.cache rmdir /s /q node_modules\.cache

echo 📦 Clearing npm cache...
npm cache clean --force

echo 🔄 Restarting development server...
npm run dev 