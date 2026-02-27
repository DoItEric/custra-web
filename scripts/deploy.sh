#!/bin/bash
set -e

echo ">>> Pulling latest code..."
git pull origin master

echo ">>> Installing dependencies..."
yarn install --frozen-lockfile

echo ">>> Building..."
yarn build:deploy

echo ">>> Restarting service..."
PORT=8080 pm2 restart "${PM2_APP_NAME}" || PORT=8080 pm2 start dist/server.js --name "${PM2_APP_NAME}"

echo ">>> Done."
