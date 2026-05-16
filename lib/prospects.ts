import fs from 'node:fs';
import path from 'node:path';

// ── Types ──────────────────────────────────────────────────────────────────────

export type Prospect = {
  slug: string;
  practice: PracticeInfo;
  outreach: OutreachInfo;

  doctor?: DoctorInfo;
  reviews?: ReviewsInfo;
  hours?: HoursInfo;
  location?: LocationInfo;

  source?: ProspectSource;
  metadata?: Record<string, unknown>;
};

export type PracticeInfo = {
  name: string;
  shortName?: string;
  city?: string;
  address?: string;
  shortAddress?: string;
  postalCode?: string;
  phone?: string;
  internationalPhone?: string;
  email?: string;
  website?: string;
  placeId?: string;
  googleMapsUrl?: string;
  businessStatus?: 'OPERATIONAL' | 'CLOSED_TEMPORARILY' | 'CLOSED_PERMANENTLY' | string;
  photos?: string[];
};

export type DoctorInfo = {
  name?: string;
  salutation?: string;
};

export type ReviewsInfo = {
  rating?: number;
  count?: number;
  source?: 'google' | 'zorgkaart' | string;
  items?: ReviewItem[];
};

export type ReviewItem = {
  author?: string;
  rating?: number;
  text?: string;
  date?: string;
  language?: string;
};

export type HoursInfo = {
  weekdayText?: string[];
  periods?: { day: number; open: string; close: string }[];
};

export type LocationInfo = {
  lat?: number;
  lng?: number;
  parking?: string;
  publicTransport?: string;
  bike?: string;
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
};

export type OutreachInfo = {
  operatorName: string;
  createdAt: string;
  sentAt?: string;
  channel?: 'email' | 'linkedin';
};

export type ProspectSource = 'manual' | 'google_places' | 'mixed';

// ── Flattened view consumed by components ─────────────────────────────────────

export type ProspectView = {
  slug: string;
  practice: {
    name: string;
    shortName: string;
    city: string;
    address: string;
    phone: string;
    email: string;
    website?: string;
    googleMapsUrl?: string;
    photos?: string[];
  };
  doctor: { name: string; salutation: string };
  reviews: { rating: number; count: number; items: ReviewItem[] };
  hours: { weekdayText: string[] };
  location: {
    parking: string;
    publicTransport: string;
    bike: string;
    restroom?: boolean;
    parkingOptions?: LocationInfo['parkingOptions'];
    accessibilityOptions?: LocationInfo['accessibilityOptions'];
  };
  outreach: OutreachInfo;
};

// ── Demo prospect ──────────────────────────────────────────────────────────────
// Fixed permanent slug that always exists and always uses placeholder images.
// No photos or reviews are provided so resolvers fall back to placeholders.

export const DEMO_PROSPECT: Prospect = {
  slug: 'demo',
  practice: {
    name: 'Orthodontiepraktijk Verhoeven',
    shortName: 'Verhoeven Ortho',
    city: 'Utrecht',
    address: 'Maliebaan 45, 3581 CD Utrecht',
    shortAddress: 'Maliebaan 45, Utrecht',
    postalCode: '3581 CD',
    phone: '030 252 8890',
    internationalPhone: '+31 30 252 8890',
    email: 'info@orthodontieverhoeven.nl',
    website: 'https://www.orthodontieverhoeven.nl',
    googleMapsUrl: 'https://maps.google.com/?q=Maliebaan+45,+3581+CD+Utrecht',
    businessStatus: 'OPERATIONAL',
  },
  doctor: {
    name: 'Dr. S. Verhoeven',
    salutation: 'Dr. Verhoeven',
  },
  reviews: {
    rating: 4.9,
    count: 127,
    source: 'google',
    items: [],
  },
  hours: {
    weekdayText: [
      'Maandag: 08:30 – 17:30',
      'Dinsdag: 08:30 – 17:30',
      'Woensdag: 08:30 – 12:30',
      'Donderdag: 08:30 – 17:30',
      'Vrijdag: 08:30 – 16:00',
      'Zaterdag: Gesloten',
      'Zondag: Gesloten',
    ],
  },
  location: {
    lat: 52.0878,
    lng: 5.1257,
    parking: 'Betaald parkeren in de omgeving. Parkeergarage Maliebaan op 2 minuten loopafstand.',
    publicTransport: 'Buslijnen 5 en 11 stoppen op de hoek. Station Utrecht Centraal op 15 minuten loopafstand.',
    bike: 'Overdekte fietsenstalling direct naast de ingang.',
    restroom: true,
    parkingOptions: {
      paidParkingLot: true,
      paidStreetParking: true,
    },
    accessibilityOptions: {
      wheelchairAccessibleParking: true,
      wheelchairAccessibleEntrance: true,
    },
  },
  outreach: {
    operatorName: 'AOE',
    createdAt: '2025-01-01T00:00:00.000Z',
  },
};

// ── Loader ─────────────────────────────────────────────────────────────────────

let prospectsPromise: Promise<Prospect[]> | null = null;

function loadProspects(): Promise<Prospect[]> {
  prospectsPromise ??= (async () => {
    const blobUrl = process.env.PROSPECTS_BLOB_URL;
    if (blobUrl) {
      const res = await fetch(blobUrl, { cache: 'no-store' });
      if (!res.ok) {
        throw new Error(`Failed to fetch PROSPECTS_BLOB_URL (${res.status}): ${blobUrl}`);
      }
      return (await res.json()) as Prospect[];
    }

    for (const filename of ['prospects-live.json', 'prospects.json']) {
      const filePath = path.join(process.cwd(), 'data', filename);
      if (fs.existsSync(filePath)) {
        return JSON.parse(fs.readFileSync(filePath, 'utf-8')) as Prospect[];
      }
    }
    return [];
  })();
  return prospectsPromise;
}

// ── Accessors ──────────────────────────────────────────────────────────────────

export async function getProspectBySlug(slug: string): Promise<Prospect | null> {
  if (slug === 'demo') return DEMO_PROSPECT;
  const all = await loadProspects();
  return all.find((p) => p.slug === slug) ?? null;
}

export async function getAllSlugs(): Promise<string[]> {
  const all = await loadProspects();
  return ['demo', ...all.map((p) => p.slug)];
}

// ── View helper ────────────────────────────────────────────────────────────────
// Resolves missing fields to neutral generic defaults — NOT De Boog data.
// Components consume ProspectView; they never write `prospect?.practice?.city ?? default` themselves.

export function getProspectView(prospect: Prospect): ProspectView {
  const { slug, practice, doctor, reviews, hours, location, outreach } = prospect;

  return {
    slug,
    practice: {
      name: practice.name,
      shortName: practice.shortName ?? practice.name,
      city: practice.city ?? 'uw regio',
      address: practice.address ?? '',
      phone: practice.phone ?? '',
      email: practice.email ?? '',
      website: practice.website,
      googleMapsUrl: practice.googleMapsUrl,
      photos: practice.photos,
    },
    doctor: {
      name: doctor?.name ?? 'Onze orthodontist',
      salutation: doctor?.salutation ?? 'De orthodontist',
    },
    reviews: {
      rating: reviews?.rating ?? 4.9,
      count: reviews?.count ?? 0,
      items: reviews?.items ?? [],
    },
    hours: {
      weekdayText: hours?.weekdayText ?? [],
    },
    location: {
      parking: location?.parking ?? '',
      publicTransport: location?.publicTransport ?? '',
      bike: location?.bike ?? '',
      restroom: location?.restroom,
      parkingOptions: location?.parkingOptions,
      accessibilityOptions: location?.accessibilityOptions,
    },
    outreach,
  };
}
