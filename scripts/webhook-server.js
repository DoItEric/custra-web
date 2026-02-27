/**
 * Webhook deployment server
 *
 * Listens for GitHub push events and runs the deploy script.
 * Start with PM2: pm2 start scripts/webhook-server.js --name webhook
 *
 * Required environment variables (set in .env.local or PM2 ecosystem):
 *   WEBHOOK_SECRET   - must match the secret configured in GitHub repo settings
 *   WEBHOOK_PORT     - port to listen on (default: 9000)
 *   APP_DIR          - absolute path to the project directory on the server
 *   PM2_APP_NAME     - PM2 process name for the Next.js app
 */

const http = require("http");
const crypto = require("crypto");
const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

const SECRET = process.env.WEBHOOK_SECRET;
const PORT = parseInt(process.env.WEBHOOK_PORT || "9000", 10);
const APP_DIR = process.env.APP_DIR || path.join(__dirname, "..");
const PM2_APP = process.env.PM2_APP_NAME || "custra-waitlist";
const LOG_FILE = path.join(APP_DIR, "deploy.log");

if (!SECRET) {
  console.error("ERROR: WEBHOOK_SECRET environment variable is not set.");
  process.exit(1);
}

function log(msg) {
  const line = `[${new Date().toISOString()}] ${msg}`;
  console.log(line);
  fs.appendFileSync(LOG_FILE, line + "\n");
}

function verifySignature(payload, signature) {
  const hmac = crypto.createHmac("sha256", SECRET);
  hmac.update(payload);
  const digest = "sha256=" + hmac.digest("hex");
  try {
    return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(signature));
  } catch {
    return false;
  }
}

let isDeploying = false;

function runDeploy() {
  if (isDeploying) {
    log("Deploy already in progress, skipping.");
    return;
  }
  isDeploying = true;
  log("Deploy started.");

  const deployScript = path.join(__dirname, "deploy.sh");
  const child = spawn("bash", [deployScript], {
    cwd: APP_DIR,
    env: { ...process.env, PM2_APP_NAME: PM2_APP },
  });

  child.stdout.on("data", (d) => log("[stdout] " + d.toString().trim()));
  child.stderr.on("data", (d) => log("[stderr] " + d.toString().trim()));

  child.on("close", (code) => {
    log(`Deploy finished with exit code ${code}.`);
    isDeploying = false;
  });
}

const server = http.createServer((req, res) => {
  if (req.method !== "POST" || req.url !== "/webhook/deploy") {
    res.writeHead(404);
    res.end("Not found");
    return;
  }

  let body = "";
  req.on("data", (chunk) => (body += chunk));
  req.on("end", () => {
    const signature = req.headers["x-hub-signature-256"];
    if (!signature || !verifySignature(body, signature)) {
      log("Invalid signature, request rejected.");
      res.writeHead(403);
      res.end("Forbidden");
      return;
    }

    let event;
    try {
      event = JSON.parse(body);
    } catch {
      res.writeHead(400);
      res.end("Bad request");
      return;
    }

    // Only deploy on push to main branch
    if (event.ref !== "refs/heads/main") {
      res.writeHead(200);
      res.end("Ignored (not main branch)");
      return;
    }

    res.writeHead(200);
    res.end("Deploy triggered");

    // Run deploy asynchronously after responding
    setImmediate(runDeploy);
  });
});

server.listen(PORT, () => {
  log(`Webhook server listening on port ${PORT}`);
});
