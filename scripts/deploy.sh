#!/bin/bash
set -e

echo ">>> Pulling latest code..."
git pull origin master

echo ">>> Installing dependencies..."
yarn install --frozen-lockfile

echo ">>> Building..."
yarn build

echo ">>> Restarting service..."
pm2 restart "${PM2_APP_NAME}" || pm2 start .next/standalone/server.js --name "${PM2_APP_NAME}"

echo ">>> Done."
