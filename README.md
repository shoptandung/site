# Shop Tan Dung Backend

Deploy this folder to a Node.js host. It is separate from the static frontend.

## Render

The repository includes `render.yaml` at the project root. Create a Render Web Service from the repository and set:

- Root directory: `backend`
- Build command: `npm install`
- Start command: `npm start`
- Health check: `/api/health`
- `NODE_ENV=production`
- `HOST=0.0.0.0`
- `ADMIN_PASSWORD=tdung123321`
- `ALLOWED_ORIGIN=https://your-frontend-domain.example`
- `SUPABASE_URL=https://your-project.supabase.co`
- `SUPABASE_SERVICE_ROLE_KEY=<keep private; Render secret only>`

## Run locally

```powershell
$env:PORT="8010"
$env:ADMIN_PASSWORD="tdung123321"
node server.mjs
```

The API is available at `http://127.0.0.1:8010`.

## Production

Set these environment variables in the hosting dashboard:

- `NODE_ENV=production`
- `PORT=8000`
- `HOST=0.0.0.0`
- `ADMIN_PASSWORD=<a long private password>`
- `ALLOWED_ORIGIN=https://your-frontend-domain.example`

Optionally set `HTTPS_KEY_FILE` and `HTTPS_CERT_FILE`, or terminate HTTPS in a reverse proxy.

## Supabase Free database

1. Create a Supabase project.
2. Open SQL Editor and run `supabase-schema.sql`.
3. Copy the project URL and service role key into Render environment variables.
4. Never put `SUPABASE_SERVICE_ROLE_KEY` in frontend code.

When Supabase variables are present, the API stores the complete state in `app_state`. Without them, local development falls back to `server-state.json`.

## Frontend connection

In the frontend `index.html`, set the backend URL before `script.js`:

```html
<script>window.SYNC_SERVER_URL = 'https://your-backend-domain.example';</script>
```

Do not expose `server-state.json` or `.env` publicly.
