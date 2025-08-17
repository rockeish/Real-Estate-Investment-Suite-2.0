# Real Estate Portfolio Management Suite

Monorepo:
- `server/`: Express + Postgres API
- `app/`: Next.js + Tailwind web UI (deployed on Vercel)
- `old/`: Archived drafts for reference

## Local Development

1) API
```
cp server/.env.example server/.env
cd server
npm i
npm run db:init
npm run dev
```

2) Web
```
cd app
npm i
npm run dev
```

Set `app/.env` or Vercel Project Env `NEXT_PUBLIC_API_BASE` to your API base URL.