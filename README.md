# 生日宇宙祝福站

一个使用 React + Vite + Tailwind CSS + Framer Motion 构建的交互式生日祝福网站。

## 安装

```bash
npm install
```

## 本地运行

```bash
npm run dev
```

## 构建检查

```bash
npm run build
```

## 配置生日日期

生日倒计时默认日期在 `src/data.ts` 的 `BIRTHDAY_TARGET` 中修改。

## 后端代理配置

前端默认请求同域名下的 `/api/wishes`。服务器端需要配置 Supabase URL 和服务端 key：

```bash
SUPABASE_URL=https://你的项目ref.supabase.co
SUPABASE_SERVICE_ROLE_KEY=你的 Supabase 服务端 key
PORT=3001
```

不要把 `SUPABASE_SERVICE_ROLE_KEY` 放进前端环境变量、GitHub 或 Vercel。

本地开发时可以开两个终端：

```bash
npm run server
npm run dev
```
