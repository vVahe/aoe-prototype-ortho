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
  reviews: { rating: number; count: number };
  hours: { weekdayText: string[] };
  location: { parking: string; publicTransport: string };
  outreach: OutreachInfo;
};

// ── Loader ─────────────────────────────────────────────────────────────────────

function loadProspects(): Prospect[] {
  const fromEnv = process.env.PROSPECTS_JSON;
  if (fromEnv) return JSON.parse(fromEnv) as Prospect[];

  const filePath = path.join(process.cwd(), 'data', 'prospects.json');
  if (fs.existsSync(filePath)) {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8')) as Prospect[];
  }
  return [];
}

const prospects = loadProspects();

// ── Accessors ──────────────────────────────────────────────────────────────────

export function getAllProspects(): Prospect[] {
  return prospects;
}

export function getProspectBySlug(slug: string): Prospect | null {
  return prospects.find((p) => p.slug === slug) ?? null;
}

export function getAllSlugs(): string[] {
  return prospects.map((p) => p.slug);
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
    },
    hours: {
      weekdayText: hours?.weekdayText ?? [],
    },
    location: {
      parking: location?.parking ?? '',
      publicTransport: location?.publicTransport ?? '',
    },
    outreach,
  };
}
