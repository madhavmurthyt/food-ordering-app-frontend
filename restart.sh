#!/usr/bin/env bash
set -e

# Kill existing frontend process on port 3000
PID=$(lsof -i :3000 -t 2>/dev/null || true)
if [ -n "$PID" ]; then
  echo "Stopping existing frontend (PID $PID)..."
  kill "$PID" 2>/dev/null || true
  sleep 2
fi

cd "$(dirname "$0")"

echo "Installing dependencies..."
npm install --silent

echo "Starting frontend on http://localhost:3000"
npm start
