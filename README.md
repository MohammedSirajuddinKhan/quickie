# Quickie

## Quickie is a tiny URL shortener built with Express, EJS and MongoDB.

### Live demo: https://quickie-ashy.vercel.app/

Quick start

1. Install dependencies:

```bash
npm install
```

2. Run locally (development):

```bash
npm run dev
```

3. Run the smoke test (starts the app and checks `/health`):

```bash
npm run smoke
```

Environment variables

- `MONGODB_URI` — required for database features (set in Vercel Project Settings for production).
- `PUBLIC_BASE_URL` — optional public base URL used when displaying created links.

Deployment notes for Vercel

- The app is configured to run as a serverless function under `/api/index.js`.
- Make sure you set `MONGODB_URI` and `PUBLIC_BASE_URL` in the Vercel project settings before deploying.
- If you hit a serverless import-time crash, restart the deployment after pushing code; the repo was adjusted to be import-safe.

Repository files of interest

- `index.js` — development server bootstrap (only starts when run directly).
- `api/index.js` — serverless entry that exports the Express app.
- `app.js` — Express app and routes.
- `views/index.ejs` — homepage template (stores the last generated link in localStorage to persist across refresh/back navigation).
- `public/styles.css` — site styles.

If something still crashes on Vercel

1. Confirm environment variables are set in the Vercel dashboard.
2. Check the function logs in Vercel for the stack trace.
3. Locally reproduce with `npm run smoke` and share the terminal output if you want me to debug further.

If you'd like, I can also add a minimal `README` badge, CI check, or a simple test harness next.
