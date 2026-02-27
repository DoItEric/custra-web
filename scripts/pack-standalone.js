/**
 * 构建后打包：把 standalone + .next/static + public 组装成单一目录
 * 用法：node scripts/pack-standalone.js
 * 输出：dist/ 目录（直接整份拷到服务器即可，无需手工组装）
 */
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const outDir = path.join(root, "dist");

function copyRecursive(src, dest) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    for (const name of fs.readdirSync(src)) {
      copyRecursive(path.join(src, name), path.join(dest, name));
    }
  } else {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
  }
}

function main() {
  const standalone = path.join(root, ".next", "standalone");
  if (!fs.existsSync(standalone)) {
    console.error("错误：未找到 .next/standalone，请先执行 yarn build（且 next.config 中开启 output: 'standalone'）");
    process.exit(1);
  }

  if (fs.existsSync(outDir)) fs.rmSync(outDir, { recursive: true });
  fs.mkdirSync(outDir, { recursive: true });

  console.log("复制 standalone...");
  for (const name of fs.readdirSync(standalone)) {
    copyRecursive(path.join(standalone, name), path.join(outDir, name));
  }

  const staticSrc = path.join(root, ".next", "static");
  const staticDest = path.join(outDir, ".next", "static");
  if (fs.existsSync(staticSrc)) {
    console.log("复制 .next/static...");
    copyRecursive(staticSrc, staticDest);
  }

  const publicSrc = path.join(root, "public");
  const publicDest = path.join(outDir, "public");
  if (fs.existsSync(publicSrc)) {
    console.log("复制 public...");
    copyRecursive(publicSrc, publicDest);
  }

  console.log("完成。可部署目录：dist/");
  console.log("服务器上在 dist 目录执行：node server.js");
}

main();
