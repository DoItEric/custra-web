#!/bin/bash
set -e

echo ">>> Pulling latest code..."
git pull origin main

echo ">>> Installing dependencies..."
yarn install --frozen-lockfile

echo ">>> Building..."
yarn build:deploy

echo ">>> Restarting service..."
pm2 reload ecosystem.config.js --only "${PM2_APP_NAME}" || pm2 start ecosystem.config.js --only "${PM2_APP_NAME}"

echo ">>> Done."
