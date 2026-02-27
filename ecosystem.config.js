module.exports = {
  apps: [
    {
      name: "custra-waitlist",
      script: "server.js",
      cwd: "/www/wwwroot/custra.ericup.com/dist",
      env: {
        PORT: 8080,
        NODE_ENV: "production",
      },
    },
    {
      name: "webhook",
      script: "scripts/webhook-server.js",
      cwd: "/www/wwwroot/custra.ericup.com",
      env: {
        WEBHOOK_PORT: 9000,
        APP_DIR: "/www/wwwroot/custra.ericup.com",
        PM2_APP_NAME: "custra-waitlist",
        // WEBHOOK_SECRET is read from system environment variable.
        // On the server, run: echo 'export WEBHOOK_SECRET="your-secret"' >> ~/.bashrc && source ~/.bashrc
        WEBHOOK_SECRET: process.env.WEBHOOK_SECRET,
      },
    },
  ],
};
