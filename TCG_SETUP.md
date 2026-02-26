# TCG Dashboard Setup

This project now includes a password-protected `/tcg` dashboard with:

- handle management (`add/remove` Instagram handles)
- a unified latest-post feed
- manual and scheduled sync
- optional Discord and Telegram notifications for new posts

## 1) Configure Supabase schema

Run [`supabase/tcg_schema.sql`](./supabase/tcg_schema.sql) in the Supabase SQL editor.

## 2) Set environment variables

Copy `.env.example` to `.env` and fill in:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `TCG_PAGE_PASSWORD` (default: `tcg115`)
- `TCG_SCRAPER_PROVIDER` (`apify` recommended)
- `APIFY_TOKEN` (required for `apify` provider)
- `APIFY_ACTOR_ID` (default `apify~instagram-scraper`)
- `TCG_SYNC_EXECUTOR` (`auto` recommended: direct for `apify`, github dispatch for cloud `instaloader`)
- `GITHUB_ACTIONS_TOKEN` (required if `TCG_SYNC_EXECUTOR=github`)
- `GITHUB_REPOSITORY` (`owner/repo`, required if `TCG_SYNC_EXECUTOR=github`)
- `GITHUB_WORKFLOW_ID` (default `tcg-sync.yml`)
- `GITHUB_WORKFLOW_REF` (default `main`)
- `TCG_PYTHON_BIN` (default `python3`, only for `instaloader`)
- `INSTALOADER_USERNAME` + `INSTALOADER_PASSWORD` (optional, for `instaloader`)
- `INSTALOADER_SESSIONFILE` (optional, alternative to username/password for `instaloader`)
- `TCG_POSTS_PER_HANDLE` (default `6`)
- `CRON_SECRET` (recommended for secure cron calls)
- Optional:
  - `DISCORD_WEBHOOK_URL`
  - `TELEGRAM_BOT_TOKEN`
  - `TELEGRAM_CHAT_ID`

## 3) Use the dashboard

Open `/tcg`, enter your password, then:

1. Add handles in the sidebar
2. Click `Run Sync` for immediate fetch
3. Watch new posts in the feed (newest first)
4. Open the `Logs` tab to view the latest sync summary (includes provider and auth status)

## 4) Hourly sync runner (GitHub Actions)

Hourly sync is configured via:

- `.github/workflows/tcg-sync.yml`
- schedule: every hour (`0 * * * *`, UTC)

Set these GitHub repository secrets (Settings -> Secrets and variables -> Actions):

- `VITE_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `TCG_POSTS_PER_HANDLE`
- `APIFY_TOKEN` (required if workflow uses `apify`)
- `APIFY_ACTOR_ID` (optional override)
- `INSTALOADER_USERNAME` (optional)
- `INSTALOADER_PASSWORD` (optional)
- `INSTALOADER_SESSION_B64` (recommended, base64 of a valid session file)
- `TELEGRAM_BOT_TOKEN` (optional)
- `TELEGRAM_CHAT_ID` (optional)
- `DISCORD_WEBHOOK_URL` (optional)

## 5) Cloud manual trigger from `/tcg`

When you click `Run Sync` in the deployed dashboard:

- `apify` provider runs directly in the Vercel API route
- `instaloader` on cloud dispatches the GitHub workflow by default

Required Vercel env vars for this:

- `TCG_SCRAPER_PROVIDER=apify`
- `APIFY_TOKEN`
- optional: `APIFY_ACTOR_ID`
- optional (only if using github dispatch mode): `TCG_SYNC_EXECUTOR=github`, `GITHUB_ACTIONS_TOKEN`, `GITHUB_REPOSITORY`, `GITHUB_WORKFLOW_ID`, `GITHUB_WORKFLOW_REF`

## 6) Local/manual sync

Run:

```bash
npm run tcg:sync
```

This uses the same sync logic as the cron route and will send notifications when configured.

### Instaloader requirement (fallback mode)

1. Install Instaloader:
```bash
python3 -m pip install instaloader
```
Cron and manual sync always use Instaloader in this setup.

## Local development (no white page)

For local dev, run frontend and API in separate terminals:

Terminal A (frontend):

```bash
npm run dev
```

Terminal B (API functions):

```bash
npx vercel dev --listen 3001
```

Then open [http://localhost:5173/tcg](http://localhost:5173/tcg).

`vite.config.ts` is configured to proxy `/api/*` from `5173` to `3001`.

## API endpoints

Password-protected (`x-tcg-password` header):

- `POST /api/tcg/auth`
- `GET /api/tcg/handles`
- `POST /api/tcg/handles`
- `DELETE /api/tcg/handles?handle=<name>`
- `GET /api/tcg/feed?limit=60`
- `DELETE /api/tcg/feed` (clear visible active-handle feed posts)
- `POST /api/tcg/sync`

Cron endpoint:

- `GET|POST /api/cron/tcg-sync`
