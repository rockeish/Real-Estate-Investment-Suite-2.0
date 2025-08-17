# Real Estate Portfolio Management Suite

This Next.js web app connects to the Express API in `../server`.

## Quick Start

1. Copy env

```
cp server/.env.example server/.env
```

2. Start Postgres and init schema

```
cd server
npm i
npm run db:init
npm run dev
```

3. Start web app

```
cd ../app
npm i
npm run dev
```

Set `NEXT_PUBLIC_API_BASE` to point at your API base (default `http://localhost:5000/api`).