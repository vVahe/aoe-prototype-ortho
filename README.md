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
Same as above, but uploads each photo to **Vercel Blob** and stores the resulting `https://` URL in the output instead of a local path. Output is written to `data/prospects-live.json`.

Use this before a Vercel deployment. Requires `BLOB_READ_WRITE_TOKEN` in `.env` (see [Vercel deploy](#vercel-deploy)).

Re-running is safe — images already on disk are not re-downloaded from Google; they are re-uploaded to Blob (overwriting the same path).

**`data/place-ids.json` format:**
```json
["ChIJOScCilC-xkcRJAESGoQ38TI", "ChIJrT33lIU1xEcRo7AzqF7EmEg"]
```
Find Place IDs via [Google Place ID Finder](https://developers.google.com/maps/documentation/places/web-service/place-id).

---

## Prospect data at runtime

The app resolves prospect data in this priority order:

1. **`PROSPECTS_JSON` env var** — a JSON string of the full prospects array (used in Vercel deployments to avoid committing the data)
2. **`data/prospects.json`** — local file, used when running locally

If neither is present the app renders with no prospects (pages return 404).

---

## Vercel deploy

The app is designed to run on Vercel's **free Hobby plan**. No paid features are required.

### What Vercel provides

| Feature | Used for |
|---|---|
| Hosting + CDN | Serves the Next.js app |
| Vercel Blob (free: 500 MB / 1 GB egress per month) | Stores practice photos as publicly accessible files |
| Environment variables | Holds prospect data and the Blob token |

### Step 1 — Add a Blob store

In the Vercel dashboard go to **Storage → Create → Blob**. Connect it to your project. This gives you a `BLOB_READ_WRITE_TOKEN`.

### Step 2 — Add the token to your local `.env`

```
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_...
```

### Step 3 — Fetch prospects and upload photos

```bash
npm run fetch-prospects-live
```

This writes `data/prospects-live.json` with `https://...vercel-storage.com/...` URLs for every photo.

### Step 4 — Set environment variables in Vercel

In the Vercel dashboard go to **Settings → Environment Variables** and add:

| Variable | Value | Environment |
|---|---|---|
| `PROSPECTS_JSON` | Full contents of `data/prospects-live.json` | Production, Preview |

> The `BLOB_READ_WRITE_TOKEN` does **not** need to be added to Vercel environment variables — it is only used by the local fetch script, not by the running app.

### Step 5 — Deploy

Connect the repo to Vercel and deploy (or push to trigger an automatic deploy). The build runs `next build`, which calls `generateStaticParams`, reads `PROSPECTS_JSON`, and pre-renders all `/p/[slug]` pages as static HTML.

### Re-fetching / updating prospects

1. Run `npm run fetch-prospects-live` locally to pull fresh data and re-upload photos.
2. Update `PROSPECTS_JSON` in Vercel with the new contents of `data/prospects-live.json`.
3. Trigger a redeploy (or push a commit) to rebuild the static pages.
