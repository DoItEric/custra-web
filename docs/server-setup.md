# Server Setup Guide

## Requirements

- Node.js 20+
- Yarn
- PM2 (`npm install -g pm2`)
- Nginx

---

## 1. Clone the repo

```bash
git clone https://github.com/your-org/quick-waitlist.git /var/www/quick-waitlist
cd /var/www/quick-waitlist
```

## 2. Create .env.local

```bash
cp .env.example .env.local
nano .env.local   # fill in real values
```

## 3. Build and start the Next.js app

```bash
yarn install --frozen-lockfile
yarn build
pm2 start .next/standalone/server.js --name custra-waitlist
pm2 save
```

## 4. Start the webhook server

The webhook server listens on port 9000 (internal only, not exposed to the internet).

Set environment variables (add to .env.local or PM2 ecosystem):

```bash
export WEBHOOK_SECRET="your-random-secret-string"   # must match GitHub webhook secret
export WEBHOOK_PORT=9000
export APP_DIR=/var/www/quick-waitlist
export PM2_APP_NAME=custra-waitlist
```

Start with PM2:

```bash
pm2 start scripts/webhook-server.js --name webhook \
  --env WEBHOOK_SECRET="your-random-secret-string" \
  --env WEBHOOK_PORT=9000 \
  --env APP_DIR=/var/www/quick-waitlist \
  --env PM2_APP_NAME=custra-waitlist
pm2 save
```

## 5. Nginx configuration

Add a `location` block inside your existing server block to proxy the webhook endpoint.
Port 9000 is never opened to the outside — Nginx handles it internally.

```nginx
server {
    listen 443 ssl;
    server_name custra.ericup.com;

    # ... your existing SSL and proxy_pass for Next.js ...

    # Webhook endpoint — proxied internally, no extra port exposed
    location /webhook/deploy {
        proxy_pass         http://127.0.0.1:9000/webhook/deploy;
        proxy_http_version 1.1;
        proxy_set_header   Host $host;
        proxy_set_header   X-Real-IP $remote_addr;
        proxy_read_timeout 10s;
    }
}
```

Reload Nginx:

```bash
nginx -t && systemctl reload nginx
```

## 6. Configure GitHub Webhook

Go to: **GitHub repo → Settings → Webhooks → Add webhook**

| Field         | Value                                              |
|---------------|----------------------------------------------------|
| Payload URL   | `https://custra.ericup.com/webhook/deploy`         |
| Content type  | `application/json`                                 |
| Secret        | same value as `WEBHOOK_SECRET` on your server      |
| Which events  | **Just the push event**                            |

Click **Add webhook**. GitHub will send a ping — you should see a green checkmark.

---

## Deploy flow (after setup)

```
git push origin master
       ↓
GitHub sends POST to https://custra.ericup.com/webhook/deploy
       ↓
Nginx proxies to 127.0.0.1:9000
       ↓
webhook-server.js verifies HMAC signature
       ↓
runs scripts/deploy.sh  (git pull → yarn build → pm2 restart)
       ↓
deploy.log updated
```

## View deploy logs

```bash
tail -f /var/www/quick-waitlist/deploy.log
# or
pm2 logs webhook
```
