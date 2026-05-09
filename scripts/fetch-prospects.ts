import fs from 'node:fs';
import path from 'node:path';

// ── Env ───────────────────────────────────────────────────────────────────────

function loadDotEnv() {
  const p = path.join(process.cwd(), '.env');
  if (!fs.existsSync(p)) return;
  for (const line of fs.readFileSync(p, 'utf-8').split('\n')) {
    const eq = line.indexOf('=');
    if (eq < 1) continue;
    const key = line.slice(0, eq).trim();
    const val = line.slice(eq + 1).trim();
    if (key && !(key in process.env)) process.env[key] = val;
  }
}

loadDotEnv();

const API_KEY = process.env.GOOGLE_PLACES_API_KEY;
if (!API_KEY) {
  console.error('Missing GOOGLE_PLACES_API_KEY in .env');
  process.exit(1);
}

// ── Paths ─────────────────────────────────────────────────────────────────────

const PLACE_IDS_FILE = path.join(process.cwd(), 'data', 'place-ids.json');
const PROSPECTS_FILE = path.join(process.cwd(), 'data', 'prospects.json');
const PHOTOS_BASE    = path.join(process.cwd(), 'public', 'images', 'prospects');

// ── Places API types ──────────────────────────────────────────────────────────

interface AddressComponent {
  longText: string;
  shortText: string;
  types: string[];
}

interface OpeningHoursPeriodPoint {
  day: number;
  hour: number;
  minute: number;
}

interface PlaceResult {
  id: string;
  displayName?: { text: string; languageCode: string };
  shortFormattedAddress?: string;
  formattedAddress?: string;
  addressComponents?: AddressComponent[];
  nationalPhoneNumber?: string;
  internationalPhoneNumber?: string;
  websiteUri?: string;
  googleMapsUri?: string;
  rating?: number;
  userRatingCount?: number;
  regularOpeningHours?: {
    weekdayDescriptions?: string[];
    periods?: { open: OpeningHoursPeriodPoint; close: OpeningHoursPeriodPoint }[];
  };
  photos?: { name: string; widthPx: number; heightPx: number }[];
  businessStatus?: string;
  primaryTypeDisplayName?: { text: string; languageCode: string };
  location?: { latitude: number; longitude: number };
  reviews?: {
    name: string;
    rating: number;
    text?: { text: string; languageCode: string };
    authorAttribution?: { displayName: string };
    publishTime?: string;
  }[];
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const FIELD_MASK = [
  'id',
  'displayName',
  'shortFormattedAddress',
  'formattedAddress',
  'addressComponents',
  'nationalPhoneNumber',
  'internationalPhoneNumber',
  'websiteUri',
  'googleMapsUri',
  'rating',
  'userRatingCount',
  'regularOpeningHours',
  'photos',
  'businessStatus',
  'primaryTypeDisplayName',
  'location',
  'reviews',
].join(',');

async function fetchPlaceDetails(placeId: string): Promise<PlaceResult> {
  const res = await fetch(`https://places.googleapis.com/v1/places/${placeId}`, {
    headers: {
      'X-Goog-Api-Key': API_KEY!,
      'X-Goog-FieldMask': FIELD_MASK,
    },
  });
  if (!res.ok) throw new Error(`Places API ${res.status}: ${await res.text()}`);
  return res.json() as Promise<PlaceResult>;
}

async function downloadPhoto(photoName: string, destPath: string): Promise<void> {
  if (fs.existsSync(destPath)) return;
  const url = `https://places.googleapis.com/v1/${photoName}/media?maxWidthPx=1200&key=${API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Photo fetch ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.mkdirSync(path.dirname(destPath), { recursive: true });
  fs.writeFileSync(destPath, buf);
}

function fromAddressComponents(components: AddressComponent[] | undefined, type: string) {
  return components?.find(c => c.types.includes(type))?.longText;
}

function randomSuffix(): string {
  return Math.random().toString(36).slice(2, 6);
}

function toSlug(name: string): string {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/[\s-]+/g, '-');
  return `${base}-${randomSuffix()}`;
}

function pad(n: number) {
  return String(n).padStart(2, '0');
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  if (!fs.existsSync(PLACE_IDS_FILE)) {
    console.error(`Missing ${PLACE_IDS_FILE} — create it with an array of Google Place IDs.`);
    process.exit(1);
  }

  const placeIds: string[] = JSON.parse(fs.readFileSync(PLACE_IDS_FILE, 'utf-8'));
  console.log(`Fetching ${placeIds.length} place(s)…\n`);

  // Preserve existing outreach + manual fields by placeId key
  const existing: Record<string, Record<string, unknown>> = {};
  if (fs.existsSync(PROSPECTS_FILE)) {
    const arr = JSON.parse(fs.readFileSync(PROSPECTS_FILE, 'utf-8')) as Record<string, unknown>[];
    for (const p of arr) {
      const id = (p.practice as Record<string, unknown>)?.placeId as string;
      if (id) existing[id] = p;
    }
  }

  const results = [];

  for (const placeId of placeIds) {
    process.stdout.write(`  → ${placeId} … `);
    try {
      const place = await fetchPlaceDetails(placeId);
      const name  = place.displayName?.text ?? placeId;
      const slug  = (prev?.slug as string | undefined) ?? toSlug(name);
      const city  =
        fromAddressComponents(place.addressComponents, 'locality') ??
        fromAddressComponents(place.addressComponents, 'administrative_area_level_2');
      const postalCode = fromAddressComponents(place.addressComponents, 'postal_code');

      // Download up to 3 photos; skip if file already exists
      const photos: string[] = [];
      for (const photo of (place.photos ?? []).slice(0, 3)) {
        const filename = `${photos.length + 1}.jpg`;
        const destPath = path.join(PHOTOS_BASE, slug, filename);
        await downloadPhoto(photo.name, destPath);
        photos.push(`/images/prospects/${slug}/${filename}`);
      }

      const prev = existing[placeId];

      results.push({
        slug,
        practice: {
          name,
          city,
          address: place.formattedAddress,
          shortAddress: place.shortFormattedAddress,
          postalCode,
          phone: place.nationalPhoneNumber,
          internationalPhone: place.internationalPhoneNumber,
          website: place.websiteUri,
          placeId: place.id,
          googleMapsUrl: place.googleMapsUri,
          businessStatus: place.businessStatus,
          photos,
        },
        reviews: {
          rating: place.rating,
          count: place.userRatingCount,
          source: 'google',
          items: place.reviews?.map(r => ({
            author: r.authorAttribution?.displayName,
            rating: r.rating,
            text: r.text?.text,
            date: r.publishTime,
            language: r.text?.languageCode,
          })),
        },
        hours: {
          weekdayText: place.regularOpeningHours?.weekdayDescriptions,
          periods: place.regularOpeningHours?.periods?.map(p => ({
            day:   p.open.day,
            open:  `${pad(p.open.hour)}:${pad(p.open.minute)}`,
            close: `${pad(p.close.hour)}:${pad(p.close.minute)}`,
          })),
        },
        location: {
          lat: place.location?.latitude,
          lng: place.location?.longitude,
          parking:         (prev?.location as Record<string, unknown> | undefined)?.parking,
          publicTransport: (prev?.location as Record<string, unknown> | undefined)?.publicTransport,
        },
        outreach: prev?.outreach ?? {
          operatorName: '',
          createdAt: new Date().toISOString().split('T')[0],
        },
        source: 'google_places',
      });

      console.log(`✓ ${name} (${photos.length} photo${photos.length !== 1 ? 's' : ''})`);
    } catch (err) {
      console.log(`✗ ${err}`);
    }
  }

  fs.mkdirSync(path.dirname(PROSPECTS_FILE), { recursive: true });
  fs.writeFileSync(PROSPECTS_FILE, JSON.stringify(results, null, 2));
  console.log(`\nWrote ${results.length} prospect(s) → ${PROSPECTS_FILE}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
