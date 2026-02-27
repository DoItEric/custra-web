module.exports = {
  apps: [
    {
      name: "custra-waitlist",
      script: "dist/server.js",
      env: {
        PORT: 8080,
        NODE_ENV: "production",
      },
    },
    {
      name: "webhook",
      script: "scripts/webhook-server.js",
      env: {
        WEBHOOK_PORT: 9000,
        // WEBHOOK_SECRET, APP_DIR, PM2_APP_NAME 在服务器上设置，不写在这里
      },
    },
  ],
};
