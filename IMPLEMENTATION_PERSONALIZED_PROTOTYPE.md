# Personalized Prototype Layer — Implementation Plan

**Goal:** Convert the existing single-tenant prototype (`Orthodontiepraktijk De Boog`) into a personalized B2B outreach asset that can serve 100+ unique prospect URLs from a single deployment, with no per-prospect deploy required.

**Strategy:** One Next.js app, one Vercel deployment, dynamic `/p/[slug]` route reading prospect data from a Vercel environment variable (because the GitHub repo is public — see §10). Each cold-outreach email links to a unique URL like `yourdomain.nl/p/ortho013-tilburg-x7k2`, where the existing demo is rendered with that prospect's practice name, city, and doctor name injected, plus a B2B banner and a B2B closing section that frames the demo as theirs.

**Non-goals (this round):** No CMS, no admin UI, no auth. No calendar / booking link. No on-page contact mechanism — the prospect already has the email or LinkedIn message that delivered the link, so reply context is preserved off-page. No screenshots of the prospect's current site. No Lighthouse / diagnostic block. No automated data ingestion. All deferred to "Future iterations."

**Future-friendly:** The `Prospect` type is intentionally shaped to absorb Google Places API data later (rating, reviews, hours, address, phone, photos, place ID) without restructuring. See §3.

---

## 1. Architecture Summary

```
                  ┌─────────────────────────────────────────────┐
                  │  Single Next.js 16 app on Vercel            │
                  │                                             │
   /              │  ── showcase: De Boog defaults              │
   /p/[slug]      │  ── personalized: prospect from env var     │
                  │                                             │
                  │  Vercel env var PROSPECTS_JSON ← truth      │
                  │  data/prospects.json (gitignored, local)    │
                  └─────────────────────────────────────────────┘
```

- **One deploy serves all prospects.** Adding a prospect = update env var + redeploy (see §8).
- **Existing components stay intact** but become prop-driven instead of importing `PRACTICE_INFO` directly.
- **B2B framing layer** (banner + final closing section) only renders on `/p/[slug]` routes — the `/` showcase remains a clean consumer demo.
- **Unknown slugs return 404**, not the showcase. Prevents casual slug-guessing and avoids leaking that the route is dynamic.

---

## 2. File Structure (changes from current)

```
app/
├── layout.tsx              # unchanged
├── page.tsx                # showcase (De Boog defaults — keep current behavior)
├── p/
│   └── [slug]/
│       └── page.tsx        # NEW — personalized prospect entry point
├── not-found.tsx           # NEW — generic 404 (no leak of route shape)
└── globals.css             # unchanged

components/
├── (all existing — refactor to accept props, see §5)
├── B2BBanner.tsx           # NEW — sticky top banner shown only on /p/[slug]
└── B2BClosingSection.tsx       # NEW — final "this could be yours" section

data/
└── prospects.json          # NEW — gitignored local mirror (editable source of truth on disk)

lib/
├── constants.ts            # KEEP — becomes the showcase/default fallback
├── prospects.ts            # NEW — types, loader (reads env var), slug lookup, view helpers
└── utils.ts                # unchanged

public/
└── images/                 # unchanged

.gitignore                  # ADD: data/prospects.json, .env.local
```

No new runtime dependencies are required. Optional additions (Vercel Analytics) are listed in §10.

---

## 3. Prospect Data Shape (Designed for Future Google Places Enrichment)

### Design principles
1. **Only 4 fields are strictly required.** Everything else is optional. Components fall back to `lib/constants.ts` defaults when a field is missing.
2. **Domains are namespaced** (`practice`, `doctor`, `reviews`, `hours`, `location`, `outreach`). When Google Places data is added later, it slots into existing namespaces — no flat-shape sprawl.
3. **Each namespace maps cleanly to Google Places fields.** See the mapping table below.
4. **`source` and `metadata` provide escape hatches.** New unforeseen fields can be added under `metadata` without a type migration; `source` tracks where the data came from for debugging.
5. **No discriminated unions.** A single `Prospect` shape with optional fields is simpler than `ManualProspect | PlacesProspect`. Components don't care where the data came from.

### TypeScript shape (`lib/prospects.ts`)

```ts
// ── Required at minimum ─────────────────────────────────────────────────────
export type Prospect = {
  slug: string;                    // URL segment, must be unique
  practice: PracticeInfo;          // practice.name is the only required field inside
  outreach: OutreachInfo;          // operator, contact email, timestamps

  // ── Optional, progressively enriched ──────────────────────────────────────
  doctor?: DoctorInfo;
  reviews?: ReviewsInfo;
  hours?: HoursInfo;
  location?: LocationInfo;

  // ── Provenance & escape hatches ───────────────────────────────────────────
  source?: ProspectSource;         // 'manual' | 'google_places' | 'mixed'
  metadata?: Record<string, unknown>;  // ad-hoc fields not yet promoted to typed namespaces
};

export type PracticeInfo = {
  name: string;                    // REQUIRED
  shortName?: string;              // for UI compactness
  city?: string;
  address?: string;                // formatted single-line
  phone?: string;
  email?: string;
  website?: string;                // their current site URL
  placeId?: string;                // Google Places ID
  googleMapsUrl?: string;
};

export type DoctorInfo = {
  name?: string;                   // e.g. 'Dr. Pieter Jansen'
  salutation?: string;             // e.g. 'Dr. Jansen'
};

export type ReviewsInfo = {
  rating?: number;                 // e.g. 4.9
  count?: number;                  // e.g. 187
  source?: 'google' | 'zorgkaart' | string;
  items?: ReviewItem[];            // populated later from Places.reviews[]
};

export type ReviewItem = {
  author?: string;
  rating?: number;
  text?: string;
  date?: string;                   // ISO date
  language?: string;               // 'nl' | 'en' | ...
};

export type HoursInfo = {
  weekdayText?: string[];          // Places.opening_hours.weekday_text — pre-formatted, easiest
  periods?: { day: number; open: string; close: string }[];  // structured fallback
};

export type LocationInfo = {
  lat?: number;
  lng?: number;
  parking?: string;
  publicTransport?: string;
};

export type OutreachInfo = {
  operatorName: string;            // REQUIRED — shown in banner ("door {operatorName}")
  createdAt: string;               // ISO date — REQUIRED
  sentAt?: string;
  channel?: 'email' | 'linkedin';  // optional, for the operator's own tracking
};

export type ProspectSource = 'manual' | 'google_places' | 'mixed';
```

### Google Places API → Prospect mapping

When the V2 enrichment script runs, this is the field-by-field mapping:

| Google Places field                         | Prospect field                           |
|---------------------------------------------|------------------------------------------|
| `name`                                      | `practice.name`                          |
| `formatted_address`                         | `practice.address`                       |
| `address_components` → locality             | `practice.city`                          |
| `formatted_phone_number`                    | `practice.phone`                         |
| `international_phone_number`                | (not stored — use formatted)             |
| `website`                                   | `practice.website`                       |
| `place_id`                                  | `practice.placeId`                       |
| `url`                                       | `practice.googleMapsUrl`                 |
| `rating`                                    | `reviews.rating`                         |
| `user_ratings_total`                        | `reviews.count`                          |
| `reviews[]`                                 | `reviews.items[]`                        |
| `opening_hours.weekday_text`                | `hours.weekdayText`                      |
| `opening_hours.periods`                     | `hours.periods`                          |
| `geometry.location.lat/lng`                 | `location.lat`, `location.lng`           |
| `photos[]`                                  | (deferred — store `photo_reference` strings under `metadata.photoReferences` until image-fetch pipeline exists) |
| anything else                               | `metadata`                               |

After enrichment, set `source: 'mixed'` (manual outreach fields + Places fields).

### Loader API (`lib/prospects.ts`)

Loads prospects from the `PROSPECTS_JSON` environment variable (set in Vercel + `.env.local` for dev). Falls back to a gitignored `data/prospects.json` file if the env var is absent — convenient for local editing without juggling shell-quoted JSON.

```ts
import fs from 'node:fs';
import path from 'node:path';

function loadProspects(): Prospect[] {
  const fromEnv = process.env.PROSPECTS_JSON;
  if (fromEnv) return JSON.parse(fromEnv);

  const filePath = path.join(process.cwd(), 'data', 'prospects.json');
  if (fs.existsSync(filePath)) {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  }
  return [];
}

const prospects = loadProspects();

export function getAllProspects(): Prospect[] { return prospects; }
export function getProspectBySlug(slug: string): Prospect | null { ... }
export function getAllSlugs(): string[] { ... }

// View helper — components consume this, not the raw Prospect
export function getProspectView(prospect: Prospect): ProspectView { ... }
```

**On Vercel:** `data/prospects.json` does not exist (gitignored), so `PROSPECTS_JSON` env var is the only source. **Locally:** edit `data/prospects.json` directly; the env-var fallback means you don't need to copy-paste JSON into a shell variable to develop.

`ProspectView` is a **flattened, fully-resolved view** that merges the prospect's optional fields with sensible defaults. Components receive a `ProspectView` and never have to write `prospect?.practice?.city ?? DEFAULT_CITY` themselves.

```ts
export type ProspectView = {
  slug: string;
  practice: { name: string; shortName: string; city: string; address: string; phone: string; email: string; website?: string };
  doctor: { name: string; salutation: string };
  reviews: { rating: number; count: number };
  hours: { weekdayText: string[] };
  location: { parking: string; publicTransport: string };
  outreach: OutreachInfo;
};
```

### Two-layer fallback strategy

`getProspectView()` resolves missing fields in this order:

1. **Use the prospect's value** if present.
2. **Use a generic neutral default** (e.g., `"De orthodontist"`, `"onze praktijk"`) — *not* De Boog data. We don't want a prospect named "Ortho 013" to show "Dr. Emma van den Berg" as the doctor name when the doctor field is missing.

The De Boog defaults in `lib/constants.ts` remain the source of truth only for the **showcase route (`/`)**, which uses `PRACTICE_INFO` directly and never goes through `getProspectView`.

This is the seam that lets us add Google Places data later without touching components — `getProspectView` simply starts using newly-populated fields when they're present, and falls back to neutral defaults when they're not.

### Example V1 entry (`data/prospects.json`)

The first real prospect — Ortho 013, Tilburg:

```json
[
  {
    "slug": "ortho013-tilburg-x7k2",
    "practice": {
      "name": "Ortho 013 orthodontistenpraktijk",
      "shortName": "Ortho 013",
      "city": "Tilburg",
      "address": "Olympiaplein 391, 5022 DX Tilburg",
      "phone": "+31 13 303 4512",
      "website": "http://www.ortho013.nl/"
    },
    "outreach": {
      "operatorName": "Vahe",
      "createdAt": "2026-05-09",
      "channel": "email"
    },
    "source": "manual"
  }
]
```

Note: `doctor` is omitted — we don't have that data yet for Ortho 013. The view helper resolves `doctor.name` to a neutral fallback (e.g., *"Onze orthodontist"*) and `AuthorityBio` adapts. When Google Places enrichment runs in V2, the doctor field can be filled in (or left absent — Places doesn't always have it).

---

## 4. Routing

### `/` — Showcase
- Behavior unchanged. Renders existing `app/page.tsx` with `PRACTICE_INFO` (De Boog defaults).
- No B2B banner, no closing section. This is a clean consumer demo for any inbound traffic that lands on the bare domain.

### `/p/[slug]` — Personalized prospect page
- Server component. Looks up `slug` in `prospects.json`. Calls `notFound()` if missing.
- Calls `getProspectView()` to resolve defaults + prospect overrides into a single view.
- Renders the same component tree as `/`, but:
  - `B2BBanner` renders at the top.
  - `Hero`, `Navbar`, `Footer`, `AuthorityBio`, `LocationSection` receive props derived from the view.
  - `B2BClosingSection` renders as the last section before `Footer`.
- `generateStaticParams` returns all slugs at build time → static export per prospect, fast.
- `generateMetadata` produces a per-prospect `<title>` and OG tags (e.g., "Demo voor Orthodontiepraktijk Jansen").

### `/not-found` (root-level)
- Generic Dutch "Pagina niet gevonden" page. Links back to `/`.
- Avoids leaking that `/p/[slug]` is dynamic.

---

## 5. Component Refactor — What Becomes Prop-Driven

The existing components import `PRACTICE_INFO`, `TESTIMONIALS`, etc. directly from `lib/constants.ts`. We need to invert this for personalized routes without breaking the showcase route.

### Pattern
Each affected component gets an **optional prop bundle**. If absent, it falls back to the constants (showcase behavior). If present, the prospect view wins.

```tsx
// Hero.tsx
type HeroProps = {
  onOpenBooking: () => void;
  practice?: { name: string; city: string };
};
```

### Components to refactor

| Component                  | What changes                                                                 |
|----------------------------|------------------------------------------------------------------------------|
| `Hero.tsx`                 | H1 line: "De orthodontist in **{city}** voor een rechte lach…". Mobile sticky bar uses `practice.name`. |
| `Footer.tsx`               | Practice name, NAP block. Defaults to constants.                             |
| `AuthorityBio.tsx`         | Doctor name + salutation. Bio paragraph stays generic.                       |
| `LocationSection.tsx`      | City reference in heading. Address stays generic when prospect has no address. |
| `Navbar.tsx`               | Practice name (left side). Defaults to constants.                            |
| `TrustBar.tsx`             | No change for V1. Will become prop-driven in V2 (real `reviews.rating` / `count` from Places). |
| `TreatmentCard.tsx`        | No change.                                                                   |
| `BeforeAfter.tsx`          | No change — illustrative cases, not the prospect's.                          |
| `FAQ.tsx`                  | No change.                                                                   |
| `CTASection.tsx`           | No change — patient-facing CTA stays consumer-flavored.                      |
| `BookingModal.tsx`         | No change — patient demo modal stays as-is.                                  |

### Constants stay the source of truth for defaults
`lib/constants.ts` keeps De Boog data. `getProspectView()` spreads prospect overrides on top of constants. No constants file is deleted.

---

## 6. New Component: `B2BBanner.tsx`

**Purpose:** The first thing the prospect sees. Frames the demo as *theirs*, not a generic page.

**Visibility:** Only on `/p/[slug]` routes.

**Layout:**
- Sticky to top, full-width, `z-60` (above Navbar).
- Height: ~48px desktop, ~64px mobile (wraps).
- Background: dark accent or slightly off-tone from the demo so it's visually distinct from the page.

**Content (left → right):**
- *"Demo gemaakt voor **{practice.name}** — {city}"*
- *"door {operatorName}"* — small muted text, identifies the operator
- Dismiss button (×) on the right, sets `localStorage[demoBannerDismissed:{slug}] = true`.

**On dismiss:** banner hides for the rest of the session. No floating pill — the closing pitch lives entirely in `B2BClosingSection` (§7), so the prospect always reaches it by scrolling.

The banner is informational, not a CTA. There is no on-page conversion action this round — the prospect replies to the email or LinkedIn message that delivered them here.

---

## 7. New Component: `B2BClosingSection.tsx`

**Purpose:** The closing framing *to the orthodontist* — separate from the patient-facing `CTASection`. Pure framing, no on-page action. The prospect already has the email / LinkedIn message that delivered them here; reply context lives there.

**Placement:** Last section before `Footer`, only on `/p/[slug]`.

**Content:**
- H2: *"Dit is een demo, gemaakt voor {practice.name}."*
- Body: *"Een vergelijkbare site, gepersonaliseerd voor uw praktijk, in 10 werkdagen live. Geen langlopende contracten."*
- Closer line: *"Reageer op mijn bericht als u interesse heeft."*

**Visual:** Distinct from the consumer `CTASection` — different background (e.g., neutral/dark), no patient-facing language, no buttons. Reads as a signed closing, not a sales section.


---

## 8. Operator Workflow — Adding a New Prospect

Because the GitHub repo is public, prospect data lives in a Vercel environment variable, not in git. The day-to-day flow:

1. **Edit `data/prospects.json` locally** (gitignored). Append a new entry:
   - Slug = `{practice-base}-{city}-{4-random-chars}`
   - Fill in: practice name, shortName, city, address, phone, website (whatever you have)
   - Reuse `outreach.operatorName` from a previous entry
   - Set `createdAt` to today
   - Set `source: "manual"`
2. **Verify locally.** `npm run dev`, open `http://localhost:3000/p/{new-slug}`, confirm rendering.
3. **Sync to Vercel.** Two options:
   - **CLI (recommended once set up):** `cat data/prospects.json | vercel env add PROSPECTS_JSON production` — replaces the existing env var with the new file contents.
   - **Dashboard:** copy the file contents, paste into the Vercel env-var editor for `PROSPECTS_JSON`, save.
4. **Trigger redeploy.** `vercel --prod` or push any (unrelated) commit to `main` to fire the deploy. Takes ~30s.
5. **Test** the production URL in incognito.
6. **Send the cold email.**

**Total time per prospect after the first 5:** ~3 minutes. The Vercel sync step adds friction vs. a private-repo `git push` flow, but it's a one-line CLI command once you've memorized it.

### Optional convenience: a sync script

For 50+ prospects, add `scripts/sync-prospects.ts` that wraps the CLI step:

```bash
npm run sync-prospects  # reads data/prospects.json, pushes to Vercel, triggers redeploy
```

Skip until friction starts mattering — usually around prospect #20.

### `.gitignore` additions

```
data/prospects.json
.env.local
.env*.local
```

The local file is the editable mirror; the env var is the deployed truth. Keep them in sync via the workflow above.

---

## 9. Slug Strategy

**Format:** `{practice-base}-{city}-{4-char-random}`
- `jansen-orthodontie-utrecht-x7k2`
- `de-vries-amsterdam-q9m4`

**Random suffix:** 4 chars, alphanumeric lowercase. Generated per prospect (`crypto.randomBytes(2).toString('hex')` or just by hand).

**Why suffix:** prevents `/p/jansen-orthodontie-utrecht` from being guessable. Path obscurity, not security — but it stops competitors and casual visitors from stumbling onto each other's pages.

**Why include city:** disambiguates the `Jansen` problem (multiple practices share names in NL).

---

## 10. Deployment & Analytics

### Platform
- **Vercel.** Free tier covers this until volume crosses Hobby limits; upgrade to Pro ($20/mo flat) when needed. No per-prospect cost.
- Custom domain attached to a single Vercel project. All slugs live under that domain.

### Environment variables

| Variable             | Where     | Purpose                                                         |
|----------------------|-----------|-----------------------------------------------------------------|
| `PROSPECTS_JSON`     | Vercel + `.env.local` | The full prospects array, JSON-stringified. Required in production. Optional locally (falls back to `data/prospects.json`). |
| `GOOGLE_PLACES_API_KEY` | Vercel | V2 enrichment script. Not needed yet.                          |

**Why an env var instead of a repo file:** the GitHub repo is public, and prospect names + outreach status are competitive information. The Vercel env var is encrypted at rest and only injected at build time; it never lands in the public repo or its build output (the rendered HTML pages live on Vercel's CDN, only reachable via the obscure `/p/{slug}` URLs).

> **Sidenote:** Vercel does deploy private GitHub repos on the free Hobby plan, so a public repo isn't required for hosting. If you ever flip the repo to private, you can switch to committed `prospects.json` for simpler workflow — no other changes needed (the env var fallback in `lib/prospects.ts` reads from the file when the var is absent).

### Analytics
- **Vercel Web Analytics** (free, drop-in): `npm i @vercel/analytics`, add `<Analytics />` to `app/layout.tsx`. Per-route view counts surface which prospects opened their page — a critical signal for follow-up timing.
- Alternative: Plausible (€9/mo) for cleaner UI. Vercel's built-in is fine to start.

### Build optimization
- `generateStaticParams` in `app/p/[slug]/page.tsx` produces static pages per prospect → instant TTFB, no server runtime cost.
- Re-deploy = full rebuild of all static pages. At 100 prospects this is ~30s on Vercel; not a concern.

---

## 11. Phased Implementation Sequence

### Phase 1 — Types & data loader (45 min)
1. Create `lib/prospects.ts` with the full type hierarchy from §3.
2. Implement `loadProspects()` (reads `PROSPECTS_JSON` env var, falls back to `data/prospects.json` file).
3. Implement `getAllProspects`, `getProspectBySlug`, `getAllSlugs`, `getProspectView`.
4. `getProspectView` resolves missing fields to neutral generic defaults (not De Boog data) — this is the seam that future Google Places data will plug into without component changes.
5. Add `data/prospects.json`, `.env.local`, `.env*.local` to `.gitignore`.
6. Create `data/prospects.json` locally with the Ortho 013 example entry from §3.

### Phase 2 — Routing scaffolding (30 min)
5. Create `app/p/[slug]/page.tsx` — server component, looks up prospect, calls `notFound()` if missing, renders existing component tree (without prospect props yet — just verify routing works).
6. Create `app/not-found.tsx` — generic Dutch 404.
7. Confirm `/` still works (showcase) and `/p/{example-slug}` returns the page.

### Phase 3 — Component prop refactor (1.5 hr)
8. Add optional props to: `Hero`, `Navbar`, `Footer`, `AuthorityBio`, `LocationSection`. Default to constants when prop absent.
9. In `app/p/[slug]/page.tsx`, call `getProspectView()` and pass derived props to each component.
10. Verify `/` (showcase) still uses De Boog data, and `/p/{slug}` uses prospect data.

### Phase 4 — B2B layer (1 hr)
11. Build `B2BBanner.tsx` (sticky, dismissible).
12. Build `B2BClosingSection.tsx` (final B2B pitch).
13. Wire both into `app/p/[slug]/page.tsx` only — keep `/` clean.

### Phase 5 — First real prospect (Ortho 013) + Vercel sync (30 min)
14. Confirm Ortho 013 entry in `data/prospects.json` (already added in Phase 1).
15. Set up `PROSPECTS_JSON` env var on Vercel (CLI or dashboard, see §8).
16. Add the same to `.env.local` for local dev parity.
17. Test URL end-to-end on local + Vercel preview deploy: `/p/ortho013-tilburg-x7k2`.
18. Send the first outreach email to Ortho 013.

### Phase 6 — Polish (as needed)
17. `generateMetadata` per prospect.
18. Vercel Analytics integration.
19. Iterate copy on `B2BBanner` and `B2BClosingSection` based on first 5 reply rates.

**Total estimated work for a working V1: ~3.5 hours** (excluding Vercel account setup if not already done).

---

## 12. Future Iterations (Not This Round)

These are deliberately deferred. Build only after V1 is sending.

- **Google Places enrichment.** A `scripts/enrich-prospect.ts` CLI: takes a slug, fetches Places details for that practice, populates `practice.address/phone/website`, `reviews.rating/count/items`, `hours.weekdayText`, `location.lat/lng`. Sets `source: 'mixed'`. Components automatically pick up the new data via `getProspectView()`.
- **Real reviews on prospect pages.** Once `reviews.items` is populated from Places, swap mocked testimonials in `AuthorityBio` for real ones (with attribution + date). Conversion gold — the prospect sees their own Google reviews framed inside a premium site.
- **Real `TrustBar` numbers.** Replace hardcoded `4.9/5 · 187 recensies` with `reviews.rating / reviews.count` from Places when present.
- **Real opening hours in `LocationSection`.** Use `hours.weekdayText` from Places.
- **Diagnostic / "before" block.** Re-introduce later with a real screenshot of the prospect's site (manual capture or ScreenshotOne API) and Lighthouse scores. Skipped now to validate outreach mechanics first.
- **Per-prospect logo/colors.** Pull favicon from `practice.website`, render in B2BBanner.
- **Analytics-driven follow-up.** When a prospect visits their page 2× in 24h, send Slack/email alert (Vercel Analytics → webhook).
- **Admin UI.** A protected `/admin` route for adding prospects via form. Worth it past ~50 prospects when JSON merge conflicts become annoying.
- **A/B testing.** Once 30+ prospects are sent, test variants of `B2BBanner` framing.
- **Migration to Vercel KV / Postgres.** When `prospects.json` crosses ~500 entries or you want multi-operator access. Not before.

---

## 13. Decisions Confirmed

1. ~~Calendar link~~ — **dropped this round.**
2. ~~On-page contact action~~ — **dropped this round.** No `mailto:`, no form. The prospect replies to the email or LinkedIn message that delivered the link.
3. **Repo visibility** — public. Prospect data goes into Vercel env var `PROSPECTS_JSON`, not committed (see §8, §10).
4. **First real prospect** — Ortho 013 orthodontistenpraktijk, Tilburg. Data captured in §3 example.
5. **Showcase fate** — keep `/` as the De Boog demo for now.

No open questions remain.

---

## 14. Success Criteria

- [ ] `/` still renders the De Boog showcase, unchanged in look and behavior.
- [ ] `/p/{any-known-slug}` renders the demo with that prospect's name, city, and doctor injected.
- [ ] `/p/{unknown-slug}` returns a clean 404 (no leak of route shape).
- [ ] B2B banner is visible at top on prospect pages, dismissible, persists across pageviews.
- [ ] B2B closing section appears before footer on prospect pages with practice-specific framing copy (no buttons, no on-page contact action).
- [ ] `PROSPECTS_JSON` env var is set on Vercel; prospect data is not committed to the public repo.
- [ ] Adding a new prospect requires: 1 JSON edit + 1 env-var sync + 1 redeploy. ≤3 min after first 5.
- [ ] `Prospect` type accepts Google Places fields without restructuring — adding `reviews.rating`, `practice.address`, etc. is a JSON edit, not a code change.
- [ ] Vercel deploy is green; all prospect pages statically pre-rendered.
- [ ] Page load < 1.5s LCP on mobile.

---

**Status:** Ready for Phase 1. No open questions.
