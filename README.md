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

## Supabase 后端配置

复制 `.env.example` 为 `.env.local`，填入 Supabase 项目的 URL 和 publishable key：

```env
VITE_SUPABASE_URL=你的 Supabase Project URL
VITE_SUPABASE_ANON_KEY=你的 Supabase publishable key
```

不要把 `sb_secret_...` 服务端密钥放进前端项目。
