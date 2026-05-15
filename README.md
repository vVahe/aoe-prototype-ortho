# aoe-prototype-ortho

Personalized landing page generator for orthodontic practices. Each prospect gets a unique URL (`/[slug]`) with their practice data, reviews, photos, and location info pre-filled.

---

## Prerequisites

- Node.js 20+
- A Google Places API key with the **Places API (New)** enabled

---

## Local setup

```bash
npm install
```

Create a `.env` file in the project root (not committed to git):

```
GOOGLE_PLACES_API_KEY=your_key_here
```

---

## Files required locally (not in git)

| File | Purpose |
|---|---|
| `.env` | Google Places API key |
| `data/place-ids.json` | Array of Google Place IDs to fetch |
| `data/prospects.json` | Generated prospect data (output of `fetch-prospects`) |
| `public/images/prospects/` | Downloaded practice photos (output of `fetch-prospects`) |

These are excluded from git because they contain competitive/business-sensitive data and generated assets.

---

## Commands

### `npm run dev`
Starts the Next.js dev server at `http://localhost:3000`. The app reads prospect data from `data/prospects.json` at startup.

### `npm run build` / `npm run start`
Production build and server.

### `npm run fetch-prospects`
Fetches fresh data from the Google Places API for every Place ID listed in `data/place-ids.json`. For each practice it:
- Pulls name, address, phone, website, rating, reviews, hours, and location
- Downloads and converts photos to `.webp` under `public/images/prospects/[slug]/`
- Derives nearby parking, transit, and train station distances via the Nearby Search API
- Writes everything to `data/prospects.json` with local `/images/prospects/...` photo paths

Re-running is safe — existing `outreach` fields and already-downloaded photos are preserved.

### `npm run fetch-prospects-live`
Same as above, but uploads each photo to **Vercel Blob** and stores the resulting `https://` URL in the output instead of a local path. Output is written to `data/prospects-live.json` and also uploaded to Blob at a stable path (`prospects-data/prospects-live.json`) so Vercel builds can fetch it.

If `VERCEL_API_TOKEN` and `VERCEL_PROJECT_ID` are set in `.env`, the script also creates/updates the `PROSPECTS_BLOB_URL` env var on the Vercel project (Production + Preview) via the Vercel REST API. On first run it creates two independent records — one for Production, one for Preview mirroring it — so the two environments can later diverge if needed.

Use this before a Vercel deployment. Requires `BLOB_READ_WRITE_TOKEN` in `.env` (see [Vercel deploy](#vercel-deploy)).

Re-running is safe — images already on disk are not re-downloaded from Google; they are re-uploaded to Blob (overwriting the same path).

### `npm run fetch-prospects-preview`
Same as `fetch-prospects-live`, but writes to the **Preview** environment only. Output goes to `data/prospects-preview.json` and Blob path `prospects-data/prospects-preview.json`; only the Preview `PROSPECTS_BLOB_URL` env var on Vercel is touched. Production stays untouched.

Use this when you push a branch (or open a PR) and want the preview deploy to render different prospect data than production — e.g. testing changes against a different set of practices. If you don't need divergent data, you can skip this entirely and the preview will keep mirroring production from the last `fetch-prospects-live` run.

**`data/place-ids.json` format:**
```json
["ChIJOScCilC-xkcRJAESGoQ38TI", "ChIJrT33lIU1xEcRo7AzqF7EmEg"]
```
Find Place IDs via [Google Place ID Finder](https://developers.google.com/maps/documentation/places/web-service/place-id).

---

## Prospect data at build time

The app resolves prospect data in this priority order at build time (`generateStaticParams`):

1. **`PROSPECTS_BLOB_URL` env var** — a public Vercel Blob URL pointing to `prospects-live.json` (Production) or `prospects-preview.json` (Preview), set independently per environment on Vercel
2. **`data/prospects-live.json`** — local file written by `fetch-prospects-live` (used for local production builds)
3. **`data/prospects.json`** — local file written by `fetch-prospects` (used for `npm run dev` with local images)

If none are present the app renders with no prospects (pages return 404).

---

## Vercel deploy

The app is designed to run on Vercel's **free Hobby plan**. No paid features are required.

### What Vercel provides

| Feature | Used for |
|---|---|
| Hosting + CDN | Serves the Next.js app |
| Vercel Blob (free: 500 MB / 1 GB egress per month) | Hosts practice photos AND the prospects JSON, as publicly accessible files |
| Environment variables | Points the build at the prospects JSON in Blob |

### Step 1 — Add a Blob store

In the Vercel dashboard go to **Storage → Create → Blob**. Connect it to your project. This gives you a `BLOB_READ_WRITE_TOKEN`.

### Step 2 — Add the token to your local `.env`

```
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_...
```

### Step 3 — Add Vercel API credentials to your local `.env` (optional but recommended)

To let `fetch-prospects-live` auto-create/update the `PROSPECTS_BLOB_URL` env var on Vercel, add:

```
VERCEL_API_TOKEN=...     # Account Settings → Tokens
VERCEL_PROJECT_ID=...    # Project Settings → General → Project ID
```

If you skip this, you can still set `PROSPECTS_BLOB_URL` manually in the Vercel dashboard (the script will print the URL).

### Step 4 — Fetch prospects, upload photos + JSON, sync env var

```bash
npm run fetch-prospects-live
```

This writes `data/prospects-live.json`, uploads photos to Blob, uploads the JSON itself to Blob at a stable URL, and (if the Vercel credentials are set) creates or updates the `PROSPECTS_BLOB_URL` env var on your Vercel project for Production + Preview.

> The `BLOB_READ_WRITE_TOKEN` and `VERCEL_API_TOKEN` are **never** needed inside Vercel itself — only locally for the fetch script.

### Step 5 — Deploy

Connect the repo to Vercel and deploy (or push to trigger an automatic deploy). The build runs `next build`, which calls `generateStaticParams`, fetches `PROSPECTS_BLOB_URL`, and pre-renders all `/p/[slug]` pages as static HTML.

### Re-fetching / updating prospects

1. Run `npm run fetch-prospects-live` locally to pull fresh data and re-upload photos + JSON. The env-var sync is a no-op on subsequent runs because the Blob URL is stable.
2. Trigger a redeploy (push a commit, or `git commit --allow-empty -m "refresh prospects" && git push`) — the build fetches the updated JSON from the same stable URL.
