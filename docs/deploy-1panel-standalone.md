# 1Panel 部署说明（仅 .next + public，不暴露源码）

使用 Next.js 的 **standalone** 输出，服务器上只需部署构建产物，无需 `package.json`、源码和 `npm install`。

---

## 一、本地重新构建（必须）

1. 确认 `next.config.mjs` 中有 `output: "standalone"`（已配置）。
2. 在项目根目录执行：
   ```bash
   yarn build
   # 或 npm run build
   ```
3. 构建完成后会多出目录：`.next/standalone/`。

---

## 二、准备要上传到服务器的目录

在本地新建一个文件夹（例如 `deploy`），按下面结构组装：

```
deploy/
├── server.js              ← 从 .next/standalone/server.js 复制
├── node_modules/          ← 整个 .next/standalone/node_modules 复制
├── .next/
│   └── static/            ← 整个 .next/static 复制到 deploy/.next/static
└── public/                ← 整个 public 复制
```

**具体操作：**

1. 把 **`.next/standalone/`** 里的**所有内容**（含 `server.js`、`node_modules`、`.next` 等）复制到 `deploy/`。
2. 把项目里的 **`.next/static`** 整个文件夹复制到 `deploy/.next/static`（覆盖或合并进 deploy 里已有的 `.next`）。
3. 把项目里的 **`public`** 整个文件夹复制到 `deploy/public`。

最终 `deploy` 里要有：
- `server.js`（在 deploy 根目录）
- `node_modules/`
- `.next/`（内含至少 `static/` 以及 standalone 自带的其它文件）
- `public/`

**不需要**：源码、根目录的 `package.json`、`app/`、`components/` 等。

---

## 三、上传到服务器

把 `deploy` 文件夹里的**全部内容**上传到服务器目录，例如：

`/www/wwwroot/custra/`

即该目录下直接有 `server.js`、`node_modules`、`.next`、`public`。

---

## 四、1Panel 配置

1. **项目目录（运行目录）**  
   填：**上面这个部署目录**（例如 `/www/wwwroot/custra`）。  
   不要填成 `/www/wwwroot/custra/.next`。

2. **运行方式 / 启动命令**  
   不要用 `npm run start`（这里没有 package.json）。  
   使用**自定义命令**：
   ```bash
   node server.js
   ```

3. **端口**  
   Next 默认 3000，若 1Panel 里填 80，需在 `server.js` 同目录通过环境变量指定端口，或保持 3000 再用 1Panel/ Nginx 做端口映射。

4. **环境变量**  
   若 1Panel 支持为该项目配置环境变量，请配置：
   - **必配（避免 Server Action 报错）**：`NEXT_SERVER_ACTIONS_ENCRYPTION_KEY`（见下方「常见问题」）。
   - Resend 等业务变量：`NEXT_PUBLIC_RESEND_API_KEY`、`NEXT_PUBLIC_FROM_EMAIL` 等，与本地 `.env` 一致。

5. **Node 版本**  
   与本地构建时一致即可（建议 Node 18+）。

---

## 五、端口说明

standalone 的 `server.js` 默认监听 **3000**。若 1Panel 里对外端口是 80：

- 在 1Panel 的「端口映射」里把 80 映射到本机 3000，或  
- 启动时指定端口：  
  ```bash
  PORT=80 node server.js
  ```  
  （若 1Panel 支持在“自定义命令”里写这一句也可。）

---

## 六、常见问题：Failed to find Server Action "x"

**现象**：日志里出现 `Error: Failed to find Server Action "x". This request might be from an older or newer deployment.`

**原因**：Next.js 会为内部流程生成加密的 Server Action ID，自托管时若不固定密钥，每次构建/重启后 ID 会变，浏览器发来的旧 ID 就对不上。

**解决**：让进程启动时能读到 **`NEXT_SERVER_ACTIONS_ENCRYPTION_KEY`**，任选一种即可。

- **生成密钥**（在本地或服务器执行一次即可）：
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```
  得到一串 64 位十六进制，例如：`a1b2c3d4e5f6...`

**方式 A：用启动命令传（推荐）**  
在 bash 里可直接整行复制执行（把 `YOUR_64_HEX_KEY` 换成你生成的 64 位十六进制密钥）：

只设密钥（默认端口 3000）：
```bash
export NEXT_SERVER_ACTIONS_ENCRYPTION_KEY="YOUR_64_HEX_KEY"; node server.js
```

密钥 + 端口 80：
```bash
export NEXT_SERVER_ACTIONS_ENCRYPTION_KEY="YOUR_64_HEX_KEY"; export PORT=80; node server.js
```

宝塔 PM2：在「启动命令」里填上面其中一整行（一行复制粘贴即可），不要拆成多条命令。

**方式 B：面板里的环境变量**  
在 1Panel / 宝塔 的 Node 项目设置里，若有「环境变量」或「项目配置」，新增一项：名称 `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY`，值为上面的密钥，保存后重启。

之后每次部署**同一份 dist** 时请使用**同一个密钥**；若重新执行了 `yarn build:deploy` 并替换了服务器上的 dist，密钥可保持不变。  
另外建议用户**强刷页面**（Ctrl+Shift+R 或清缓存），避免旧前端脚本带着旧 action ID 请求。

---

## 七、配置项在哪？能改 server.js 吗？

**项目里的配置被打包到哪了？**  
- **服务端**：Next 在**运行时**从 `process.env` 读环境变量，不会把 `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY`、Resend API Key 等写死进某个文件。所以 dist 里没有「一个配置文件」可以改。  
- **前端**：只有带 `NEXT_PUBLIC_` 前缀的变量会在构建时打进前端 JS，在 `.next/static/` 的 chunk 里，一般不适合放密钥。

**直接改 server.js 或 dist 里的文件行不行？**  
可以但不推荐：在 `server.js` 最开头加一行 `process.env.NEXT_SERVER_ACTIONS_ENCRYPTION_KEY = '你的密钥';` 能生效，但每次重新执行 `yarn build:deploy` 并覆盖服务器上的 dist 时，这行会被覆盖，容易忘。用**启动命令**或**面板环境变量**更省心。

**用启动命令可以吗？**  
可以，推荐。在 bash 或宝塔启动命令里用下面这种（整行复制，把密钥换成你的）：  
`export NEXT_SERVER_ACTIONS_ENCRYPTION_KEY="你的64位hex"; node server.js`

---

## 八、总结

| 项目       | 说明 |
|------------|------|
| 部署内容   | 仅 `server.js` + `node_modules` + `.next`（含 static）+ `public` |
| 是否要源码 | 不需要，不暴露 |
| 是否要 npm install | 不需要 |
| 1Panel 启动命令 | `node server.js`（不要用 `npm run start`） |
| 项目目录   | 放有 `server.js` 的那一层目录 |
| 环境变量   | 必须设置 `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY`，避免 Server Action 报错 |

按上述步骤即可在 1Panel 上只凭“.next + public”的构建产物完成部署，且不暴露源码。
