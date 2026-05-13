# Personalization V2 — Dynamic Fallbacks & Honest Placeholders

**Builds on:** [IMPLEMENTATION_PERSONALIZED_PROTOTYPE.md](IMPLEMENTATION_PERSONALIZED_PROTOTYPE.md). V1 stood up the `/p/[slug]` route, the `Prospect` shape, and Google Places enrichment for practice metadata. V2 closes the gap between *"we have real data"* and *"we don't have enough real data"* without faking content.

**Goal:** Make every prospect page feel maximally personal where the data is real, and unambiguously honest where it isn't — so the prototype reads as productized infrastructure, not a forged mockup.

**The principle (load-bearing — read before anything else):** Personalize what the owner emotionally recognizes; label what they rationally evaluate. Push both extremes simultaneously in different parts of the page. A middle setting (partial personalization with no clear distinction) is actively worse than honest placeholders, because once the owner spots one fake-looking-personal element, trust collapses retroactively across the entire prototype.

**Non-goals (this round):** No on-page lead capture, no admin UI, no per-prospect colours/logos, no team bios. No diagnostic "before" block. All deferred.

---

## 1. What's Real vs. What's Placeholder

Two layers, each tuned independently. Do not blend them.

### Personalize to the maximum (real data only — never fall back to fake-personal content)

| Element | Source | Behavior when missing |
|---|---|---|
| Practice name | Prospect entry | Required — without it the page doesn't render |
| City | Google Places (`address_components`) | Neutral fallback `"uw regio"` (already implemented) |
| Doctor name / salutation | Manual or Places (rare) | Neutral fallback `"Onze orthodontist"` (already implemented) |
| Hero copy referencing city | View helper | Drops the city phrase rather than substitute a fake one |
| Address, phone, opening hours | Google Places | Section hides cleanly if absent |
| Google Maps link | Places `url` | Button hides if absent |

These elements never carry a "Voorbeeld" tag. Either they're real or they're absent. **Never substitute fake-personal content** (e.g., a stock photo with the practice name overlaid, a fabricated doctor name).

### Clearly label as placeholder (when real data is insufficient)

| Element | Real-data threshold | Fallback |
|---|---|---|
| Reviews carousel | ≥ 3 reviews with 4★+ rating | 10 crafted Dutch placeholder reviews + section-level "Voorbeeldweergave" label |
| Practice gallery | ≥ 5 owner-uploaded photos | Curated stock practice photos + section-level "Voorbeeldgalerij" label |

These elements *always* render — the layout is never empty — and *always* carry a clear label when in fallback mode. The label is framed as a feature of the live system, not a defensive disclaimer.

### Why a 3-photo / 3-review threshold (not 5)

Small regional practices (Zwolle, Apeldoorn, Leeuwarden) often sit at 8–15 total Google reviews and 0–3 owner-uploaded photos. A threshold of 5 ships too many prototypes into placeholder mode. Three real reviews still reads credibly; three real photos still demonstrates the gallery layout with authentic content. Drop the bar so more prototypes ship with real data.

**Tunable per element.** Add `PLACEHOLDER_THRESHOLD_REVIEWS` and `PLACEHOLDER_THRESHOLD_PHOTOS` as constants — easy to revise after the first 20 prospects.

---

## 2. Placeholder Reviews — Where They Live

### File placement

```
lib/
└── placeholder-reviews.ts    # NEW — exports the 10 crafted reviews
```

Reviews live in TypeScript (not JSON) so they're statically bundled, typed against `ReviewItem`, and can't drift out of sync with the schema. They never touch `data/prospects.json` — per-prospect data stays prospect-specific.

### Shape

```ts
// lib/placeholder-reviews.ts
import type { ReviewItem } from './prospects';

export const PLACEHOLDER_REVIEWS: ReviewItem[] = [
  {
    author: 'Familie de V.',
    rating: 5,
    text: 'Onze dochter was best zenuwachtig voor haar eerste afspraak, maar het hele team stelde haar meteen op haar gemak. Alles werd rustig uitgelegd, ook aan ons als ouders. Inmiddels zijn we halverwege de behandeling en gaat het super.',
    language: 'nl',
  },
  // ... 9 more (see §6 for the full list)
];
```

All ten reviews are pre-written (§6). No randomization, no per-prospect variation in V2 — every fallback prototype shows the same ten in the same order. Variation can be added later by shuffling with a slug-seeded RNG if reply data suggests it matters.

### Wiring into `ReviewsSection`

The component already takes `items: ReviewItem[]`. The fallback decision happens in `ProspectPageClient` (or a tiny helper in `lib/prospects.ts`), not inside `ReviewsSection`:

```ts
// lib/prospects.ts (new helper)
import { PLACEHOLDER_REVIEWS } from './placeholder-reviews';

const PLACEHOLDER_THRESHOLD_REVIEWS = 3;

export function resolveReviews(view: ProspectView): {
  items: ReviewItem[];
  isPlaceholder: boolean;
  realCount: number;
} {
  const real = view.reviews.items.filter((r) => (r.rating ?? 0) >= 4 && r.text && r.author);
  if (real.length >= PLACEHOLDER_THRESHOLD_REVIEWS) {
    return { items: real, isPlaceholder: false, realCount: real.length };
  }
  return { items: PLACEHOLDER_REVIEWS, isPlaceholder: true, realCount: real.length };
}
```

`ReviewsSection` gains an `isPlaceholder?: boolean` prop. When true:
- Render a "Voorbeeld" chip on each review card (top-right, muted accent).
- Slightly desaturate the card background (`bg-secondary/60` vs. `bg-secondary`).
- Replace the "Google Recensies" eyebrow with **"Voorbeeldreviews — wordt gevuld met jullie Google-reviews bij livegang"**.
- Hide the Google attribution line (since the content isn't from Google).

**Don't** mix placeholder reviews with real ones to "pad" a prospect with only 1–2 real reviews. That's the exact "fake-looking realness" failure mode the strategy avoids. Either all real (real count ≥ threshold) or all placeholder.

### Google Places attribution when real

When showing real Places reviews, the existing `ReviewsSection` needs an attribution pass:
- Reviewer name as Places provides it (already correct).
- Add a small footer link to the practice's Google Maps listing (`view.practice.googleMapsUrl`) reading **"Bekijk alle recensies op Google"**.
- Keep the "Google Recensies" eyebrow.

This satisfies Places API terms (attribution + link back to the source listing) and pre-empts the "are we allowed to show these?" question prospects ask.

---

## 3. Placeholder Practice Photos — Where They Live

### File placement

```
public/
└── images/
    └── placeholders/
        └── practice/
            ├── 01-waiting-room.jpg
            ├── 02-treatment-room.jpg
            ├── 03-reception.jpg
            ├── 04-exterior.jpg
            ├── 05-equipment.jpg
            ├── 06-consultation.jpg
            ├── 07-team-space.jpg
            └── 08-detail.jpg
```

Files live under `public/` so they're served as static assets at predictable paths. The `placeholders/practice/` subfolder makes intent obvious to anyone reading the repo.

**Source the images carefully:**
- Licensed stock that genuinely looks like a modern Dutch ortho practice (clean, light, not US-style). Unsplash/Pexels work if you curate; avoid the obvious generic-dentist-with-pointing-mirror shots.
- Eight is enough — the gallery caps at 10, and 8 covers all grid layouts (1, 2, 3, 4+, 5+).
- Same aspect ratio across all eight so the grid stays clean.

A `README.md` next to the images noting their license + source URL is worth the 30 seconds; you'll thank yourself when a prospect asks where they came from.

### Constants

```ts
// lib/placeholder-photos.ts
export const PLACEHOLDER_PRACTICE_PHOTOS = [
  '/images/placeholders/practice/01-waiting-room.jpg',
  '/images/placeholders/practice/02-treatment-room.jpg',
  '/images/placeholders/practice/03-reception.jpg',
  '/images/placeholders/practice/04-exterior.jpg',
  '/images/placeholders/practice/05-equipment.jpg',
  '/images/placeholders/practice/06-consultation.jpg',
  '/images/placeholders/practice/07-team-space.jpg',
  '/images/placeholders/practice/08-detail.jpg',
];

export const PLACEHOLDER_THRESHOLD_PHOTOS = 5;
```

### Wiring into `PraktijkGallery`

Mirror the reviews helper:

```ts
// lib/prospects.ts
import { PLACEHOLDER_PRACTICE_PHOTOS, PLACEHOLDER_THRESHOLD_PHOTOS } from './placeholder-photos';

export function resolvePhotos(view: ProspectView): {
  photos: string[];
  isPlaceholder: boolean;
  realCount: number;
} {
  const real = view.practice.photos ?? [];
  if (real.length >= PLACEHOLDER_THRESHOLD_PHOTOS) {
    return { photos: real, isPlaceholder: false, realCount: real.length };
  }
  return { photos: PLACEHOLDER_PRACTICE_PHOTOS, isPlaceholder: true, realCount: real.length };
}
```

Current behavior in [ProspectPageClient.tsx:27](app/p/[slug]/ProspectPageClient.tsx#L27) hides the gallery entirely when there are no photos. That changes: the gallery now *always* renders, either with real photos or placeholders.

`PraktijkGallery` gains an `isPlaceholder?: boolean` prop. When true:
- Each tile shows a small "Voorbeeld" chip in the corner.
- Subtitle changes from *"Een moderne en gastvrije omgeving voor uw behandeling"* to **"Voorbeeldgalerij — bij livegang plaatsen we foto's van jullie eigen praktijk. We helpen met een korte fotosessie of gebruiken bestaande foto's die jullie aanleveren."**
- The "Foto's via Google" footer line is replaced with **"Voorbeeldfoto's — vervangen bij livegang"**.

The longer subtitle is doing sales work: it pre-empts the *"I'd need to organize a photoshoot"* objection and signals operational thought about the path to production. Don't shorten it just because it's wordy — the wordiness is the point.

### Don't mix real + placeholder photos

Same rule as reviews. If real photos < threshold, use all placeholders. Mixing pollutes the trust signal.

---

## 4. Personalization Status Note (Optional but Recommended)

A small visible indicator listing what's real vs. placeholder on the current page. Counter-intuitively, surfacing this *increases* trust rather than spoiling the magic.

### Placement options (pick one)

| Option | Pros | Cons |
|---|---|---|
| **Inside `B2BBanner`** — expandable "Wat is real, wat is voorbeeld?" disclosure | Lives next to the existing B2B framing; doesn't pollute the page body | Adds complexity to a component that's intentionally minimal |
| **Sidebar pill** (sticky right-edge, like a Vercel preview indicator) | Always visible, doesn't compete with content | Extra component; risks looking like a debug overlay |
| **One-line note inside `B2BClosingSection`** | Lowest-effort; reaches the prospect exactly when they're in evaluation mode | Only seen after scrolling to the end |

**Recommended:** the closing-section variant for V2. It's where rational evaluation peaks anyway, and adds zero UI surface area.

### Copy template

```
Deze preview gebruikt: {real items, comma-separated}.
Voorbeelden: {placeholder items, comma-separated}.
```

Filled dynamically per prospect. Examples:

> *"Deze preview gebruikt: jullie praktijknaam, locatie, contactgegevens, openingstijden, en 12 Google-reviews. Voorbeelden: praktijkfoto's."*

> *"Deze preview gebruikt: jullie praktijknaam en locatie. Voorbeelden: reviews, praktijkfoto's, contactgegevens."*

### Wiring

```ts
// lib/prospects.ts
export type PersonalizationStatus = {
  real: string[];        // human-readable Dutch labels
  placeholder: string[];
};

export function getPersonalizationStatus(
  view: ProspectView,
  reviews: { isPlaceholder: boolean; realCount: number },
  photos:  { isPlaceholder: boolean; realCount: number },
): PersonalizationStatus { ... }
```

Pass into `B2BClosingSection`, render as a small muted paragraph below the closer line.

---

## 5. Component Changes Summary

| Component | Change |
|---|---|
| `ReviewsSection.tsx` | Add `isPlaceholder` prop; conditional eyebrow text, per-card "Voorbeeld" chip, footer attribution swap |
| `PraktijkGallery.tsx` | Add `isPlaceholder` prop; conditional subtitle, per-tile "Voorbeeld" chip, footer line swap. Remove early return on empty photos |
| `ProspectPageClient.tsx` | Call `resolveReviews()` and `resolvePhotos()`; always render gallery; pass `isPlaceholder` flags |
| `B2BClosingSection.tsx` | Append personalization-status note below the closer line |
| `lib/prospects.ts` | Add `resolveReviews`, `resolvePhotos`, `getPersonalizationStatus` helpers + threshold constants |
| `lib/placeholder-reviews.ts` | NEW — exports `PLACEHOLDER_REVIEWS` |
| `lib/placeholder-photos.ts` | NEW — exports `PLACEHOLDER_PRACTICE_PHOTOS`, thresholds |

No new dependencies. No changes to the `Prospect` schema or the enrichment pipeline. The fallback layer is pure presentation.

---

## 6. The Ten Placeholder Reviews (Final Copy)

Pre-approved Dutch reviews. Variety covers: parent, adult patient, doorverwezen patient, hesitant patient. Outcome anchors echo the prototype's positioning (rust, duidelijkheid, transparante kosten, geen verrassingen). Phrasing is deliberately understated — no superlative stacking, which reads as an Anglo pattern to a Dutch reader.

1. **Familie de V.** — *"Onze dochter was best zenuwachtig voor haar eerste afspraak, maar het hele team stelde haar meteen op haar gemak. Alles werd rustig uitgelegd, ook aan ons als ouders. Inmiddels zijn we halverwege de behandeling en gaat het super."*

2. **Mark B.** — *"Goede uitleg over de verschillende opties, inclusief wat wel en niet vergoed wordt door de zorgverzekering. Geen verrassingen achteraf, dat waardeer ik enorm. Aanrader."*

3. **Linda H.** — *"Ik heb op mijn 34e alsnog een beugel genomen en koos voor deze praktijk vanwege de ervaring met volwassenen. Werd nooit raar aangekeken, juist heel professioneel begeleid. Resultaat is precies wat ik hoopte."*

4. **Sanne K.** — *"Vriendelijke ontvangst, korte wachttijden en duidelijke prijsafspraken vooraf. De assistentes zijn enorm geduldig met kinderen. Wij komen er al ruim een jaar en zijn nog steeds tevreden."*

5. **J. Visser** — *"Heldere intake, eerlijk advies. De orthodontist gaf aan dat een minder uitgebreide behandeling voldoende was — had makkelijk meer kunnen verkopen maar deed dat niet. Dat schept vertrouwen."*

6. **Familie Bakker** — *"Hele fijne praktijk. Mijn zoon vindt het zelfs leuk om te komen, wat ik nooit had verwacht. Afspraken lopen op tijd en je wordt netjes geïnformeerd via de app."*

7. **Daniël O.** — *"Gekozen voor Invisalign na een uitgebreid kennismakingsgesprek. Alle vragen werden beantwoord, ook de praktische zoals reinigen en sporten met de aligners. Behandeling verloopt soepel."*

8. **Esther M.** — *"Wij zijn doorverwezen via onze tandarts en vanaf het eerste moment voelde het goed. Professioneel, modern, en de communicatie met ouders is uitstekend. Beugel is er net uit en het resultaat is prachtig."*

9. **P. de Jong** — *"Wat ik bijzonder vind: ze nemen echt de tijd om uit te leggen wat er gaat gebeuren en waarom. Geen standaardverhaal, maar afgestemd op onze situatie. Ook de kosten zijn transparant besproken."*

10. **Mevrouw T.** — *"Na slechte ervaringen elders bij deze praktijk terechtgekomen. Verschil is groot — rust, duidelijkheid en een team dat meedenkt. Mijn dochter draagt nu na 18 maanden haar retainer en het eindresultaat is fantastisch."*

All rated 5★ for the schema, all `language: 'nl'`, no `date` field (the `ReviewsSection` doesn't render dates today).

---

## 7. Sales Talk-Track

The dynamic-fallback behavior is itself a selling point. Surface it explicitly when walking a prospect through the prototype — don't hide it:

> *"Zodra we live gaan, laden we hier automatisch jullie eigen Google-reviews in — alleen de 4- en 5-sterren reviews, gefilterd, met de meest recente eerst. Wat je nu ziet zijn voorbeelden zodat je kan zien hoe het eruit komt te zien."*

This single sentence moves the conversation from *"nice design"* to *"this is infrastructure that runs for me."* It converts the placeholder from a workaround into a feature.

Same pattern for the gallery:

> *"De foto's hier zijn voorbeelden — bij livegang gebruiken we foto's van jullie praktijk. Daar helpen we bij, hetzij met een korte fotosessie hetzij met wat jullie al hebben liggen."*

Both lines pre-empt operational objections (*"how do you get reviews?"*, *"do I need photos?"*) and signal that the path to production is already worked out.

---

## 8. Phased Implementation

### Phase 1 — Placeholder content & helpers (45 min)
1. Create `lib/placeholder-reviews.ts` with the 10 reviews from §6.
2. Source 8 stock practice photos; place under `public/images/placeholders/practice/`. Add a `README.md` with source URLs and license.
3. Create `lib/placeholder-photos.ts` with the array + threshold constants.
4. Add `resolveReviews()` and `resolvePhotos()` to `lib/prospects.ts`.
5. Add `getPersonalizationStatus()` to `lib/prospects.ts`.

### Phase 2 — Component prop updates (45 min)
6. Update `ReviewsSection.tsx`: add `isPlaceholder` prop, conditional eyebrow + per-card chip + footer attribution. When real, append Google Maps link.
7. Update `PraktijkGallery.tsx`: add `isPlaceholder` prop, conditional subtitle + per-tile chip + footer line. Remove early-return on empty photos.
8. Update `B2BClosingSection.tsx`: append personalization-status note.

### Phase 3 — Wiring (15 min)
9. Update `ProspectPageClient.tsx`: call resolvers, always render gallery, pass `isPlaceholder` flags into the two sections, pass status into closing section.
10. Verify the four existing prospects in `data/prospects.json` each render correctly — confirm real-vs-placeholder mode for each based on their actual review/photo counts.

### Phase 4 — Visual QA (30 min)
11. Compare a placeholder-mode prospect against a real-data prospect side by side. Confirm the placeholder mode looks deliberately styled, not broken.
12. Tune the "Voorbeeld" chip placement, opacity, and the subtitle copy until the labeling feels confident rather than apologetic.

**Total estimated work: ~2.5 hours**, excluding stock-photo sourcing (budget 1 hour if you're picky, which you should be).

---

## 9. What Not to Do (Failure Modes to Avoid)

- **Don't mix real and placeholder content** within the same section to "pad" thin real data. One missed real-vs-fake distinction collapses trust across the whole page.
- **Don't use bland disclaimers** like *"Demo-reviews"* or *"Lorem ipsum"*. The placeholder label is a sales asset — write it as one. *"Voorbeeldreviews — wordt gevuld met jullie Google-reviews bij livegang"* signals productized infrastructure; *"Demo-reviews"* signals incomplete work.
- **Don't auto-generate a fabricated doctor name or testimonial** when those fields are missing. Leave them out, use the neutral fallback, or label them as placeholder. Never fake-personal.
- **Don't put a practice's name over a stock photo** in the hero or gallery. That's the exact pattern that triggers retroactive distrust.
- **Don't ship reviews in `data/prospects.json` as placeholder fillers.** Per-prospect JSON is reserved for real data only. Placeholder content lives in `lib/`.
- **Don't skip the Google attribution** on real reviews. The link back to the Google Maps listing is what makes the section legally clean.

---

## 10. Success Criteria

- [ ] Prospect pages always render the reviews carousel and the practice gallery — neither section is ever empty.
- [ ] When real reviews ≥ 3 at 4★+, the carousel shows them with a Google Maps attribution link.
- [ ] When real reviews < 3 at 4★+, the carousel shows the 10 placeholder reviews with a section-level "Voorbeeldreviews" label and per-card "Voorbeeld" chips.
- [ ] When owner-uploaded photos ≥ 5, the gallery shows them with the existing "Foto's via Google" footer.
- [ ] When owner-uploaded photos < 5, the gallery shows 8 placeholder photos with the long subtitle and per-tile "Voorbeeld" chips.
- [ ] No real and placeholder content ever mix within the same section.
- [ ] The placeholder labeling reads as confident (a feature of the live system), not apologetic.
- [ ] `B2BClosingSection` includes a per-prospect personalization-status note listing what's real vs. example.
- [ ] No fabricated doctor names, fake "personalized" hero photos, or other fake-personal content anywhere on the page.

---

## 11. Future Iterations (Not This Round)

- **Reviewer-name realism.** When showing placeholder reviews, optionally vary one or two names per prospect (deterministic from the slug) so the same ten don't appear identically across the operator's prospect set.
- **Owner-supplied photo upload flow.** Once a prospect signals interest, a lightweight upload page (`/p/[slug]/upload`) lets them drop their own practice photos, which the operator then promotes into `data/prospects.json`. Closes the loop the gallery placeholder opens.
- **Per-prospect placeholder photo variety.** Maintain 16–20 stock photos and pick 8 deterministically per slug. Prevents the operator from seeing the same eight photos 50 times during QA.
- **Smart placeholder selection.** Match placeholder photo style to the practice's actual exterior (modern vs. classical) once we have a way to detect that from Places photos. Far-future.
- **Reviews-language auto-translation.** If `reviews.items` contains non-Dutch reviews, surface them with a small flag indicator rather than filter them out. Currently the schema supports it (`language`), the component doesn't use it.

---

**Status:** Ready for Phase 1. Pre-requisite is V1 shipped (which it is — four prospects already in `data/prospects.json`).
