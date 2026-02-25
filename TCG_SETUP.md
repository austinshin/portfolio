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
- `TCG_SYNC_EXECUTOR` (`github` in cloud, `local` for local-only direct sync)
- `GITHUB_ACTIONS_TOKEN` (required if `TCG_SYNC_EXECUTOR=github`)
- `GITHUB_REPOSITORY` (`owner/repo`, required if `TCG_SYNC_EXECUTOR=github`)
- `GITHUB_WORKFLOW_ID` (default `tcg-sync.yml`)
- `GITHUB_WORKFLOW_REF` (default `main`)
- `TCG_PYTHON_BIN` (default `python3`)
- `INSTALOADER_USERNAME` + `INSTALOADER_PASSWORD` (optional, for login)
- `INSTALOADER_SESSIONFILE` (optional, alternative to username/password)
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
- `INSTALOADER_USERNAME` (optional)
- `INSTALOADER_PASSWORD` (optional)
- `INSTALOADER_SESSION_B64` (recommended, base64 of a valid session file)
- `TELEGRAM_BOT_TOKEN` (optional)
- `TELEGRAM_CHAT_ID` (optional)
- `DISCORD_WEBHOOK_URL` (optional)

## 5) Cloud manual trigger from `/tcg`

When you click `Run Sync` in the deployed dashboard, the API dispatches the GitHub workflow (instead of trying to run Python inside Vercel).

Required Vercel env vars for this:

- `TCG_SYNC_EXECUTOR=github`
- `GITHUB_ACTIONS_TOKEN` (token with permission to dispatch workflows on the repo)
- `GITHUB_REPOSITORY` (`owner/repo`, example: `austinshin/portfolio`)
- `GITHUB_WORKFLOW_ID` (`tcg-sync.yml`)
- `GITHUB_WORKFLOW_REF` (`main`)

If you see repeated Instagram `429 Too Many Requests` in Actions logs, run authenticated mode:

1. Set `INSTALOADER_USERNAME` and `INSTALOADER_PASSWORD` as GitHub secrets.
2. Optionally generate a session file locally and set `INSTALOADER_SESSION_B64` in GitHub secrets (base64 content of the session file).

## 6) Local/manual sync

Run:

```bash
npm run tcg:sync
```

This uses the same sync logic as the cron route and will send notifications when configured.

### Instaloader requirement

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
