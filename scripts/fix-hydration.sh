#!/bin/bash

echo "🧹 Clearing Next.js cache..."
rm -rf .next
rm -rf node_modules/.cache

echo "📦 Clearing npm cache..."
npm cache clean --force

echo "🔄 Restarting development server..."
npm run dev 