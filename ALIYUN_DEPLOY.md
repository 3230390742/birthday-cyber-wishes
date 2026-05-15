# 阿里云轻量服务器部署后端代理

前端静态文件继续放在：

```bash
/var/www/birthday-cyber-wishes
```

Node 后端代理建议放在：

```bash
/var/www/birthday-cyber-wishes-api
```

## 1. 服务器安装 Node.js

```bash
node -v
```

如果没有 Node.js：

```bash
sudo yum install -y nodejs npm
```

## 2. 上传项目后端文件

至少需要上传这些文件到 `/var/www/birthday-cyber-wishes-api`：

```text
server/
package.json
package-lock.json
```

然后在服务器执行：

```bash
cd /var/www/birthday-cyber-wishes-api
npm install --omit=dev
```

## 3. 配置服务端环境变量

创建环境文件：

```bash
sudo tee /var/www/birthday-cyber-wishes-api/.env > /dev/null <<'EOF'
SUPABASE_URL=https://zkoowxapndtbwrwsawde.supabase.co
SUPABASE_SERVICE_ROLE_KEY=替换成你重置后的服务端 key
PORT=3001
EOF
```

不要把服务端 key 提交到 GitHub。

## 4. 创建 systemd 服务

```bash
sudo tee /etc/systemd/system/birthday-api.service > /dev/null <<'EOF'
[Unit]
Description=Birthday wishes API
After=network.target

[Service]
Type=simple
WorkingDirectory=/var/www/birthday-cyber-wishes-api
ExecStart=/usr/bin/node server/index.js
Restart=always
RestartSec=3
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
EOF
```

启动服务：

```bash
sudo systemctl daemon-reload
sudo systemctl enable birthday-api
sudo systemctl start birthday-api
sudo systemctl status birthday-api
```

## 5. 修改 Nginx 配置

编辑 `/etc/nginx/conf.d/birthday.conf`，加入 `/api/` 反向代理：

```nginx
server {
    listen 80;
    server_name _;

    root /var/www/birthday-cyber-wishes;
    index index.html;

    location /api/ {
        proxy_pass http://127.0.0.1:3001/api/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

检查并重载：

```bash
sudo nginx -t
sudo systemctl reload nginx
```

## 6. 测试

```bash
curl http://127.0.0.1:3001/api/health
curl http://127.0.0.1/api/health
curl http://你的服务器公网IP/api/health
```

都应该返回：

```json
{"ok":true}
```
