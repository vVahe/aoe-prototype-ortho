import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

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

const LIVE_MODE = process.argv.includes('--live');
const TARGET: 'production' | 'preview' =
  process.argv.includes('--target=preview') ? 'preview' : 'production';

const API_KEY = process.env.GOOGLE_PLACES_API_KEY;
if (!API_KEY) {
  console.error('Missing GOOGLE_PLACES_API_KEY in .env');
  process.exit(1);
}

// ── Paths ─────────────────────────────────────────────────────────────────────

const PLACE_IDS_FILE = path.join(process.cwd(), 'data', 'place-ids.json');
const PROSPECTS_FILE = LIVE_MODE
  ? path.join(process.cwd(), 'data', TARGET === 'preview' ? 'prospects-preview.json' : 'prospects-live.json')
  : path.join(process.cwd(), 'data', 'prospects.json');
const JSON_BLOB_PATH = TARGET === 'preview'
  ? 'prospects-data/prospects-preview.json'
  : 'prospects-data/prospects-live.json';
const PHOTOS_BASE    = path.join(process.cwd(), 'public', 'images', 'prospects');
const BLOB_MANIFEST_FILE = path.join(process.cwd(), 'data', 'blob-manifest.json');

// Local cache: maps Blob pathname → { hash of last-uploaded buffer, returned URL }.
// Lets us skip re-uploading photos whose bytes haven't changed since the previous run.
type BlobManifest = Record<string, { hash: string; url: string }>;

function loadBlobManifest(): BlobManifest {
  if (!fs.existsSync(BLOB_MANIFEST_FILE)) return {};
  try {
    return JSON.parse(fs.readFileSync(BLOB_MANIFEST_FILE, 'utf-8')) as BlobManifest;
  } catch {
    return {};
  }
}

function saveBlobManifest(m: BlobManifest): void {
  fs.mkdirSync(path.dirname(BLOB_MANIFEST_FILE), { recursive: true });
  fs.writeFileSync(BLOB_MANIFEST_FILE, JSON.stringify(m, null, 2));
}

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
  photos?: { name: string; widthPx: number; heightPx: number; authorAttributions?: { displayName: string; uri: string; photoUri: string }[] }[];
  businessStatus?: string;
  primaryTypeDisplayName?: { text: string; languageCode: string };
  location?: { latitude: number; longitude: number };
  restroom?: boolean;
  parkingOptions?: {
    freeParkingLot?: boolean;
    paidParkingLot?: boolean;
    freeStreetParking?: boolean;
    paidStreetParking?: boolean;
    valetParking?: boolean;
  };
  accessibilityOptions?: {
    wheelchairAccessibleParking?: boolean;
    wheelchairAccessibleEntrance?: boolean;
    wheelchairAccessibleRestroom?: boolean;
    wheelchairAccessibleSeating?: boolean;
  };
  reviews?: {
    name: string;
    rating: number;
    text?: { text: string; languageCode: string };
    authorAttribution?: { displayName: string };
    publishTime?: string;
  }[];
}

// ── Nearby search ─────────────────────────────────────────────────────────────

interface NearbyPlace {
  displayName?: { text: string };
  location?: { latitude: number; longitude: number };
}

function haversineMeters(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6_371_000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

async function fetchNearby(
  lat: number,
  lng: number,
  types: string[],
  radiusMeters: number,
  max = 1,
): Promise<NearbyPlace[]> {
  try {
    const res = await fetch('https://places.googleapis.com/v1/places:searchNearby', {
      method: 'POST',
      headers: {
        'X-Goog-Api-Key': API_KEY!,
        'X-Goog-FieldMask': 'places.displayName,places.location',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        includedTypes: types,
        maxResultCount: max,
        locationRestriction: {
          circle: { center: { latitude: lat, longitude: lng }, radius: radiusMeters },
        },
      }),
    });
    if (!res.ok) return [];
    const data = (await res.json()) as { places?: NearbyPlace[] };
    return data.places ?? [];
  } catch {
    return [];
  }
}

async function buildTransportInfo(
  lat: number,
  lng: number,
  prev: { parking?: unknown; publicTransport?: unknown; bike?: unknown },
): Promise<{ parking?: string; publicTransport?: string; bike?: string }> {
  const [parkingPlaces, transitPlaces, trainPlaces] = await Promise.all([
    prev.parking   ? [] : fetchNearby(lat, lng, ['parking'], 500),
    prev.publicTransport ? [] : fetchNearby(lat, lng, ['bus_station', 'subway_station', 'light_rail_station'], 500),
    prev.bike      ? [] : fetchNearby(lat, lng, ['train_station', 'light_rail_station'], 3000),
  ]);

  const walkMin = (p: NearbyPlace) =>
    p.location ? Math.max(1, Math.round(haversineMeters(lat, lng, p.location.latitude, p.location.longitude) / 80)) : null;
  const bikeMin = (p: NearbyPlace) =>
    p.location ? Math.max(1, Math.round(haversineMeters(lat, lng, p.location.latitude, p.location.longitude) / 250)) : null;

  const result: { parking?: string; publicTransport?: string; bike?: string } = {
    parking:         prev.parking         as string | undefined,
    publicTransport: prev.publicTransport as string | undefined,
    bike:            prev.bike            as string | undefined,
  };

  if (!result.parking && parkingPlaces[0]) {
    const p = parkingPlaces[0];
    const name = p.displayName?.text ?? 'Parkeerplaats';
    const min = walkMin(p);
    result.parking = min
      ? `Parkeren mogelijk — ${min} min lopen naar ${name}`
      : `Parkeren bij ${name}`;
  }
  if (!result.publicTransport && transitPlaces[0]) {
    const p = transitPlaces[0];
    const name = p.displayName?.text ?? 'Bushalte';
    const min = walkMin(p);
    result.publicTransport = min ? `${min} min lopen van ${name}` : `Bereikbaar via ${name}`;
  }
  if (!result.bike && trainPlaces[0]) {
    const p = trainPlaces[0];
    const rawName = p.displayName?.text ?? 'het station';
    // Google Places often returns just the city name for train stations; always prefix with "Station"
    // unless the name already contains a station-related word.
    const stationName = /station|centraal|central/i.test(rawName) ? rawName : `Station ${rawName}`;
    const min = bikeMin(p);
    result.bike = min
      ? `${min} min fietsen van ${stationName}`
      : `Bereikbaar per fiets via ${stationName}`;
  }

  return result;
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
  'restroom',
  'parkingOptions',
  'accessibilityOptions',
].join(',');

async function fetchPlaceDetails(placeId: string): Promise<PlaceResult> {
  const res = await fetch(`https://places.googleapis.com/v1/places/${placeId}?languageCode=nl`, {
    headers: {
      'X-Goog-Api-Key': API_KEY!,
      'X-Goog-FieldMask': FIELD_MASK,
    },
  });
  if (!res.ok) throw new Error(`Places API ${res.status}: ${await res.text()}`);
  return res.json() as Promise<PlaceResult>;
}

function bufferHash(buf: Buffer): string {
  return crypto.createHash('md5').update(buf).digest('hex');
}

// Google returns up to 4800px wide; we resize after download.
// 1600 covers lightbox at 1440p displays and stays well under the 500 MB Blob free tier at scale.
const OUTPUT_MAX_WIDTH = 1600;

async function downloadPhoto(photoName: string, destPath: string): Promise<Buffer> {
  if (fs.existsSync(destPath)) return fs.readFileSync(destPath);
  const url = `https://places.googleapis.com/v1/${photoName}/media?maxWidthPx=4800&key=${API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Photo fetch ${res.status}`);
  const raw = Buffer.from(await res.arrayBuffer());
  const webp = await sharp(raw)
    .resize({ width: OUTPUT_MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toBuffer();
  fs.mkdirSync(path.dirname(destPath), { recursive: true });
  fs.writeFileSync(destPath, webp);
  return webp;
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

// ── Vercel env-var sync ───────────────────────────────────────────────────────

interface VercelEnvVar {
  id: string;
  key: string;
  value: string;
  target: string[];
}

async function syncVercelEnvVar(
  key: string,
  value: string,
  target: 'production' | 'preview',
): Promise<void> {
  const token = process.env.VERCEL_API_TOKEN;
  const projectId = process.env.VERCEL_PROJECT_ID;
  if (!token || !projectId) {
    console.log(`\nSkipping Vercel env-var sync — set VERCEL_API_TOKEN and VERCEL_PROJECT_ID in .env to automate.`);
    return;
  }

  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

  const listMatching = async (): Promise<VercelEnvVar[]> => {
    const res = await fetch(`https://api.vercel.com/v9/projects/${projectId}/env`, { headers });
    if (!res.ok) throw new Error(`Vercel env list failed (${res.status}): ${await res.text()}`);
    const { envs } = (await res.json()) as { envs: VercelEnvVar[] };
    return envs.filter(e => e.key === key);
  };

  const createEnv = async (val: string, targets: string[]): Promise<void> => {
    const res = await fetch(`https://api.vercel.com/v10/projects/${projectId}/env`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ key, value: val, type: 'plain', target: targets }),
    });
    if (!res.ok) throw new Error(`Vercel env create failed (${res.status}): ${await res.text()}`);
  };

  const patchEnv = async (id: string, val: string, targets: string[]): Promise<void> => {
    const res = await fetch(`https://api.vercel.com/v9/projects/${projectId}/env/${id}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ value: val, target: targets }),
    });
    if (!res.ok) throw new Error(`Vercel env update failed (${res.status}): ${await res.text()}`);
  };

  try {
    let matching = await listMatching();

    // Normalize: if a legacy combined record exists (target includes both production and preview),
    // split it into independent production-only and preview-only records so each can be updated independently.
    const combined = matching.find(e => e.target.includes('production') && e.target.includes('preview'));
    if (combined) {
      await patchEnv(combined.id, combined.value, ['production']);
      await createEnv(combined.value, ['preview']);
      console.log(`Split legacy ${key} into separate production + preview records.`);
      matching = await listMatching();
    }

    const prodEnv = matching.find(e => e.target.includes('production'));
    const previewEnv = matching.find(e => e.target.includes('preview'));

    if (target === 'production') {
      if (!prodEnv) {
        await createEnv(value, ['production']);
        console.log(`Vercel env var ${key} (production) created.`);
      } else if (prodEnv.value !== value) {
        await patchEnv(prodEnv.id, value, ['production']);
        console.log(`Vercel env var ${key} (production) updated.`);
      } else {
        console.log(`Vercel env var ${key} (production) already up to date.`);
      }
      // Default mirror: if no preview-specific record exists yet, create one pointing at production.
      if (!previewEnv) {
        await createEnv(value, ['preview']);
        console.log(`Vercel env var ${key} (preview) created — mirroring production.`);
      }
    } else {
      if (!previewEnv) {
        await createEnv(value, ['preview']);
        console.log(`Vercel env var ${key} (preview) created.`);
      } else if (previewEnv.value !== value) {
        await patchEnv(previewEnv.id, value, ['preview']);
        console.log(`Vercel env var ${key} (preview) updated.`);
      } else {
        console.log(`Vercel env var ${key} (preview) already up to date.`);
      }
    }
  } catch (err) {
    console.error(err);
  }
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  type BlobPutFn = (pathname: string, body: Buffer, opts: { access: 'public'; contentType: string; allowOverwrite: boolean }) => Promise<{ url: string }>;
  let blobPut: BlobPutFn | null = null;

  if (LIVE_MODE) {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.error('Missing BLOB_READ_WRITE_TOKEN in .env (required for --live mode)');
      process.exit(1);
    }
    const blobModule = await import('@vercel/blob');
    blobPut = blobModule.put as unknown as BlobPutFn;
    console.log(`Live mode: images will be uploaded to Vercel Blob (target: ${TARGET})\n`);
  }

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

  const blobManifest: BlobManifest = LIVE_MODE ? loadBlobManifest() : {};
  let blobUploads = 0;
  let blobSkips = 0;

  const results = [];

  for (const placeId of placeIds) {
    process.stdout.write(`  → ${placeId} … `);
    try {
      const place = await fetchPlaceDetails(placeId);
      const prev  = existing[placeId];
      const name  = place.displayName?.text ?? placeId;
      const slug  = (prev?.slug as string | undefined) ?? toSlug(name);
      const city  =
        fromAddressComponents(place.addressComponents, 'locality') ??
        fromAddressComponents(place.addressComponents, 'administrative_area_level_2');
      const postalCode = fromAddressComponents(place.addressComponents, 'postal_code');

      // Filter to landscape photos (width/height >= 1.2) to favour professional/owner shots,
      // then sort by pixel area descending so highest-quality images come first.
      const ownerName = place.displayName?.text ?? '';
      const candidatePhotos = (place.photos ?? [])
        .filter(p => p.authorAttributions?.[0]?.displayName === ownerName)
        .sort((a, b) => (b.widthPx * b.heightPx) - (a.widthPx * a.heightPx))
        .slice(0, 10);

      const photos: string[] = [];
      const seenHashes = new Set<string>();
      for (const photo of candidatePhotos) {
        const filename = `${photos.length + 1}.webp`;
        const destPath = path.join(PHOTOS_BASE, slug, filename);
        const buf = await downloadPhoto(photo.name, destPath);
        const hash = bufferHash(buf);
        if (seenHashes.has(hash)) {
          fs.unlinkSync(destPath);
          continue;
        }
        seenHashes.add(hash);
        if (LIVE_MODE && blobPut) {
          const blobPath = `prospects/${slug}/${filename}`;
          const cached = blobManifest[blobPath];
          let url: string;
          if (cached && cached.hash === hash) {
            url = cached.url;
            blobSkips++;
          } else {
            const result = await blobPut(blobPath, buf, {
              access: 'public',
              contentType: 'image/webp',
              allowOverwrite: true,
            });
            url = result.url;
            blobManifest[blobPath] = { hash, url };
            blobUploads++;
          }
          photos.push(url);
        } else {
          photos.push(`/images/prospects/${slug}/${filename}`);
        }
      }

      const prevLocation = (prev?.location as Record<string, unknown> | undefined) ?? {};
      const transport = place.location
        ? await buildTransportInfo(place.location.latitude, place.location.longitude, prevLocation)
        : { parking: prevLocation.parking as string | undefined, publicTransport: prevLocation.publicTransport as string | undefined, bike: prevLocation.bike as string | undefined };

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
          ...transport,
          ...(place.restroom !== undefined && { restroom: place.restroom }),
          ...(place.parkingOptions && { parkingOptions: place.parkingOptions }),
          ...(place.accessibilityOptions && { accessibilityOptions: place.accessibilityOptions }),
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
  const jsonBuf = Buffer.from(JSON.stringify(results, null, 2));
  fs.writeFileSync(PROSPECTS_FILE, jsonBuf);
  console.log(`\nWrote ${results.length} prospect(s) → ${PROSPECTS_FILE}`);

  if (LIVE_MODE && blobPut) {
    console.log(`Photo Blob uploads: ${blobUploads} new, ${blobSkips} skipped (already up to date).`);
    saveBlobManifest(blobManifest);

    const uploaded = await blobPut(JSON_BLOB_PATH, jsonBuf, {
      access: 'public',
      contentType: 'application/json',
      allowOverwrite: true,
    });
    console.log(`Uploaded JSON to Blob → ${uploaded.url} (${TARGET})`);
    await syncVercelEnvVar('PROSPECTS_BLOB_URL', uploaded.url, TARGET);
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
