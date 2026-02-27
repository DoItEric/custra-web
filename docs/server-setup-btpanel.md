# 宝塔面板部署指南

> 本文档针对使用宝塔面板（BT Panel）的服务器，完成 Next.js 网站的首次部署和自动 Webhook 部署配置。
> 全程只需开放 80/443 端口，无需暴露 SSH 端口。

---

## 前置准备

在宝塔面板的 **软件商店** 中确认已安装：

- **Nginx**（任意版本）
- **Node.js 版本管理器** → 安装 Node.js **20.x** LTS

安装完 Node.js 后，在宝塔终端执行以下命令安装全局工具：

```bash
npm install -g yarn pm2
pm2 startup   # 设置 PM2 开机自启，按提示执行输出的命令
```

---

## 第一步：在宝塔中创建网站

1. 宝塔面板 → **网站** → **添加站点**
2. 填写域名（如 `custra.ericup.com`），PHP 版本选**纯静态**，不需要数据库
3. 创建完成后，进入该网站的 **SSL** 选项卡，申请或上传 SSL 证书，开启 HTTPS

---

## 第二步：克隆代码到服务器

宝塔面板 → 左侧菜单 → **终端**（或直接 SSH 登录），执行：

```bash
# 宝塔网站根目录通常在 /www/wwwroot/，根据实际情况修改
cd /www/wwwroot
git clone https://github.com/你的用户名/quick-waitlist.git custra.ericup.com
cd custra.ericup.com
```

---

## 第三步：配置环境变量

```bash
cp .env.example .env.local
vi .env.local    # 填入真实的 API Key、域名等配置
```

按 `i` 进入编辑，`Esc` 后输入 `:wq` 保存退出。

---

## 第四步：构建并启动 Next.js 应用

```bash
cd /www/wwwroot/custra.ericup.com
yarn install --frozen-lockfile
yarn build

# 启动 Next.js（standalone 模式默认监听 3000 端口）
pm2 start .next/standalone/server.js --name custra-waitlist
pm2 save
```

验证是否启动成功：

```bash
pm2 list
# 应看到 custra-waitlist 状态为 online
```

---

## 第五步：启动 Webhook 服务

Webhook 服务监听 9000 端口（仅本机内部，不对外开放）。

将下方命令中的 `your-random-secret-string` 替换为你自己生成的任意随机字符串（记住这个值，后面 GitHub 里要用到）：

```bash
pm2 start /www/wwwroot/custra.ericup.com/scripts/webhook-server.js \
  --name webhook \
  --env WEBHOOK_SECRET="your-random-secret-string" \
  --env WEBHOOK_PORT=9000 \
  --env APP_DIR=/www/wwwroot/custra.ericup.com \
  --env PM2_APP_NAME=custra-waitlist
pm2 save
```

验证：

```bash
pm2 list
# 应看到 webhook 状态为 online
```

---

## 第六步：配置 Nginx 反向代理

### 6.1 代理 Next.js 主应用

宝塔面板 → **网站** → 找到你的站点 → **设置** → **配置文件**

将配置文件中的 `location /` 部分替换为以下内容（如果已有则直接修改）：

```nginx
location / {
    proxy_pass         http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header   Upgrade $http_upgrade;
    proxy_set_header   Connection 'upgrade';
    proxy_set_header   Host $host;
    proxy_set_header   X-Real-IP $remote_addr;
    proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header   X-Forwarded-Proto $scheme;
    proxy_cache_bypass $http_upgrade;
}
```

### 6.2 代理 Webhook 端点

在同一个配置文件的 `server { }` 块内，追加以下 location（放在 `location /` 的**上方**，让它优先匹配）：

```nginx
# Webhook 自动部署端点，内部转发到 9000 端口，不对外暴露
location /webhook/deploy {
    proxy_pass         http://127.0.0.1:9000/webhook/deploy;
    proxy_http_version 1.1;
    proxy_set_header   Host $host;
    proxy_set_header   X-Real-IP $remote_addr;
    proxy_read_timeout 30s;
}
```

### 6.3 保存并重载 Nginx

点击配置文件编辑页面的 **保存** 按钮，宝塔会自动检测并重载 Nginx。

也可以在终端执行：

```bash
nginx -t && nginx -s reload
```

---

## 第七步：在 GitHub 配置 Webhook

进入你的 GitHub 仓库 → **Settings** → **Webhooks** → **Add webhook**

| 字段 | 填写内容 |
|------|----------|
| Payload URL | `https://custra.ericup.com/webhook/deploy` |
| Content type | `application/json` |
| Secret | 第五步中设置的 `WEBHOOK_SECRET` 值 |
| Which events | **Just the push event** |

点击 **Add webhook**。GitHub 会立即发送一个 ping 请求，你应该看到绿色对勾 ✅，说明服务器通信正常。

---

## 自动部署完整流程

```
本地 git push origin master
          ↓
GitHub 发送 POST 请求到 https://custra.ericup.com/webhook/deploy
          ↓
宝塔 Nginx（443 端口）内部代理到 127.0.0.1:9000
          ↓
webhook-server.js 验证 HMAC 签名 + 检查是否为 master 分支
          ↓
执行 scripts/deploy.sh
（git pull → yarn install → yarn build → pm2 restart）
          ↓
日志写入 /www/wwwroot/custra.ericup.com/deploy.log
```

---

## 常用维护命令

```bash
# 查看所有 PM2 进程状态
pm2 list

# 实时查看部署日志
tail -f /www/wwwroot/custra.ericup.com/deploy.log

# 查看 webhook 服务日志
pm2 logs webhook

# 查看 Next.js 应用日志
pm2 logs custra-waitlist

# 手动重启 Next.js 应用
pm2 restart custra-waitlist

# 手动重启 Webhook 服务
pm2 restart webhook
```

---

## 常见问题

**Q：GitHub Webhook 显示红色，ping 失败？**
- 检查域名 DNS 是否已解析到服务器
- 检查宝塔防火墙是否放行了 443 端口
- 在终端执行 `pm2 list` 确认 webhook 进程是 online 状态
- 在终端执行 `curl http://127.0.0.1:9000/webhook/deploy` 测试本地是否可达（应返回 403 Forbidden，说明服务正常）

**Q：push 之后网站没有更新？**
```bash
tail -f /www/wwwroot/custra.ericup.com/deploy.log
```
查看日志，通常可以直接看到出错原因。

**Q：宝塔防火墙设置**
- 9000 端口**不需要**在宝塔防火墙中放行，它只在服务器内部使用
- 只需确保 80 和 443 端口是放行状态
